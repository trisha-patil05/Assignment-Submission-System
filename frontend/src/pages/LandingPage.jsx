import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

export default function LandingPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // If user logged in, redirect to dashboard
  if (user?.role === "mentor") return <Navigate to="/mentor" replace />;
  if (user?.role === "student") return <Navigate to="/student" replace />;

  return (
    <div style={{ background: "#0f172a", color: "#f1f5f9", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <nav style={{
        background: "#1e293b",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #334155",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ fontSize: "2rem" }}>📚</div>
          <h1 style={{ margin: "0", fontSize: "1.5rem", color: "#f1f5f9" }}>
            AssignmentHub
          </h1>
        </div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#features" style={{
            color: "#cbd5e1",
            textDecoration: "none",
            cursor: "pointer",
            transition: "color 0.3s"
          }} onMouseEnter={(e) => e.target.style.color = "#6366f1"}
            onMouseLeave={(e) => e.target.style.color = "#cbd5e1"}>
            Features
          </a>
          <a href="#about" style={{
            color: "#cbd5e1",
            textDecoration: "none",
            cursor: "pointer",
            transition: "color 0.3s"
          }} onMouseEnter={(e) => e.target.style.color = "#6366f1"}
            onMouseLeave={(e) => e.target.style.color = "#cbd5e1"}>
            About
          </a>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "#6366f1",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.background = "#4f46e5"}
            onMouseLeave={(e) => e.target.style.background = "#6366f1"}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        padding: "6rem 2rem",
        textAlign: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "700",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #6366f1, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            AssignmentHub
          </h1>
          <p style={{
            fontSize: "1.5rem",
            color: "#cbd5e1",
            marginBottom: "2rem"
          }}>
            Track. Submit. Grade. Learn.
          </p>
          <p style={{
            fontSize: "1.1rem",
            color: "#94a3b8",
            maxWidth: "600px",
            margin: "0 auto 3rem",
            lineHeight: "1.8"
          }}>
            A complete assignment management system for students and mentors. 
            Submit your work, get instant feedback, and track your progress in real-time.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "#6366f1",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#4f46e5";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#6366f1";
                e.target.style.transform = "translateY(0)";
              }}
            >
              🚀 Get Started
            </button>
            <button
              onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent",
                color: "#6366f1",
                border: "2px solid #6366f1",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(99, 102, 241, 0.1)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
              }}
            >
              📖 Learn More
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{
        padding: "6rem 2rem",
        background: "#0f172a"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "2.5rem",
            textAlign: "center",
            marginBottom: "4rem",
            color: "#f1f5f9"
          }}>
            ✨ Key Features
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem"
          }}>
            {[
              {
                icon: "📤",
                title: "Easy Submission",
                desc: "Submit assignments with files, code, or text. Support for multiple file types."
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                desc: "Get instant notifications when assignments are posted or graded."
              },
              {
                icon: "📊",
                title: "Instant Grading",
                desc: "Mentors can grade submissions with feedback instantly."
              },
              {
                icon: "💬",
                title: "Two-way Communication",
                desc: "Comment on submissions for detailed feedback and discussions."
              },
              {
                icon: "🔍",
                title: "Search & Filter",
                desc: "Easily find assignments and submissions with powerful search."
              },
              {
                icon: "📈",
                title: "Track Progress",
                desc: "View grades, feedback, and submission history all in one place."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: "#1e293b",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  transition: "all 0.3s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#334155";
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(99, 102, 241, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1e293b";
                  e.currentTarget.style.borderColor = "#334155";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: "1.3rem",
                  marginBottom: "0.5rem",
                  color: "#f1f5f9"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: "#cbd5e1",
                  lineHeight: "1.6"
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{
        padding: "6rem 2rem",
        background: "#1e293b"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "2.5rem",
            marginBottom: "2rem",
            color: "#f1f5f9"
          }}>
            About AssignmentHub
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "#cbd5e1",
            lineHeight: "1.8",
            marginBottom: "1.5rem"
          }}>
            AssignmentHub is a modern, full-featured assignment management system designed 
            for educational institutions. It bridges the gap between students and mentors, 
            making the entire assignment workflow smooth and efficient.
          </p>
          <p style={{
            fontSize: "1.1rem",
            color: "#cbd5e1",
            lineHeight: "1.8"
          }}>
            With real-time notifications, easy submission handling, and comprehensive feedback 
            system, AssignmentHub revolutionizes how assignments are managed in educational settings.
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: "4rem 2rem",
        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "2rem",
          marginBottom: "1.5rem",
          color: "white"
        }}>
          Ready to Get Started?
        </h2>
        <p style={{
          fontSize: "1.1rem",
          marginBottom: "2rem",
          color: "rgba(255, 255, 255, 0.9)"
        }}>
          Join thousands of students and mentors using AssignmentHub today.
        </p>
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "white",
            color: "#6366f1",
            border: "none",
            padding: "1rem 2.5rem",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "none";
          }}
        >
          Create Free Account
        </button>
      </section>

      {/* FOOTER */}
<footer style={{
  background: "#0f172a",
  borderTop: "1px solid #334155",
  padding: "2rem",
  textAlign: "center",
  color: "#94a3b8"
}}>
  <div style={{ marginBottom: "1rem" }}>
    <a href="#about" style={{ color: "#6366f1", marginRight: "2rem", textDecoration: "none" }}>
      About
    </a>
    <a href="/privacy" style={{ color: "#6366f1", marginRight: "2rem", textDecoration: "none" }}>
      Privacy
    </a>
    <a href="mailto:support@assignmenthub.com" style={{ color: "#6366f1", textDecoration: "none" }}>
      Contact
    </a>
  </div>
  <p style={{ margin: "0" }}>
    © 2024 AssignmentHub. All rights reserved.
  </p>
</footer>
    </div>
  );
}