import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignments } from "../services/assignmentService";
import { submitAssignment } from "../services/submissionService";
import Navbar from "./Navbar";

export default function SubmitAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignment, setAssignment] = useState(null);
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getAssignments();
        const found = all.find(a => a._id === id);
        if (found) {
          setAssignment(found);
          if (found.deadline && new Date() > new Date(found.deadline)) {
            setDeadlinePassed(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please write an answer");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await submitAssignment(id, content, file);
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) {
    return (
      <div>
        <Navbar />
        <div style={{ marginTop: "65px", padding: "2rem" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "65px", display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <div className="sidebar">
          <div className="sidebar-section-label">📤 Submit</div>
          <button
            onClick={() => navigate("/student")}
            className="sidebar-item"
          >
            <span className="icon">⬅️</span>
            Back
          </button>
        </div>

        <div className="main-content" style={{ maxWidth: "700px" }}>
          <h2>📤 Submit Assignment</h2>
          <p style={{ color: "#cbd5e1", marginBottom: "1.5rem" }}>{assignment.title}</p>

          {deadlinePassed ? (
            <div className="alert alert-danger">
              <p style={{ margin: "0 0 0.5rem 0", fontWeight: "700" }}>⛔ Deadline Has Passed</p>
              <p style={{ margin: "0" }}>
                Due: {new Date(assignment.deadline).toLocaleDateString()}
              </p>
              <button
                onClick={() => navigate("/student")}
                className="btn btn-danger"
                style={{ marginTop: "1rem" }}
              >
                ← Go Back
              </button>
            </div>
          ) : (
            <div className="card">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" style={{ marginBottom: "1.2rem" }}>
                    ⚠️ {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Your Answer *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Write your answer here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload File (Optional)</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      setFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => document.getElementById("fileInput").click()}
                    style={{
                      border: `2px dashed ${dragOver ? "#6366f1" : "#334155"}`,
                      borderRadius: "12px",
                      padding: "2rem",
                      textAlign: "center",
                      cursor: "pointer",
                      background: dragOver ? "rgba(99,102,241,0.1)" : "transparent",
                      transition: "all 0.2s"
                    }}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept=".pdf,.doc,.docx,image/*,video/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    {file ? (
                      <div>
                        <p style={{ fontSize: "1.8rem", margin: "0 0 0.5rem 0" }}>
                          {file.type.startsWith("image/") ? "🖼️" :
                           file.type.startsWith("video/") ? "🎥" :
                           "📄"}
                        </p>
                        <p style={{ color: "#f1f5f9", fontWeight: "600", margin: "0" }}>{file.name}</p>
                        <p style={{ color: "#cbd5e1", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="btn btn-danger btn-sm"
                          style={{ marginTop: "0.5rem" }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>☁️</p>
                        <p style={{ color: "#f1f5f9", fontWeight: "600", margin: "0" }}>
                          Drag & drop or click
                        </p>
                        <p style={{ color: "#cbd5e1", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                          PDF, DOC, Image, Video (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {assignment.deadline && (
                  <div style={{
                    background: "rgba(245,158,11,0.1)",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    marginBottom: "1.2rem",
                    fontSize: "0.85rem",
                    color: "#fbbf24",
                    border: "1px solid rgba(245,158,11,0.2)"
                  }}>
                    ⏰ Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/student")}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ flex: 2 }}
                  >
                    {loading ? "Submitting..." : "Submit Assignment"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}