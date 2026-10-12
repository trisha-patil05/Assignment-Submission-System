import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignments } from "../services/assignmentService";
import { getCurrentUser } from "../services/authService";
import { getMySubmissions } from "../services/submissionService";
import socket from "../socket";
import Navbar from "./Navbar";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Filter state for assignments
  const [assignSearch, setAssignSearch] = useState("");
  const [assignSortBy, setAssignSortBy] = useState("date");
  const [assignSortOrder, setAssignSortOrder] = useState("desc");

  // Filter state for submissions/grades
  const [subSearch, setSubSearch] = useState("");
  const [subSortBy, setSubSortBy] = useState("date");
  const [subSortOrder, setSubSortOrder] = useState("desc");

  useEffect(() => {
    const load = async () => {
      try {
        const [aData, sData] = await Promise.all([
          getAssignments(),
          getMySubmissions(),
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

  // Apply submission filters
  useEffect(() => {
    const applyFilters = async () => {
      try {
        const filters = {};
        if (subSearch) filters.search = subSearch;
        filters.sortBy = subSortBy;
        filters.sortOrder = subSortOrder;

        const sData = await getMySubmissions(filters);
        setSubmissions(Array.isArray(sData) ? sData : []);
      } catch (err) {
        console.error("❌ Filter error:", err);
      }
    };

    if (activeTab === "grades") {
      applyFilters();
    }
  }, [subSearch, subSortBy, subSortOrder, activeTab]);

  useEffect(() => {
    if (!user) return;
    const onNotification = (data) => {
      console.log("🔔 Notification:", data);
      if (data.type === "assignment") {
        getAssignments().then(aData => {
          setAssignments(Array.isArray(aData) ? aData : []);
        });
      }
    };
    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, [user]);

  const mySubmission = (assignmentId) =>
    submissions.find(s =>
      s.assignmentId?._id === assignmentId || s.assignmentId === assignmentId
    );

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => !mySubmission(a._id)).length,
    submitted: submissions.filter(s => s.status === "submitted").length,
    reviewed: submissions.filter(s => s.status === "reviewed").length,
  };

  const filteredGrades = submissions.filter(s => s.status === "reviewed");

  if (loading) return <div style={{ marginTop: "65px", padding: "2rem" }}>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "65px", display: "flex", minHeight: "calc(100vh - 65px)" }}>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section-label">📊 Menu</div>
          {["dashboard", "assignments", "grades"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sidebar-item ${activeTab === tab ? "active" : ""}`}
            >
              <span className="icon">
                {tab === "dashboard" && "📊"}
                {tab === "assignments" && "📚"}
                {tab === "grades" && "⭐"}
              </span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
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
                    <div className="stat-label">Total</div>
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
                  <div className="stat-icon">📤</div>
                  <div>
                    <div className="stat-value">{stats.submitted}</div>
                    <div className="stat-label">Submitted</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div>
                    <div className="stat-value">{stats.reviewed}</div>
                    <div className="stat-label">Graded</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div>
              <h2>📚 Assignments</h2>

              {/* Filters */}
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
                  const sub = mySubmission(a._id);
                  return (
                    <div key={a._id} className={`assignment-card ${sub?.status || "pending"}`}>
                      <h3 className="assignment-title">{a.title}</h3>
                      <p className="assignment-desc">{a.description}</p>
                      {a.deadline && (
                        <div style={{ color: "#6366f1", fontSize: "0.85rem", marginBottom: "1rem" }}>
                          📅 {new Date(a.deadline).toLocaleDateString()}
                        </div>
                      )}
                      <span className={`badge ${sub ? "badge-submitted" : "badge-pending"}`}>
                        {sub ? "✅ Submitted" : "⏳ Pending"}
                      </span>
                      <button
                        onClick={() => navigate(`/student/submit/${a._id}`)}
                        className="btn btn-primary"
                        style={{ width: "100%", marginTop: "1rem" }}
                      >
                        {sub ? "Resubmit" : "Submit"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grades Tab */}
          {activeTab === "grades" && (
            <div>
              <h2>⭐ Grades & Feedback</h2>

              {/* Filters */}
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
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: "250px", marginBottom: 0 }}
                />

                <select
                  value={subSortBy}
                  onChange={(e) => setSubSortBy(e.target.value)}
                  className="form-input"
                  style={{ padding: "0.5rem 1rem", marginBottom: 0 }}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>

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
                {filteredGrades.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#cbd5e1" }}>No grades yet</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Assignment</th>
                        <th style={{ textAlign: "center" }}>Grade</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrades.map((s) => (
                        <tr key={s._id}>
                          <td>{s.assignmentId?.title || "Assignment"}</td>
                          <td style={{ textAlign: "center", fontWeight: "700", color: "#10b981" }}>
                            {s.grade}/100
                          </td>
                          <td>{s.feedback || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}