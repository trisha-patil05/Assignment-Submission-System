import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignments } from "../services/assignmentService";
import { submitAssignment } from "../services/submissionService";
import Navbar from "./Navbar";

export default function SubmitAssignment() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignment, setAssignment] = useState(null);
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [dragOver, setDragOver] = useState(false); // ← ADDED
  const navigate = useNavigate();

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

  // ← FIXED handleSubmit (removed duplicate lines)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FILE STATE:", file);
    setError("");
    setLoading(true);
    try {
      await submitAssignment(id, content, file);
      navigate("/student/submit/${a._id}");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", color: "#fff" }}>Loading assignment...</div>
    </div>
  );
}

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "650px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.4rem" }}>
          📤 Submit Assignment
        </h2>
        {assignment && (
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            {assignment.title}
          </p>
        )}

        {/* Deadline passed block */}
        {deadlinePassed ? (
          <div style={{
            background: "#fee2e2", border: "1px solid #fca5a5",
            borderRadius: "12px", padding: "2rem", textAlign: "center"
          }}>
            <p style={{ fontSize: "2.5rem" }}>⛔</p>
            <h3 style={{ color: "#991b1b", marginTop: "0.5rem", fontSize: "1.1rem" }}>
              Deadline Has Passed
            </h3>
            <p style={{ color: "#b91c1c", fontSize: "0.9rem", marginTop: "0.4rem" }}>
              This assignment was due on{" "}
              <strong>
                {new Date(assignment.deadline).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </strong>
            </p>
            <button onClick={() => navigate("/student")}
              style={{
                marginTop: "1.2rem", background: "#991b1b", color: "#fff",
                border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px",
                cursor: "pointer", fontWeight: "600"
              }}>
              ← Go Back
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: "#1e293b", padding: "1.5rem",
            borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            border: "1px solid #334155"
          }}>
            {error && (
              <div style={{
                background: "rgba(127,29,29,0.8)", color: "#fca5a5",
                padding: "0.8rem 1rem", borderRadius: "8px",
                marginBottom: "1rem", borderLeft: "4px solid #ef4444",
                fontSize: "0.9rem"
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Your Answer */}
            <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.4rem", color: "#cbd5e1" }}>
              Your Answer *
            </label>
            <textarea
              style={{
                display: "block", width: "100%", padding: "0.75rem",
                height: "130px", border: "1.5px solid #334155",
                borderRadius: "10px", fontSize: "0.95rem",
                marginBottom: "1.2rem", boxSizing: "border-box",
                resize: "vertical", fontFamily: "inherit",
                background: "#0f172a", color: "#f1f5f9", outline: "none"
              }}
              placeholder="Write your answer here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            {/* ← REPLACED old file input with drag & drop */}
            <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.4rem", color: "#cbd5e1" }}>
              Upload File{" "}
              <span style={{ color: "#64748b", fontWeight: "400" }}>
                (PDF, DOC, Image, Video — Max 10MB)
              </span>
            </label>

            <div
              className={`drop-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                setFile(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById("submitFileInput").click()}
              style={{ marginBottom: "1.2rem" }}
            >
              <input
  id="submitFileInput"
  type="file"
  accept=".pdf,.doc,.docx,image/*,video/*"
  onChange={(e) => setFile(e.target.files[0])}
  style={{ display: "none" }}
/>
              {file ? (
                <div className="file-selected">
                  <span style={{ fontSize: "1.8rem" }}>
                    {file.type.startsWith("image/") ? "🖼️" :
                    file.type.startsWith("video/") ? "🎥" :
                    file.name.endsWith(".pdf")     ? "📄" : "📁"}
                  </span>
                  <div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >✕</button>
                </div>
              ) : (
                <div className="drop-placeholder">
                  <span className="drop-icon">☁️</span>
                  <p>Drag & drop or click to upload</p>
                  <small>PDF, DOC, Image, Video (Max 10MB)</small>
                </div>
              )}
            </div>

            {/* Deadline warning */}
            {assignment?.deadline && (
              <div style={{
                background: "rgba(245,158,11,0.1)", borderRadius: "8px",
                padding: "0.6rem 1rem", marginBottom: "1.2rem",
                fontSize: "0.85rem", color: "#fbbf24",
                border: "1px solid rgba(245,158,11,0.2)"
              }}>
                ⏰ Deadline: {new Date(assignment.deadline).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button type="button" onClick={() => navigate("/student")}
                style={{
                  flex: 1, padding: "0.75rem", background: "#334155",
                  color: "#94a3b8", border: "none", borderRadius: "10px",
                  cursor: "pointer", fontWeight: "600"
                }}>
                ← Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{
                  flex: 2, padding: "0.75rem",
                  background: loading ? "#4338ca" : "#4f46e5",
                  color: "#fff", border: "none", borderRadius: "10px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600", opacity: loading ? 0.7 : 1
                }}>
                {loading ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}