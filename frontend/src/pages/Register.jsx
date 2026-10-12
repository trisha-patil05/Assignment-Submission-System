import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [validations, setValidations] = useState({
    nameValid: false,
    emailValid: false,
    passwordLength: false,
    passwordUppercase: false,
    passwordNumber: false,
    passwordSpecial: false,
    passwordsMatch: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const nameInput = document.getElementById("register-name");
    if (nameInput) nameInput.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "name") {
      setValidations(prev => ({ ...prev, nameValid: value.trim().length >= 2 }));
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidations(prev => ({ ...prev, emailValid: emailRegex.test(value) }));
    }

    if (name === "password") {
      const length = value.length >= 8;
      const uppercase = /[A-Z]/.test(value);
      const number = /[0-9]/.test(value);
      const special = /[!@#$%^&*]/.test(value);

      setValidations(prev => ({
        ...prev,
        passwordLength: length,
        passwordUppercase: uppercase,
        passwordNumber: number,
        passwordSpecial: special,
        passwordsMatch: value === formData.confirmPassword && value.length > 0
      }));

      let strength = 0;
      if (length) strength++;
      if (uppercase) strength++;
      if (number) strength++;
      if (special) strength++;
      setPasswordStrength(strength);
    }

    if (name === "confirmPassword") {
      setValidations(prev => ({
        ...prev,
        passwordsMatch: value === formData.password && value.length > 0
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validations.nameValid || !validations.emailValid) {
      setError("Please enter valid name and email");
      return;
    }

    if (!validations.passwordLength || !validations.passwordUppercase || !validations.passwordNumber || !validations.passwordSpecial) {
      setError("Password must meet all requirements");
      return;
    }

    if (!validations.passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to Terms & Conditions");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        setSuccess("✅ Account created! Redirecting...");
        
        setTimeout(() => {
          navigate(data.user.role === "mentor" ? "/mentor" : "/student");
        }, 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#84cc16"];

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
          marginBottom: "0.9rem"
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
            Join & Start Learning
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
          }}>Create Account 🚀</h2>
          <p style={{
            color: "#cbd5e1",
            fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
            margin: "0 0 0.8rem 0"
          }}>Sign up to get started</p>

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
            {/* FULL NAME - COMPACT */}
            <div style={{ marginBottom: "0.7rem" }}>
              <label style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "0.25rem"
              }}>
                👤 Name
                {formData.name && (validations.nameValid ? <span style={{ color: "#10b981" }}>✅</span> : <span style={{ color: "#ef4444" }}>❌</span>)}
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  background: "#0f172a",
                  border: `1.5px solid ${formData.name && !validations.nameValid ? "#ef4444" : validations.nameValid ? "#10b981" : "#334155"}`,
                  borderRadius: "8px",
                  color: "#f1f5f9",
                  fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* EMAIL - COMPACT */}
            <div style={{ marginBottom: "0.7rem" }}>
              <label style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "0.25rem"
              }}>
                📧 Email
                {formData.email && (validations.emailValid ? <span style={{ color: "#10b981" }}>✅</span> : <span style={{ color: "#ef4444" }}>❌</span>)}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  background: "#0f172a",
                  border: `1.5px solid ${formData.email && !validations.emailValid ? "#ef4444" : validations.emailValid ? "#10b981" : "#334155"}`,
                  borderRadius: "8px",
                  color: "#f1f5f9",
                  fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* ROLE SELECTION - COMPACT */}
            <div style={{ marginBottom: "0.7rem" }}>
              <label style={{
                display: "block",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "0.25rem"
              }}>👥 Role</label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem"
              }}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: "student" }))}
                  style={{
                    padding: "0.6rem",
                    background: formData.role === "student" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#0f172a",
                    border: formData.role === "student" ? "2px solid #6366f1" : "1.5px solid #334155",
                    borderRadius: "8px",
                    color: formData.role === "student" ? "#fff" : "#cbd5e1",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                    boxSizing: "border-box"
                  }}
                >
                  👨‍🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: "mentor" }))}
                  style={{
                    padding: "0.6rem",
                    background: formData.role === "mentor" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "#0f172a",
                    border: formData.role === "mentor" ? "2px solid #6366f1" : "1.5px solid #334155",
                    borderRadius: "8px",
                    color: formData.role === "mentor" ? "#fff" : "#cbd5e1",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                    boxSizing: "border-box"
                  }}
                >
                  👨‍🏫 Mentor
                </button>
              </div>
            </div>

            {/* PASSWORD - COMPACT */}
            <div style={{ marginBottom: "0.7rem" }}>
              <label style={{
                display: "block",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "0.25rem"
              }}>🔒 Password</label>
              <div style={{ position: "relative", marginBottom: "0.25rem" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "0.6rem 2.3rem 0.6rem 0.8rem",
                    background: "#0f172a",
                    border: "1.5px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    boxSizing: "border-box"
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
              {formData.password && (
                <div>
                  <div style={{
                    width: "100%",
                    height: "4px",
                    background: "#0f172a",
                    borderRadius: "2px",
                    overflow: "hidden",
                    marginBottom: "0.3rem"
                  }}>
                    <div style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      height: "100%",
                      background: strengthColors[passwordStrength - 1] || "#ef4444",
                      transition: "all 0.3s ease"
                    }} />
                  </div>
                  <div style={{
                    background: "#0f172a",
                    padding: "0.4rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)"
                  }}>
                    <div style={{ color: validations.passwordLength ? "#10b981" : "#cbd5e1", marginBottom: "0.15rem" }}>
                      {validations.passwordLength ? "✅" : "❌"} 8+ chars
                    </div>
                    <div style={{ color: validations.passwordUppercase ? "#10b981" : "#cbd5e1", marginBottom: "0.15rem" }}>
                      {validations.passwordUppercase ? "✅" : "❌"} Uppercase
                    </div>
                    <div style={{ color: validations.passwordNumber ? "#10b981" : "#cbd5e1", marginBottom: "0.15rem" }}>
                      {validations.passwordNumber ? "✅" : "❌"} Number
                    </div>
                    <div style={{ color: validations.passwordSpecial ? "#10b981" : "#cbd5e1" }}>
                      {validations.passwordSpecial ? "✅" : "❌"} Special
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD - COMPACT */}
            <div style={{ marginBottom: "0.7rem" }}>
              <label style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                fontWeight: "600",
                color: "#cbd5e1",
                marginBottom: "0.25rem"
              }}>
                ✓ Confirm
                {formData.confirmPassword && (validations.passwordsMatch ? <span style={{ color: "#10b981", fontSize: "clamp(0.65rem, 2vw, 0.75rem)" }}>✅ Match</span> : <span style={{ color: "#ef4444", fontSize: "clamp(0.65rem, 2vw, 0.75rem)" }}>❌</span>)}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "0.6rem 2.3rem 0.6rem 0.8rem",
                    background: "#0f172a",
                    border: `1.5px solid ${formData.confirmPassword && !validations.passwordsMatch ? "#ef4444" : validations.passwordsMatch ? "#10b981" : "#334155"}`,
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
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
                  {showConfirm ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* TERMS - COMPACT */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              marginBottom: "0.8rem"
            }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  accentColor: "#6366f1",
                  flexShrink: 0,
                  marginTop: "0.1rem"
                }}
              />
              <label htmlFor="terms" style={{
                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                color: "#cbd5e1",
                cursor: "pointer",
                lineHeight: "1.3"
              }}>
              I agree to <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Terms</a> & <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Privacy</a>
              </label>
            </div>

            {/* SUBMIT BUTTON - COMPACT */}
            <button
              type="submit"
              disabled={loading || !validations.nameValid || !validations.emailValid || !validations.passwordLength || !validations.passwordUppercase || !validations.passwordNumber || !validations.passwordSpecial || !validations.passwordsMatch || !agreeTerms}
              style={{
                width: "100%",
                padding: "0.7rem",
                background: (loading || !validations.nameValid || !validations.emailValid || !validations.passwordLength || !validations.passwordUppercase || !validations.passwordNumber || !validations.passwordSpecial || !validations.passwordsMatch || !agreeTerms)
                  ? "#475569"
                  : "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                cursor: (loading || !validations.nameValid || !validations.emailValid || !validations.passwordLength || !validations.passwordUppercase || !validations.passwordNumber || !validations.passwordSpecial || !validations.passwordsMatch || !agreeTerms) ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
                opacity: (loading || !validations.nameValid || !validations.emailValid || !validations.passwordLength || !validations.passwordUppercase || !validations.passwordNumber || !validations.passwordSpecial || !validations.passwordsMatch || !agreeTerms) ? 0.6 : 1
              }}
            >
              {loading ? "🔄 Creating..." : "✨ Create"}
            </button>
          </form>

          {/* DIVIDER */}
          <div style={{ margin: "0.8rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#334155" }} />
            <span style={{ color: "#94a3b8", fontSize: "clamp(0.7rem, 2vw, 0.75rem)" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#334155" }} />
          </div>

          {/* LOGIN LINK */}
          <p style={{
            textAlign: "center",
            color: "#cbd5e1",
            fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
            margin: "0.7rem 0 0 0"
          }}>
            Have account? <a href="/login" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "700", cursor: "pointer" }}>Sign in</a>
          </p>
        </div>

        {/* INFO */}
        <div style={{
          marginTop: "0.7rem",
          background: "rgba(99, 102, 241, 0.1)",
          border: "1px solid #6366f1",
          padding: "0.6rem 0.8rem",
          borderRadius: "8px",
          color: "#a5b4fc",
          fontSize: "clamp(0.65rem, 2vw, 0.75rem)",
          textAlign: "center"
        }}>
          ✨ Complete profile after registration!
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