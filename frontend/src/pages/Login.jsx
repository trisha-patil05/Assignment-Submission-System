import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const token = res.data.token;
      const base64 = token.split(".")[1];
      const decoded = JSON.parse(atob(base64));

      const user = {
        _id: decoded.id,
        role: decoded.role,
        email: form.email,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      navigate(user.role === "mentor" ? "/mentor" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!form.email.trim()) {
      setError("Please enter your email first.");
      return;
    }

    setForgotLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: form.email,
      });

      setMessage(res.data.message || "Password reset email sent successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email.");
    } finally {
      setForgotLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="assignment-login">
      <div className="bg-animation">
        <div className="floating-el" style={{ top: "12%", left: "8%", animationDelay: "0s" }}>📚</div>
        <div className="floating-el" style={{ top: "22%", right: "12%", animationDelay: "1s" }}>✏️</div>
        <div className="floating-el" style={{ bottom: "20%", left: "10%", animationDelay: "2s" }}>🧠</div>
        <div className="floating-el" style={{ bottom: "12%", right: "14%", animationDelay: "3s" }}>🎓</div>
      </div>

      <div className="login-container">
        <div className={`login-panel ${animate ? "animate-in" : ""}`}>
          <div className="brand-section">
            <div className="brand-logo-wrap">
              <div className="logo-glow"></div>
              <div className="logo-emoji">📘</div>
            </div>
            <div className="brand-name">EduTrack</div>

            <div className="brand-roles">
              <span className="role-chip student-chip">Student</span>
              <span className="role-chip mentor-chip">Mentor</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="welcome-section">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your learning workflow.</p>
          </div>

          {error && <div className="error-toast">{error}</div>}
          {message && <div className="message-toast">{message}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="field-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="field-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-meta-row">
              <button
                type="button"
                className="forgot-link-btn"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
              >
                {forgotLoading ? "Sending..." : "Forgot Password?"}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading && <span className="spinner"></span>}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="footer-link">
            Don&apos;t have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>

        <div className="right-panel">
          <div className="live-badge">LIVE</div>

          <div className="right-title">
            <h3>From submission to feedback</h3>
            <p>Everything you need in one place</p>
          </div>

          <div className="flow-section">
            <div className="flow-card student-card">
              <div className="flow-icon">👨‍🎓</div>
              <div className="flow-info">
                <div className="flow-label">Student submits work</div>
                <div className="flow-desc">Upload assignments before deadline.</div>
              </div>
              <div className="flow-status green">Done</div>
            </div>

            <div className="flow-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
              <div className="connector-line"></div>
            </div>

            <div className="flow-card assign-card">
              <div className="flow-icon">📂</div>
              <div className="flow-info">
                <div className="flow-label">Assignment tracked</div>
                <div className="flow-desc">System records status and progress.</div>
              </div>
              <div className="flow-status yellow">In Flow</div>
            </div>

            <div className="flow-connector">
              <div className="connector-line"></div>
              <div className="connector-dot"></div>
              <div className="connector-line"></div>
            </div>

            <div className="flow-card mentor-card">
              <div className="flow-icon">🧑‍🏫</div>
              <div className="flow-info">
                <div className="flow-label">Mentor reviews</div>
                <div className="flow-desc">Evaluate and give feedback quickly.</div>
              </div>
              <div className="flow-status orange">Review</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">500+</div>
              <div className="stat-label">Submissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">120+</div>
              <div className="stat-label">Assignments</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">98%</div>
              <div className="stat-label">On-Time Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}