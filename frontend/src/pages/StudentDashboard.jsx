// pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getAssignments } from "../services/assignmentService";
import { getCurrentUser, logoutUser } from "../services/authService";
import { updateProfile, uploadProfileImage } from "../services/profileupload";
import { getMySubmissions } from "../services/submissionService";

import Navbar from "./Navbar";

export default function StudentDashboard() {
  const navigate = useNavigate();
const user = getCurrentUser(); // ✅ must be here FIRST

const [assignments, setAssignments] = useState([]);
const [submissions, setSubmissions] = useState([]);
const [loading, setLoading] = useState(true);
const [activeSection, setActiveSection] = useState("dashboard");
const [filter, setFilter] = useState("all");
const [search, setSearch] = useState("");
const [profileImage, setProfileImage] = useState(user?.profileImage || ""); // ✅ now user exists
const [uploading, setUploading] = useState(false);// ✅ now user exists


  useEffect(() => {
    const load = async () => {
      try {
        const [aData, sData] = await Promise.all([
          getAssignments(),
          getMySubmissions(),
        ]);
        setAssignments(aData);
        setSubmissions(sData);
      } finally { setLoading(false); }
    };
    load();
  }, []);
  // ← NAYA: Socket.io notification listener
  useEffect(() => {
    const socket = io("http://localhost:5000");
    
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join", { userId: user._id, role: user.role });
    });

   socket.on("notification", (data) => {
  console.log("🔔 Notification:", data);
  
  if (data.type === "assignment") {
    // Assignments refresh karo - page reload nahi
    getAssignments().then(aData => {
      setAssignments(aData);
      console.log("✅ Assignments updated");
    });
  }
});

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => socket.disconnect();
  }, [user]);

  // Find my submission for a given assignment
  const mySubmission = (assignmentId) =>
    submissions.find(s =>
      s.assignmentId?._id === assignmentId || s.assignmentId === assignmentId
    );

    const filteredAssignments = assignments.filter(a => {
  const sub = mySubmission(a._id);
  const status = sub?.status || "pending";
  const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
  const matchFilter = filter === "all" || status === filter;
  return matchSearch && matchFilter;
});


  const pending = assignments.filter(a => !mySubmission(a._id)).length;
  const submitted = submissions.filter(s => s.status === "submitted").length;
  const reviewed = submissions.filter(s => s.status === "reviewed").length;

  const getGradeColor = (grade) => {
    if (grade >= 80) return "#10b981";
    if (grade >= 60) return "#f59e0b";
    return "#ef4444";
  };
   
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);
  try {
    const url = await uploadProfileImage(file);
    setProfileImage(url);
    await updateProfile({ profileImage: url, name: user?.email?.split("@")[0] });
  } finally {
    setUploading(false);
  }
};


  const getBadgeStyle = (status) => {
    if (status === "reviewed") return { background: "#d1fae5", color: "#065f46" };
    if (status === "submitted") return { background: "#dbeafe", color: "#1e40af" };
    return { background: "#fef3c7", color: "#92400e" };
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">

        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ color: "#818cf8", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "1px", marginBottom: "1rem", padding: "0 0.5rem" }}>
            MENU
          </div>
          {[
            { icon: "🏠", label: "Dashboard", key: "dashboard" },
            { icon: "📖", label: "Assignments", key: "assignments" },
            { icon: "📊", label: "My Grades", key: "grades" },
            { icon: "👤", label: "Profile", key: "profile" },

          ].map(item => (
            <button key={item.key}
              className={`sidebar-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button className="sidebar-item" onClick={() => { logoutUser(); navigate("/login"); }}>
              <span className="icon">🚪</span> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">

          {/* ── DASHBOARD SECTION ── */}
          {activeSection === "dashboard" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">👋 Welcome, {user?.email?.split("@")[0]}</h1>
                  <p className="page-subtitle">Track and submit your assignments</p>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                {[
                  { label: "Total", value: assignments.length, icon: "📚", bg: "#ede9fe", color: "#4f46e5" },
                  { label: "Pending", value: pending, icon: "⏳", bg: "#fef3c7", color: "#f59e0b" },
                  { label: "Submitted", value: submitted, icon: "📤", bg: "#dbeafe", color: "#3b82f6" },
                  { label: "Reviewed", value: reviewed, icon: "✅", bg: "#d1fae5", color: "#10b981" },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                    <div>
                      <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assignment Cards */}
              {loading ? (
                <div className="empty-state"><p>Loading...</p></div>
              ) : assignments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No assignments available yet.</p>
                </div>
              ) : (
                <>
<div className="filter-bar">
  <input
    className="search-input"
    placeholder="Search assignments..."
    value={search}
    onChange={e => setSearch(e.target.value)}
  />
  {["all", "pending", "submitted", "reviewed"].map(f => (
    <button
      key={f}
      className={`filter-btn ${filter === f ? "active" : ""}`}
      onClick={() => setFilter(f)}
    >
      {f.charAt(0).toUpperCase() + f.slice(1)}
    </button>
  ))}
</div>


           

                <div className="assignments-grid">
                  {filteredAssignments.map(a => {
                    const sub = mySubmission(a._id);
                    const status = sub?.status || "pending";
                    return (
                      <div key={a._id} className={`assignment-card ${status}`}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h3 className="assignment-title">{a.title}</h3>
                          <span className="badge" style={getBadgeStyle(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        <p className="assignment-desc">{a.description}</p>
                        {a.deadline && (
                          <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginBottom: "0.8rem" }}>
                            📅 {new Date(a.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          
                        )}

                        {/* Grade display if reviewed */}
                        {sub?.status === "reviewed" && (
                          <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "0.8rem", marginBottom: "0.8rem", border: "1px solid #bbf7d0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: "600", color: "#065f46", fontSize: "0.85rem" }}>Your Grade</span>
                              <span style={{ fontSize: "1.3rem", fontWeight: "700", color: getGradeColor(sub.grade) }}>
                                {sub.grade}/100
                              </span>
                            </div>
                            {/* Grade bar */}
                            <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "10px", marginTop: "0.5rem", overflow: "hidden" }}>
                              <div style={{ width: `${sub.grade}%`, height: "100%", background: getGradeColor(sub.grade), borderRadius: "10px" }} />
                            </div>
                            {sub.feedback && (
                              <p style={{ marginTop: "0.5rem", color: "#374151", fontSize: "0.82rem", fontStyle: "italic" }}>
                                💬 "{sub.feedback}"
                              </p>
                            )}
                          </div>
                          
                        )}

  <div className="assignment-meta">
  {!sub ? (
    (() => {
      const deadlinePassed = a.deadline && new Date() > new Date(a.deadline);
      return deadlinePassed ? (
        <div>
          <span style={{
            background: "#fee2e2", color: "#991b1b",
            padding: "0.4rem 0.9rem", borderRadius: "8px",
            fontSize: "0.85rem", fontWeight: "600"
          }}>
            ⛔ Deadline Passed
          </span>
          <p style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: "0.3rem" }}>
            Was due {new Date(a.deadline).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </p>
        </div>
      ) : (
        <button className="btn btn-primary btn-sm"
          onClick={() => navigate(`/student/submit/${a._id}`)}>
          📤 Submit Assignment
        </button>
      );
    })()
  ) : (
    <span style={{ color: "#10b981", fontWeight: "600", fontSize: "0.88rem" }}>
      ✅ Submitted
    </span>
  )}
</div>

                      </div>
                    );
                  })}
                </div>
                </>
              )}
            </>
          )}

          {/* ── ASSIGNMENTS SECTION ── */}
          {activeSection === "assignments" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">📖 My Assignments</h1>
                  <p className="page-subtitle">All assignments assigned to you</p>
                </div>
              </div>

              <div className="data-table">
                <div className="table-header">
                  <h2>Assignments</h2>
                </div>
                {assignments.map(a => {
                  const sub = mySubmission(a._id);
                  return (
                    <div key={a._id} className="table-row">
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "600" }}>{a.title}</p>
                        <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>{a.description}</p>
                        {a.deadline && (
                          <p style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                            📅 {new Date(a.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {!sub ? (
                          <button className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/student/submit/${a._id}`)}>
                            📤 Submit
                          </button>
                        ) : (
                          <span className="badge" style={getBadgeStyle(sub.status)}>
                            {sub.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── GRADES SECTION ── */}
          {activeSection === "grades" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">📊 My Grades</h1>
                  <p className="page-subtitle">Your performance overview</p>
                </div>
              </div>

              {/* Average grade card */}
              {reviewed > 0 && (
                <div style={{ background: "#fff", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", gap: "2rem", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "3rem", fontWeight: "700", color: getGradeColor(Math.round(submissions.filter(s => s.status === "reviewed").reduce((acc, s) => acc + s.grade, 0) / reviewed)) }}>
                      {Math.round(submissions.filter(s => s.status === "reviewed").reduce((acc, s) => acc + s.grade, 0) / reviewed)}
                    </p>
                    <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>Average Grade</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: "10px", background: "#f3f4f6", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.round(submissions.filter(s => s.status === "reviewed").reduce((acc, s) => acc + s.grade, 0) / reviewed)}%`,
                        height: "100%",
                        background: getGradeColor(Math.round(submissions.filter(s => s.status === "reviewed").reduce((acc, s) => acc + s.grade, 0) / reviewed)),
                        borderRadius: "10px"
                      }} />
                    </div>
                    <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.5rem" }}>{reviewed} assignment(s) reviewed</p>
                  </div>
                </div>
              )}

              {/* Individual grades */}
              <div className="data-table">
                <div className="table-header"><h2>Grade Details</h2></div>
                {submissions.filter(s => s.status === "reviewed").length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>No grades yet. Submit assignments to get graded.</p>
                  </div>
                ) : (
                  submissions.filter(s => s.status === "reviewed").map(s => (
                    <div key={s._id} className="table-row">
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "600" }}>{s.assignmentId?.title}</p>
                        <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem", fontStyle: "italic" }}>
                          {s.feedback ? `💬 "${s.feedback}"` : "No feedback provided"}
                        </p>
                        <p style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                          Reviewed on {new Date(s.reviewedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "1.6rem", fontWeight: "700", color: getGradeColor(s.grade) }}>
                          {s.grade}/100
                        </p>
                        <div style={{ width: "80px", height: "6px", background: "#f3f4f6", borderRadius: "10px", overflow: "hidden", marginTop: "0.3rem", marginLeft: "auto" }}>
                          <div style={{ width: `${s.grade}%`, height: "100%", background: getGradeColor(s.grade), borderRadius: "10px" }} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

         {/* ── PROFILE SECTION ── */}
{activeSection === "profile" && (
  <>
    <div className="page-header">
      <div>
        <h1 className="page-title">👤 My Profile</h1>
        <p className="page-subtitle">Your account details</p>
      </div>
    </div>

    <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", maxWidth: "500px" }}>

      {/* Profile Picture */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ position: "relative" }}>
          <img
            src={profileImage || `https://ui-avatars.com/api/?name=${user?.email}&background=4f46e5&color=fff&size=128`}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "3px solid #4f46e5" }}
          />
          <label style={{
            position: "absolute", bottom: 0, right: 0,
            background: "#4f46e5", color: "#fff", borderRadius: "50%",
            width: "28px", height: "28px", display: "flex",
            alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "0.85rem"
          }}>
            ✏️
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
        </div>
        {uploading && <p style={{ color: "#4f46e5", fontSize: "0.82rem", marginTop: "0.5rem" }}>Uploading...</p>}
      </div>

      {/* Info */}
      {[
        { label: "Email", value: user?.email, icon: "📧" },
        { label: "Role", value: "Student", icon: "🎓" },
        { label: "Total Submissions", value: submissions.length, icon: "📤" },
        { label: "Reviewed", value: reviewed, icon: "✅" },
        { label: "Pending", value: pending, icon: "⏳" },
      ].map(item => (
        <div key={item.label} style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "0.85rem 0",
          borderBottom: "1px solid #f3f4f6"
        }}>
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>{item.icon} {item.label}</span>
          <span style={{ fontWeight: "600", color: "#111827" }}>{item.value}</span>
        </div>
      ))}
    </div>
  </>
)}
 
        </main>
      </div>
    </div>
  );
}
