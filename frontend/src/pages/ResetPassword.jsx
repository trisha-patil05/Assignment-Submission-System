import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Login.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.password || !form.confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password: form.password }
      );

      setMessage(res.data.message || "Password reset successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="assignment-login">
      <div className="bg-animation">
        <div className="floating-el" style={{ top: "12%", left: "8%", animationDelay: "0s" }}>🔐</div>
        <div className="floating-el" style={{ top: "22%", right: "12%", animationDelay: "1s" }}>🛡️</div>
        <div className="floating-el" style={{ bottom: "20%", left: "10%", animationDelay: "2s" }}>🔑</div>
        <div className="floating-el" style={{ bottom: "12%", right: "14%", animationDelay: "3s" }}>✨</div>
      </div>

      <div className="login-container">
        <div className={`login-panel ${animate ? "animate-in" : ""}`}>
          <div className="brand-section">
            <div className="brand-logo-wrap">
              <div className="logo-glow"></div>
              <div className="logo-emoji">🔐</div>
            </div>
            <div className="brand-name">EduTrack</div>

            <div className="brand-roles">
              <span className="role-chip student-chip">Secure</span>
              <span className="role-chip mentor-chip">Reset</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="welcome-section">
            <h2>Create New Password</h2>
            <p>Set a strong password to access your account again.</p>
          </div>

          {error && <div className="error-toast">{error}</div>}
          {message && <div className="message-toast">{message}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label>New Password</label>
              <div className="input-wrap">
                <span className="field-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <span className="field-icon">✅</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading && <span className="spinner"></span>}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="footer-link">
            Back to <Link to="/login">Sign In</Link>
          </div>
        </div>

        <div className="right-panel">
          <div className="live-badge">SECURE</div>

          <div className="right-title">
            <h3>Quick and safe recovery</h3>
            <p>Restore access to your account in a few steps</p>
          </div>

          <div className="flow-section">
            <div className="flow-card student-card">
              <div className="flow-icon">📩</div>
              <div className="flow-info">
                <div className="flow-label">Reset link received</div>
                <div className="flow-desc">Open the secure link from your email.</div>
              </div>
              <div className="flow-status green">Step 1</div>
            </div>

            <div className="flow-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
              <div className="connector-line"></div>
            </div>

            <div className="flow-card assign-card">
              <div className="flow-icon">🔑</div>
              <div className="flow-info">
                <div className="flow-label">Choose new password</div>
                <div className="flow-desc">Create a secure password for future sign in.</div>
              </div>
              <div className="flow-status yellow">Step 2</div>
            </div>

            <div className="flow-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
              <div className="connector-line"></div>
            </div>

            <div className="flow-card mentor-card">
              <div className="flow-icon">✅</div>
              <div className="flow-info">
                <div className="flow-label">Access restored</div>
                <div className="flow-desc">Return to login and continue normally.</div>
              </div>
              <div className="flow-status orange">Step 3</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">15m</div>
              <div className="stat-label">Token validity</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">100%</div>
              <div className="stat-label">Encrypted flow</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">24/7</div>
              <div className="stat-label">Account access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}