import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignments } from "../services/assignmentService";
import { getCurrentUser } from "../services/authService";
import { getSubmissions, markReviewed } from "../services/submissionService";
import socket from "../socket";
import Navbar from "./Navbar";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Filter state for submissions
  const [subSearch, setSubSearch] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [subSortBy, setSubSortBy] = useState("date");
  const [subSortOrder, setSubSortOrder] = useState("desc");

  // Filter state for assignments
  const [assignSearch, setAssignSearch] = useState("");
  const [assignSortBy, setAssignSortBy] = useState("date");
  const [assignSortOrder, setAssignSortOrder] = useState("desc");

  // Grading modal
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [aData, sData] = await Promise.all([
          getAssignments(),
          getSubmissions(),
        ]);
        setAssignments(Array.isArray(aData) ? aData : []);
        setSubmissions(Array.isArray(sData) ? sData : []);
      } catch (err) {
        console.error("❌ Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Apply filters when criteria change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        const filters = {};
        if (subSearch) filters.search = subSearch;
        if (subStatus) filters.status = subStatus;
        filters.sortBy = subSortBy;
        filters.sortOrder = subSortOrder;

        const sData = await getSubmissions(filters);
        setSubmissions(Array.isArray(sData) ? sData : []);
      } catch (err) {
        console.error("❌ Filter error:", err);
      }
    };

    if (activeTab === "submissions") {
      applyFilters();
    }
  }, [subSearch, subStatus, subSortBy, subSortOrder, activeTab]);

  // Apply assignment filters
  useEffect(() => {
    const applyFilters = async () => {
      try {
        const filters = {};
        if (assignSearch) filters.search = assignSearch;
        filters.sortBy = assignSortBy;
        filters.sortOrder = assignSortOrder;

        const aData = await getAssignments(filters);
        setAssignments(Array.isArray(aData) ? aData : []);
      } catch (err) {
        console.error("❌ Filter error:", err);
      }
    };

    if (activeTab === "assignments") {
      applyFilters();
    }
  }, [assignSearch, assignSortBy, assignSortOrder, activeTab]);

  useEffect(() => {
    if (!user) return;
    const onNotification = (data) => {
      console.log("🔔 Notification:", data);
      if (data.type === "submission" || data.type === "resubmission") {
        getSubmissions().then(sData => {
          setSubmissions(Array.isArray(sData) ? sData : []);
        });
      }
    };
    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, [user]);

  const handleGrade = async (e) => {
    e.preventDefault();
    if (!grade || grade < 0 || grade > 100) {
      alert("Please enter a grade between 0 and 100");
      return;
    }
    setGrading(true);
    try {
      await markReviewed(selectedSubmission._id, grade, feedback);
      setSubmissions(prev =>
        prev.map(s =>
          s._id === selectedSubmission._id
            ? { ...s, status: "reviewed", grade: parseInt(grade), feedback }
            : s
        )
      );
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
    } catch (err) {
      alert("Failed to grade submission");
    } finally {
      setGrading(false);
    }
  };

  const stats = {
    total: assignments.length,
    submissions: submissions.length,
    pending: submissions.filter(s => s.status === "submitted").length,
    graded: submissions.filter(s => s.status === "reviewed").length,
  };

  const filteredSubmissions = submissions;
  const pendingSubmissions = submissions.filter(s => s.status === "submitted");

  if (loading) return <div style={{ marginTop: "65px", padding: "2rem" }}>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "65px", display: "flex", minHeight: "calc(100vh - 65px)" }}>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section-label">📊 Menu</div>
          {["dashboard", "submissions", "assignments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sidebar-item ${activeTab === tab ? "active" : ""}`}
              style={{ position: "relative" }}
            >
              <span className="icon">
                {tab === "dashboard" && "📊"}
                {tab === "submissions" && "📤"}
                {tab === "assignments" && "📚"}
              </span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "submissions" && pendingSubmissions.length > 0 && (
                <span style={{
                  position: "absolute",
                  right: "0.5rem",
                  background: "#ef4444",
                  color: "#fff",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "700"
                }}>
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          ))}

          <div className="sidebar-section-label">➕ Actions</div>
          <button
            onClick={() => navigate("/mentor/create")}
            className="sidebar-item"
            style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}
          >
            <span className="icon">➕</span>
            Create Assignment
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <h2>Welcome back, {user?.email}! 👋</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Assignments</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📤</div>
                  <div>
                    <div className="stat-value">{stats.submissions}</div>
                    <div className="stat-label">Total Submissions</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div>
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div>
                    <div className="stat-value">{stats.graded}</div>
                    <div className="stat-label">Graded</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div>
              <h2>📤 Student Submissions</h2>
              
              {/* Filters */}
              <div style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                alignItems: "center"
              }}>
                {/* Search */}
                <input
                  type="text"
                  placeholder="🔍 Search student, email, or assignment..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: "250px", marginBottom: 0 }}
                />

                {/* Status Filter */}
                <select
                  value={subStatus}
                  onChange={(e) => setSubStatus(e.target.value)}
                  className="form-input"
                  style={{ padding: "0.5rem 1rem", marginBottom: 0 }}
                >
                  <option value="">All Status</option>
                  <option value="submitted">⏳ Pending</option>
                  <option value="reviewed">✅ Graded</option>
                </select>

                {/* Sort By */}
                <select
                  value={subSortBy}
                  onChange={(e) => setSubSortBy(e.target.value)}
                  className="form-input"
                  style={{ padding: "0.5rem 1rem", marginBottom: 0 }}
                >
                  <option value="date">Sort by Date</option>
                  <option value="studentName">Sort by Student</option>
                  <option value="grade">Sort by Grade</option>
                  <option value="status">Sort by Status</option>
                </select>

                {/* Sort Order */}
                <select
                  value={subSortOrder}
                  onChange={(e) => setSubSortOrder(e.target.value)}
                  className="form-input"
                  style={{ padding: "0.5rem 1rem", marginBottom: 0 }}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>

              <div className="card">
                {filteredSubmissions.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#cbd5e1" }}>No submissions found</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Assignment</th>
                        <th style={{ textAlign: "center" }}>Status</th>
                        <th style={{ textAlign: "center" }}>Plagiarism</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((s) => (
                        <tr key={s._id} style={{
                          background: s.isLate ? "rgba(245,158,11,0.1)" : "transparent"
                        }}>
                          <td>{s.studentId?.name || s.studentId?.email || "Unknown"}</td>
                          <td>{s.assignmentId?.title || "Assignment"}</td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`badge ${s.status === "reviewed" ? "badge-reviewed" : "badge-submitted"}`}>
                              {s.status === "reviewed" ? "✅ Graded" : "⏳ Pending"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {s.plagiarismScore ? (
                              <span className={`badge ${s.plagiarismScore > 60 ? "badge-danger" : s.plagiarismScore > 30 ? "badge-warning" : "badge-success"}`}>
                                🔍 {s.plagiarismScore}%
                              </span>
                            ) : (
                              <span style={{ color: "#94a3b8" }}>-</span>
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {s.status !== "reviewed" ? (
                              <button
                                onClick={() => setSelectedSubmission(s)}
                                className="btn btn-primary btn-sm"
                              >
                                Grade
                              </button>
                            ) : (
                              <span style={{ color: "#10b981", fontWeight: "600" }}>{s.grade}/100</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div>
              <h2>📚 Your Assignments</h2>

              {/* Assignment Filters */}
              <div style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                alignItems: "center"
              }}>
                <input
                  type="text"
                  placeholder="🔍 Search assignment..."
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: "250px", marginBottom: 0 }}
                />

                <select
                  value={assignSortBy}
                  onChange={(e) => setAssignSortBy(e.target.value)}
                  className="form-input"
                  style={{ padding: "0.5rem 1rem", marginBottom: 0 }}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="deadline">Sort by Deadline</option>
                </select>

                <select
                  value={assignSortOrder}
                  onChange={(e) => setAssignSortOrder(e.target.value)}
                  className="form-input"
                  style={{ padding: "0.5rem 1rem", marginBottom: 0 }}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>

              <div className="assignments-grid">
                {assignments.map((a) => {
                  const count = submissions.filter(s => s.assignmentId === a._id).length;
                  return (
                    <div key={a._id} className="assignment-card submitted">
                      <h3 className="assignment-title">{a.title}</h3>
                      <p className="assignment-desc">{a.description}</p>
                      {a.deadline && (
                        <div style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "1rem" }}>
                          📅 {new Date(a.deadline).toLocaleDateString()}
                        </div>
                      )}
                      <div style={{
                        background: "rgba(99,102,241,0.1)",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "#818cf8"
                      }}>
                        📤 {count} submission{count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grade Modal */}
      {selectedSubmission && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: "500px", width: "90%" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Grade Submission</h3>

            <p style={{ color: "#cbd5e1", marginBottom: "1rem" }}>
              <strong>Student:</strong> {selectedSubmission.studentId?.name || selectedSubmission.studentId?.email}
            </p>
            <p style={{ color: "#cbd5e1", marginBottom: "1.5rem" }}>
              <strong>Assignment:</strong> {selectedSubmission.assignmentId?.title}
            </p>

            <form onSubmit={handleGrade}>
              <div className="form-group">
                <label className="form-label">Grade (0-100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g., 85"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feedback</label>
                <textarea
                  className="form-textarea"
                  placeholder="Optional feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubmission(null);
                    setGrade("");
                    setFeedback("");
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {grading ? "Grading..." : "Submit Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}