import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    enrollment: "",
    branch: "",
    semester: "",
    cgpa: "",
    phone: "",
    address: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const saved = localStorage.getItem("studentProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      setProfile(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem("studentProfile", JSON.stringify(profile));
    setMessage("✅ Profile saved successfully!");
    setMessageType("success");
    setIsEditing(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "65px", display: "flex", minHeight: "calc(100vh - 65px)" }}>
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-section-label">👨‍🎓 Profile</div>
          <button
            onClick={() => navigate("/student")}
            className="sidebar-item"
            style={{ opacity: 0.7 }}
          >
            <span className="icon">⬅️</span>
            Back
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="sidebar-item"
          >
            <span className="icon">⚙️</span>
            Settings
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content" style={{ maxWidth: "700px" }}>
          <h2 style={{
            fontSize: "1.6rem",
            fontWeight: "800",
            color: "#f1f5f9",
            marginBottom: "0.8rem"
          }}>👨‍🎓 Student Profile</h2>

          {message && (
            <div style={{
              background: messageType === "success" ? "rgba(16,185,129,0.1)" : "rgba(127,29,29,0.8)",
              color: messageType === "success" ? "#34d399" : "#fca5a5",
              padding: "0.85rem 1.1rem",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              borderLeft: `3px solid ${messageType === "success" ? "#10b981" : "#ef4444"}`,
              fontSize: "0.88rem"
            }}>
              {message}
            </div>
          )}

          <div className="card">
            {!isEditing ? (
              <>
                {/* VIEW MODE */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem"
                }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Name</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.name || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Email</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.email || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Enrollment No.</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.enrollment || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Branch</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.branch || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Semester</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.semester || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>CGPA</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.cgpa || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Phone</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Address</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.address || "—"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
                  }}
                >
                  ✏️ Edit Profile
                </button>
              </>
            ) : (
              <>
                {/* EDIT MODE */}
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Enrollment Number</label>
                  <input
                    type="text"
                    name="enrollment"
                    placeholder="e.g., 123456789"
                    value={profile.enrollment}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Branch</label>
                  <input
                    type="text"
                    name="branch"
                    placeholder="e.g., Computer Science"
                    value={profile.branch}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Semester</label>
                  <input
                    type="text"
                    name="semester"
                    placeholder="e.g., 4"
                    value={profile.semester}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>CGPA</label>
                  <input
                    type="text"
                    name="cgpa"
                    placeholder="e.g., 3.8"
                    value={profile.cgpa}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={profile.phone}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Address</label>
                  <textarea
                    name="address"
                    placeholder="Your address..."
                    value={profile.address}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0f172a",
                      border: "1.5px solid #334155",
                      borderRadius: "10px",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      minHeight: "100px",
                      resize: "vertical",
                      transition: "all 0.2s"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      padding: "0.9rem",
                      background: "#334155",
                      color: "#cbd5e1",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      flex: 1,
                      padding: "0.9rem",
                      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
                    }}
                  >
                    💾 Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}