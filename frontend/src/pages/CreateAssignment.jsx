import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "../services/assignmentService";
import Navbar from "./Navbar";

export default function CreateAssignment() {
  const [form, setForm] = useState({ title: "", description: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createAssignment(form);
      setSuccess(true);
      setTimeout(() => navigate("/mentor"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "65px", display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <div className="sidebar">
          <div className="sidebar-section-label">📝 Create</div>
          <button
            onClick={() => navigate("/mentor")}
            className="sidebar-item"
          >
            <span className="icon">⬅️</span>
            Back to Dashboard
          </button>
        </div>

        <div className="main-content" style={{ maxWidth: "600px" }}>
          <h2>📝 Create New Assignment</h2>

          {success && (
            <div className="alert alert-success">
              ✅ Assignment created successfully!
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              ⚠️ {error}
            </div>
          )}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Build a Calculator App"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe the assignment requirements..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deadline (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => navigate("/mentor")}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {loading ? "Creating..." : success ? "✅ Created!" : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}