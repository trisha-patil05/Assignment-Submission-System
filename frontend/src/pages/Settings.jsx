import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    assignmentAlerts: true,
    gradeNotifications: true,
    darkMode: true
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(updated);
    localStorage.setItem("userSettings", JSON.stringify(updated));
    setMessage("✅ Settings saved!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "65px", display: "flex", minHeight: "calc(100vh - 65px)" }}>
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-section-label">⚙️ Settings</div>
          <button
            onClick={() => navigate(-1)}
            className="sidebar-item"
            style={{ opacity: 0.7 }}
          >
            <span className="icon">⬅️</span>
            Back
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content" style={{ maxWidth: "600px" }}>
          <h2 style={{
            fontSize: "1.6rem",
            fontWeight: "800",
            color: "#f1f5f9",
            marginBottom: "0.8rem"
          }}>⚙️ Settings</h2>

          {message && (
            <div style={{
              background: "rgba(16,185,129,0.1)",
              color: "#34d399",
              padding: "0.85rem 1.1rem",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              borderLeft: "3px solid #10b981",
              fontSize: "0.88rem"
            }}>
              {message}
            </div>
          )}

          {/* NOTIFICATION SETTINGS */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "#f1f5f9",
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #334155"
            }}>🔔 Notification Preferences</h3>

            {/* Email Notifications */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              background: "#0f172a",
              borderRadius: "8px",
              marginBottom: "0.75rem"
            }}>
              <div>
                <p style={{
                  margin: "0 0 0.25rem 0",
                  color: "#f1f5f9",
                  fontWeight: "600"
                }}>Email Notifications</p>
                <p style={{
                  margin: "0",
                  fontSize: "0.85rem",
                  color: "#cbd5e1"
                }}>Receive emails for important updates</p>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                style={{
                  width: "50px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  background: settings.emailNotifications ? "#6366f1" : "#334155",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s"
                }}
              >
                <div style={{
                  position: "absolute",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "white",
                  top: "2px",
                  left: settings.emailNotifications ? "24px" : "2px",
                  transition: "left 0.3s"
                }} />
              </button>
            </div>

            {/* Assignment Alerts */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              background: "#0f172a",
              borderRadius: "8px",
              marginBottom: "0.75rem"
            }}>
              <div>
                <p style={{
                  margin: "0 0 0.25rem 0",
                  color: "#f1f5f9",
                  fontWeight: "600"
                }}>Assignment Alerts</p>
                <p style={{
                  margin: "0",
                  fontSize: "0.85rem",
                  color: "#cbd5e1"
                }}>Get notified when new assignments are posted</p>
              </div>
              <button
                onClick={() => handleToggle("assignmentAlerts")}
                style={{
                  width: "50px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  background: settings.assignmentAlerts ? "#6366f1" : "#334155",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s"
                }}
              >
                <div style={{
                  position: "absolute",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "white",
                  top: "2px",
                  left: settings.assignmentAlerts ? "24px" : "2px",
                  transition: "left 0.3s"
                }} />
              </button>
            </div>

            {/* Grade Notifications */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              background: "#0f172a",
              borderRadius: "8px"
            }}>
              <div>
                <p style={{
                  margin: "0 0 0.25rem 0",
                  color: "#f1f5f9",
                  fontWeight: "600"
                }}>Grade Notifications</p>
                <p style={{
                  margin: "0",
                  fontSize: "0.85rem",
                  color: "#cbd5e1"
                }}>Notify when assignments are graded</p>
              </div>
              <button
                onClick={() => handleToggle("gradeNotifications")}
                style={{
                  width: "50px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  background: settings.gradeNotifications ? "#6366f1" : "#334155",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s"
                }}
              >
                <div style={{
                  position: "absolute",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "white",
                  top: "2px",
                  left: settings.gradeNotifications ? "24px" : "2px",
                  transition: "left 0.3s"
                }} />
              </button>
            </div>
          </div>

          {/* DISPLAY SETTINGS */}
          <div className="card">
            <h3 style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "#f1f5f9",
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #334155"
            }}>🎨 Display Settings</h3>

            {/* Dark Mode */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              background: "#0f172a",
              borderRadius: "8px"
            }}>
              <div>
                <p style={{
                  margin: "0 0 0.25rem 0",
                  color: "#f1f5f9",
                  fontWeight: "600"
                }}>🌙 Dark Mode</p>
                <p style={{
                  margin: "0",
                  fontSize: "0.85rem",
                  color: "#cbd5e1"
                }}>Use dark theme (currently enabled)</p>
              </div>
              <div style={{
                background: "#6366f1",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "700",
                color: "white"
              }}>
                ON
              </div>
            </div>
          </div>

          {/* INFO BOX */}
          <div style={{
            marginTop: "1.5rem",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid #6366f1",
            padding: "1rem",
            borderRadius: "10px",
            color: "#a5b4fc",
            fontSize: "0.85rem"
          }}>
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>
              ℹ️ Information:
            </p>
            <p style={{ margin: "0" }}>
              Your preferences are saved locally. Changes take effect immediately.
              These settings help personalize your AssignmentHub experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}