// pages/MentorDashboard.jsx
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import ReviewModal from "../components/ReviewModal";
import { getAssignments } from "../services/assignmentService";
import { getCurrentUser, logoutUser } from "../services/authService";
import { getSubmissions } from "../services/submissionService";
import Navbar from "./Navbar";

export default function MentorDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reviewingSubmission, setReviewingSubmission] = useState(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const load = async () => {
    try {
      const [aData, sData] = await Promise.all([
        getAssignments(),
        getSubmissions(),
      ]);
      setAssignments(aData);
      setSubmissions(sData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Attach submissions to their assignments
  const assignmentsWithSubs = assignments.map((a) => ({
    ...a,
    submissions: submissions.filter(
      (s) => s.assignmentId?._id === a._id || s.assignmentId === a._id
    ),
  }));

  const filteredAssignments = assignmentsWithSubs.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const subStatus = a.submissions.length === 0 ? "pending"
      : a.submissions.every(s => s.status === "reviewed") ? "reviewed"
      : "submitted";
    const matchFilter = filter === "all" || subStatus === filter;
    return matchSearch && matchFilter;
  });

  const total = assignments.length;
  const withSubmissions = submissions.length;
  const reviewed = submissions.filter(s => s.status === "reviewed").length;
  const pending = submissions.filter(s => s.status === "submitted").length;
  const lateSubmissions = submissions.filter(s => s.isLate && s.status !== "reviewed").length; // ← NEW

  const getBadgeStyle = (status) => {
    if (status === "reviewed") return { background: "#d1fae5", color: "#065f46" };
    if (status === "submitted") return { background: "#dbeafe", color: "#1e40af" };
    return { background: "#fef3c7", color: "#92400e" };
  };

  // ← NEW: Helper to format minutes late
  const formatLateTime = (minutes) => {
    if (minutes < 60) return `${minutes}min late`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min late`;
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section-label">MENU</div>

          {[
            { icon: "🏠", label: "Dashboard", key: "dashboard" },
            { icon: "📚", label: "Assignments", key: "assignments" },
            { icon: "📨", label: "Submissions", key: "submissions" },
          ].map(item => (
            <button key={item.key}
              className={`sidebar-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}>
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.key === "submissions" && pending > 0 && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: "0.7rem", padding: "0.1rem 0.5rem", borderRadius: "10px" }}>
                  {pending}
                </span>
              )}
              {item.key === "submissions" && lateSubmissions > 0 && (
                <span style={{ marginLeft: "4px", background: "#f97316", color: "#fff", fontSize: "0.7rem", padding: "0.1rem 0.5rem", borderRadius: "10px" }}>
                  ⏰ {lateSubmissions}
                </span>
              )}
            </button>
          ))}

          <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="sidebar-section-label">ACTIONS</div>
            <button className="sidebar-item" onClick={() => navigate("/create-assignment")}>
              <span className="icon">➕</span> New Assignment
            </button>
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
                  <p className="page-subtitle">Here's an overview of all assignments</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/mentor/create")}>
                  + Create Assignment
                </button>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                {[
                  { label: "Total Assignments", value: total, icon: "📚", bg: "#ede9fe", color: "#4f46e5" },
                  { label: "Total Submissions", value: withSubmissions, icon: "📨", bg: "#dbeafe", color: "#3b82f6" },
                  { label: "Pending Review", value: pending, icon: "⏳", bg: "#fef3c7", color: "#f59e0b" },
                  { label: "Reviewed", value: reviewed, icon: "✅", bg: "#d1fae5", color: "#10b981" },
                  // ← NEW: Late submissions stat
                  ...(lateSubmissions > 0 ? [{ label: "Late Submissions", value: lateSubmissions, icon: "⏰", bg: "#fee2e2", color: "#ef4444" }] : []),
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

              {/* Search + Filter Bar */}
              <div className="filter-bar">
                <input
                  className="search-input"
                  placeholder="Search assignments..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {["all", "pending", "submitted", "reviewed"].map(f => (
                  <button key={f}
                    className={`filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Assignment Grid */}
              {loading ? (
                <div className="empty-state"><p>Loading...</p></div>
              ) : assignmentsWithSubs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No assignments yet.</p>
                  <button className="btn btn-primary" style={{ marginTop: "1rem" }}
                    onClick={() => navigate("/create-assignment")}>+ Create Assignment</button>
                </div>
              ) : (
                <div className="assignments-grid">
                  {filteredAssignments.map(a => (
                    <div key={a._id} className={`assignment-card ${
                      a.submissions.length === 0 ? "pending"
                        : a.submissions.every(s => s.status === "reviewed") ? "reviewed"
                        : "submitted"
                    }`}>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h3 className="assignment-title">{a.title}</h3>
                        <span className="badge" style={getBadgeStyle(
                          a.submissions.length === 0 ? "pending"
                            : a.submissions.every(s => s.status === "reviewed") ? "reviewed"
                            : "submitted"
                        )}>
                          {a.submissions.length === 0 ? "No Submissions"
                            : a.submissions.every(s => s.status === "reviewed") ? "All Reviewed"
                            : `${a.submissions.length} Submitted`}
                        </span>
                      </div>
                      <p className="assignment-desc">{a.description}</p>
                      
                      {/* ← NEW: Show late count if any */}
                      {a.submissions.some(s => s.isLate && s.status !== "reviewed") && (
                        <div style={{
                          fontSize: "0.82rem", color: "#ef4444", fontWeight: "600",
                          marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "4px"
                        }}>
                          ⏰ {a.submissions.filter(s => s.isLate && s.status !== "reviewed").length} late submission(s)
                        </div>
                      )}
                      
                      <div style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                        {a.deadline && <span>📅 {new Date(a.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── SUBMISSIONS SECTION ── */}
          {activeSection === "submissions" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">📨 Submissions</h1>
                  <p className="page-subtitle">Review and grade student submissions</p>
                </div>
              </div>

              {/* ← NEW: Show late submissions alert if any */}
              {lateSubmissions > 0 && (
                <div style={{
                  background: "#fee2e2", border: "1px solid #fca5a5",
                  borderRadius: "12px", padding: "12px 16px", marginBottom: "1.5rem",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>⏰</span>
                  <div>
                    <p style={{ color: "#991b1b", fontWeight: "600", margin: "0 0 2px 0", fontSize: "0.95rem" }}>
                      {lateSubmissions} late submission{lateSubmissions !== 1 ? "s" : ""}
                    </p>
                    <p style={{ color: "#b91c1c", margin: "0", fontSize: "0.85rem" }}>
                      These were submitted past the deadline. Review them separately.
                    </p>
                  </div>
                </div>
              )}

              {submissions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No submissions yet.</p>
                </div>
              ) : (
                <div className="data-table">
                  <div className="table-header">
                    <h2>All Submissions</h2>
                    <span style={{ background: "#ede9fe", color: "#4f46e5", padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
                      {submissions.length} total
                    </span>
                  </div>

                  {/* ← NEW: Sort with late submissions first */}
                  {[...submissions]
                    .sort((a, b) => {
                      // Late submissions first
                      if (b.isLate !== a.isLate) return b.isLate ? 1 : -1;
                      // Then pending reviews
                      if (b.status !== a.status) return b.status === "submitted" ? 1 : -1;
                      // Then by submission time
                      return new Date(b.submittedAt) - new Date(a.submittedAt);
                    })
                    .map((s, i) => (
                      <div key={s._id} className="table-row" style={{
                        background: s.isLate && s.status !== "reviewed" ? "rgba(239, 68, 68, 0.05)" : "transparent",
                        borderLeft: s.isLate && s.status !== "reviewed" ? "4px solid #ef4444" : "4px solid transparent",
                      }}>
                        <div style={{ flex: 1 }}>
                          {/* Assignment name */}
                          <p style={{ fontWeight: "600", fontSize: "0.92rem" }}>
                            📚 {s.assignmentId?.title || "Assignment"}
                          </p>
                          {/* Student */}
                          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                            👤 {s.studentId?.name || s.studentId?.email || "Student"}
                          </p>
                          {/* Answer */}
                          {s.content && (
                            <p style={{ color: "#9ca3af", fontSize: "0.82rem", marginTop: "0.2rem", fontStyle: "italic" }}>
                              "{s.content?.slice(0, 80)}{s.content?.length > 80 ? "..." : ""}"
                            </p>
                          )}
                          {/* Files */}
                          {s.files?.length > 0 && (
                            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                              {s.files.map((file, idx) => {
                                const isImage = file.match(/\.(jpg|jpeg|png|webp)/i);
                                const isVideo = file.match(/\.(mp4|mov|avi)/i);
                                const label = isImage ? "🖼️ Image" : isVideo ? "🎥 Video" : "📄 File";
                                return (
                                  <div key={`files-${idx}`}>
                                    <a href={file} target="_blank" rel="noreferrer"
                                      style={{ fontSize: "0.8rem", color: "#4f46e5", background: "#ede9fe",
                                        padding: "0.2rem 0.6rem", borderRadius: "8px", textDecoration: "none" }}>
                                      {label}{s.files.length > 1 ? ` ${idx + 1}` : ""}
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* ← NEW: Show late indicator */}
                          <div style={{ display: "flex", gap: "8px", marginTop: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                            <p style={{ color: "#d1d5db", fontSize: "0.78rem", margin: "0" }}>
                              🕐 {new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {s.isLate && (
                              <span style={{
                                fontSize: "0.75rem", fontWeight: "600", padding: "2px 8px",
                                background: "#fee2e2", color: "#991b1b", borderRadius: "6px"
                              }}>
                                ⏰ {formatLateTime(s.minutesLate)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right side — grade or button */}
                        <div style={{ marginLeft: "1rem", textAlign: "right", minWidth: "120px" }}>
                          <span className="badge" style={{ ...getBadgeStyle(s.status), display: "inline-block", marginBottom: "0.5rem" }}>
                            {s.status}
                          </span>

                          {s.status === "reviewed" ? (
                            <div>
                              <p style={{
                                fontSize: "1.4rem", fontWeight: "700",
                                color: s.grade >= 80 ? "#10b981" : s.grade >= 60 ? "#f59e0b" : "#ef4444"
                              }}>
                                {s.grade}/100
                              </p>
                              {s.feedback && (
                                <p style={{ fontSize: "0.78rem", color: "#6b7280", fontStyle: "italic", maxWidth: "150px" }}>
                                  💬 {s.feedback?.slice(0, 50)}...
                                </p>
                              )}
                            </div>
                          ) : (
                            <button className="btn btn-primary btn-sm"
                              onClick={() => setReviewingSubmission(s)}>
                              📝 Grade
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          {/* ── ASSIGNMENTS SECTION ── */}
          {activeSection === "assignments" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">📚 All Assignments</h1>
                  <p className="page-subtitle">Manage your created assignments</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/create-assignment")}>
                  + Create Assignment
                </button>
              </div>

              <div className="data-table">
                <div className="table-header">
                  <h2>Assignments</h2>
                  <span style={{ background: "#ede9fe", color: "#4f46e5", padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
                    {assignments.length} total
                  </span>
                </div>

                {assignments.map((a) => {
                  const subs = submissions.filter(s => s.assignmentId?._id === a._id || s.assignmentId === a._id);
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
                        <span style={{ background: "#f3f4f6", color: "#374151", padding: "0.2rem 0.8rem", borderRadius: "20px", fontSize: "0.82rem" }}>
                          {subs.length} submissions
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Review Modal */}
      {reviewingSubmission && (
        <ReviewModal
          submission={reviewingSubmission}
          onClose={() => setReviewingSubmission(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}