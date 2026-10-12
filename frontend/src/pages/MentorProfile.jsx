import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function MentorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    experience: "",
    phone: "",
    office: "",
    bio: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const saved = localStorage.getItem("mentorProfile");
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
    localStorage.setItem("mentorProfile", JSON.stringify(profile));
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
          <div className="sidebar-section-label">👨‍🏫 Profile</div>
          <button
            onClick={() => navigate("/mentor")}
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
          }}>👨‍🏫 Mentor Profile</h2>

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
                    }}>Department</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.department || "—"}
                    </p>
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#cbd5e1",
                      marginBottom: "0.3rem"
                    }}>Experience</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.experience || "—"}
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
                    }}>Office</label>
                    <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "0.95rem" }}>
                      {profile.office || "—"}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.3rem"
                  }}>Bio</label>
                  <p style={{ color: "#f1f5f9", lineHeight: "1.6", fontSize: "0.95rem" }}>
                    {profile.bio || "No bio added"}
                  </p>
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
                  }}>Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g., Computer Science"
                    value={profile.department}
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
                  }}>Experience (Years)</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g., 5 years"
                    value={profile.experience}
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

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem"
                  }}>Office Room</label>
                  <input
                    type="text"
                    name="office"
                    placeholder="e.g., Room 201"
                    value={profile.office}
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
                  }}>Bio</label>
                  <textarea
                    name="bio"
                    placeholder="Tell students about yourself..."
                    value={profile.bio}
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
                      minHeight: "120px",
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