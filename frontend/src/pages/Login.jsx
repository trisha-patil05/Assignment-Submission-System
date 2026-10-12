import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const emailInput = document.getElementById("login-email");
    if (emailInput) emailInput.focus();
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(false);
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setPasswordValid(password.length >= 6);
      let strength = 0;
      if (password.length >= 6) strength++;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[!@#$%^&*]/.test(password)) strength++;
      setPasswordStrength(Math.min(strength, 4));
    } else {
      setPasswordValid(false);
      setPasswordStrength(0);
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailValid || !passwordValid) {
      setError("Please enter valid email and password");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        setSuccess("✅ Login successful! Redirecting...");
        
        setTimeout(() => {
          navigate(data.user.role === "mentor" ? "/mentor" : "/student");
        }, 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthEmojis = ["🔴", "🟠", "🟡", "🟢", "💚"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0.75rem",
      fontFamily: "inherit"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "100%",
        padding: "0.75rem"
      }}>
        {/* LOGO & HEADER - COMPACT */}
        <div style={{
          textAlign: "center",
          marginBottom: "1rem"
        }}>
          <div style={{ fontSize: "clamp(2rem, 8vw, 3rem)", marginBottom: "0.4rem", lineHeight: "1" }}>📚</div>
          <h1 style={{
            fontSize: "clamp(1.3rem, 6vw, 1.8rem)",
            fontWeight: "800",
            color: "#f1f5f9",
            margin: "0 0 0.15rem 0",
            background: "linear-gradient(135deg, #6366f1, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            AssignmentHub
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "clamp(0.7rem, 2.5vw, 0.85rem)", margin: "0" }}>
            Track. Submit. Grade. Learn.
          </p>
        </div>

        {/* FORM CARD - COMPACT */}
        <div style={{
          background: "#1e293b",
          padding: "clamp(1.2rem, 4vw, 1.5rem)",
          borderRadius: "14px",
          border: "1px solid #334155",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h2 style={{
            fontSize: "clamp(1rem, 3.5vw, 1.2rem)",
            fontWeight: "700",
            color: "#f1f5f9",
            margin: "0 0 0.2rem 0"
          }}>Welcome Back 👋</h2>
          <p style={{
            color: "#cbd5e1",
            fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
            margin: "0 0 0.9rem 0"
          }}>Sign in to your account</p>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
              color: "#34d399",
              padding: "0.6rem 0.9rem",
              borderRadius: "8px",
              marginBottom: "0.8rem",
              fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
              animation: "slideIn 0.3s ease"
            }}>
              {success}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
              color: "#fca5a5",
              padding: "0.6rem 0.9rem",
              borderRadius: "8px",
              marginBottom: "0.8rem",
              fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
              display: "flex",
              gap: "0.4rem",
              alignItems: "flex-start"
            }}>
              <span style={{ flexShrink: 0 }}>❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            {/* EMAIL - COMPACT */}
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "0.3rem"
              }}>
                📧 Email
                {email && (emailValid ? <span style={{ color: "#10b981" }}>✅</span> : <span style={{ color: "#ef4444" }}>❌</span>)}
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  background: "#0f172a",
                  border: `1.5px solid ${email && !emailValid ? "#ef4444" : emailValid ? "#10b981" : "#334155"}`,
                  borderRadius: "8px",
                  color: "#f1f5f9",
                  fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.background = "#1e293b";
                }}
                onBlur={(e) => {
                  if (emailValid) e.target.style.borderColor = "#10b981";
                  else if (email) e.target.style.borderColor = "#ef4444";
                  else e.target.style.borderColor = "#334155";
                  e.target.style.background = "#0f172a";
                }}
              />
            </div>

            {/* PASSWORD - COMPACT */}
            <div style={{ marginBottom: "0.8rem" }}>
              <label style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "0.3rem"
              }}>
                🔒 Password
                {password && (
                  <span style={{ fontSize: "clamp(0.65rem, 2vw, 0.75rem)" }}>
                    {passwordStrength === 0 && "🔴"}
                    {passwordStrength === 1 && "🟠"}
                    {passwordStrength === 2 && "🟡"}
                    {passwordStrength === 3 && "🟢"}
                    {passwordStrength === 4 && "💚"}
                  </span>
                )}
              </label>
              <div style={{ position: "relative", marginBottom: "0.3rem" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "0.6rem 2.4rem 0.6rem 0.8rem",
                    background: "#0f172a",
                    border: `1.5px solid ${password && !passwordValid ? "#ef4444" : passwordValid ? "#10b981" : "#334155"}`,
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.background = "#1e293b";
                  }}
                  onBlur={(e) => {
                    if (passwordValid) e.target.style.borderColor = "#10b981";
                    else if (password) e.target.style.borderColor = "#ef4444";
                    else e.target.style.borderColor = "#334155";
                    e.target.style.background = "#0f172a";
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && emailValid && passwordValid) {
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.6rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#cbd5e1",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    padding: "0.3rem"
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* PASSWORD STRENGTH BAR - COMPACT */}
              {password && (
                <div style={{
                  width: "100%",
                  height: "4px",
                  background: "#0f172a",
                  borderRadius: "2px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    height: "100%",
                    background: strengthColors[passwordStrength] || "#334155",
                    transition: "all 0.3s ease",
                    borderRadius: "2px"
                  }} />
                </div>
              )}
            </div>

            {/* REMEMBER ME - COMPACT */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.9rem",
              gap: "0.5rem"
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                color: "#cbd5e1",
                cursor: "pointer",
                userSelect: "none"
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    accentColor: "#6366f1"
                  }}
                />
                Remember
              </label>
              <a href="/forgot-password" style={{
                color: "#6366f1",
                textDecoration: "none",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600"
              }}>
                Forgot?
              </a>
            </div>

            {/* SUBMIT BUTTON - COMPACT */}
            <button
              type="submit"
              disabled={loading || !emailValid || !passwordValid}
              style={{
                width: "100%",
                padding: "0.7rem",
                background: (loading || !emailValid || !passwordValid) 
                  ? "#475569" 
                  : "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                cursor: (loading || !emailValid || !passwordValid) ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
                opacity: (loading || !emailValid || !passwordValid) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading && emailValid && passwordValid) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 32px rgba(99, 102, 241, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && emailValid && passwordValid) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.4)";
                }
              }}
            >
              {loading ? "🔄 Signing in..." : "🚀 Sign In"}
            </button>
          </form>

          {/* DIVIDER - COMPACT */}
          <div style={{ margin: "0.8rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#334155" }} />
            <span style={{ color: "#94a3b8", fontSize: "clamp(0.7rem, 2vw, 0.75rem)" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#334155" }} />
          </div>

          {/* SIGNUP LINK - COMPACT */}
          <p style={{
            textAlign: "center",
            color: "#cbd5e1",
            fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
            margin: "0.8rem 0 0 0"
          }}>
            No account?{" "}
            <a href="/register" style={{
              color: "#6366f1",
              textDecoration: "none",
              fontWeight: "700",
              cursor: "pointer"
            }}>
              Create one
            </a>
          </p>
        </div>

        {/* TEST ACCOUNTS - COMPACT */}
        <div style={{
          marginTop: "0.8rem",
          background: "rgba(99, 102, 241, 0.1)",
          border: "1px solid #6366f1",
          padding: "0.7rem 0.9rem",
          borderRadius: "10px",
          color: "#a5b4fc",
          fontSize: "clamp(0.65rem, 2vw, 0.75rem)"
        }}>
          <p style={{ margin: "0 0 0.3rem 0", fontWeight: "700" }}>🧪 Test:</p>
          <p style={{ margin: "0.15rem 0" }}>mentor@example.com / password123</p>
          <p style={{ margin: "0.15rem 0" }}>student@example.com / password123</p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}