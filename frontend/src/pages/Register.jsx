import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div className="assignment-register">
      {/* Floating Background */}
      <div className="bg-animation">
        <div className="floating-el" style={{top:'10%', left:'5%'}}>📝</div>
        <div className="floating-el" style={{top:'70%', left:'3%', animationDelay:'2s'}}>📚</div>
        <div className="floating-el" style={{bottom:'15%', left:'12%', animationDelay:'4s'}}>✏️</div>
        <div className="floating-el" style={{top:'20%', right:'5%', animationDelay:'1s'}}>📋</div>
        <div className="floating-el" style={{bottom:'20%', right:'8%', animationDelay:'3s'}}>🎓</div>
      </div>

      <div className="register-container">

        {/* LEFT PANEL */}
        <div className={`register-panel ${animate ? 'animate-in' : ''}`}>

          {/* Brand */}
          <div className="brand-section">
            <div className="brand-logo-wrap">
              <div className="logo-glow"></div>
              <span className="logo-emoji">📋</span>
            </div>
            <h1 className="brand-name">AssignmentHub</h1>
            <div className="brand-roles">
              <span className="role-chip student-chip">👨‍🎓 Student</span>
              <span className="role-chip mentor-chip">👨‍🏫 Mentor</span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Welcome */}
          <div className="welcome-section">
            <h2>Create your account</h2>
            <p>Join as a student or mentor today</p>
          </div>

          {/* Error */}
          {error && <div className="error-toast">⚠️ {error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label>Full Name</label>
              <div className="input-wrap">
                <span className="field-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="field-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
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
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Select Role</label>
              <div className="role-select-wrap">
                <div
                  className={`role-option ${form.role === 'student' ? 'active-student' : ''}`}
                  onClick={() => setForm({ ...form, role: 'student' })}
                >
                  <span>👨‍🎓</span>
                  <div>
                    <strong>Student</strong>
                    <p>Submit & track assignments</p>
                  </div>
                  {form.role === 'student' && <span className="check">✓</span>}
                </div>
                <div
                  className={`role-option ${form.role === 'mentor' ? 'active-mentor' : ''}`}
                  onClick={() => setForm({ ...form, role: 'mentor' })}
                >
                  <span>👨‍🏫</span>
                  <div>
                    <strong>Mentor</strong>
                    <p>Review & grade work</p>
                  </div>
                  {form.role === 'mentor' && <span className="check">✓</span>}
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account →</span>
              )}
            </button>
          </form>

          <p className="footer-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="live-badge">🟢 Join Now</div>

          <div className="right-title">
            <h3>Why AssignmentHub?</h3>
            <p>Everything you need in one place</p>
          </div>

          <div className="features-section">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <div className="feature-info">
                <span className="feature-label">Track Progress</span>
                <span className="feature-desc">Real-time assignment tracking</span>
              </div>
              <div className="feature-status green">Live</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <div className="feature-info">
                <span className="feature-label">Instant Feedback</span>
                <span className="feature-desc">Get mentor reviews fast</span>
              </div>
              <div className="feature-status blue">Smart</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <div className="feature-info">
                <span className="feature-label">Grade Management</span>
                <span className="feature-desc">Organized grade history</span>
              </div>
              <div className="feature-status orange">Auto</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <div className="feature-info">
                <span className="feature-label">Notifications</span>
                <span className="feature-desc">Never miss a deadline</span>
              </div>
              <div className="feature-status purple">Alert</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-num">24</span>
              <span className="stat-label">Assignments</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">8</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">3</span>
              <span className="stat-label">Mentors</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
