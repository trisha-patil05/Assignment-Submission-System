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
  const [dragOver, setDragOver] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await submitAssignment(id, content, file);
      navigate("/student");
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
      <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/student")}
          style={{
            marginBottom: "1.5rem",
            padding: "0.6rem 1.2rem",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.95rem"
          }}
        >
          ← Back
        </button>

        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.4rem", color: "#fff" }}>
          📤 Submit Assignment
        </h2>
        {assignment && (
          <p style={{ color: "#cbd5e1", marginBottom: "1.5rem" }}>
            {assignment.title}
          </p>
        )}

        {deadlinePassed ? (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "2.5rem" }}>⛔</p>
            <h3 style={{ color: "#991b1b", marginTop: "0.5rem", fontSize: "1.1rem" }}>
              Deadline Has Passed
            </h3>
            <p style={{ color: "#b91c1c", fontSize: "0.9rem", marginTop: "0.4rem" }}>
              This assignment was due on{" "}
              <strong>
                {new Date(assignment.deadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </strong>
            </p>
            <button
              onClick={() => navigate("/student")}
              style={{
                marginTop: "1.2rem",
                background: "#991b1b",
                color: "#fff",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              ← Go Back
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: "#1e293b",
            padding: "1.5rem",
            borderRadius: "14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            border: "1px solid #334155"
          }}>
            {error && (
              <div style={{
                background: "rgba(127,29,29,0.8)",
                color: "#fca5a5",
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                borderLeft: "4px solid #ef4444",
                fontSize: "0.9rem"
              }}>
                ⚠️ {error}
              </div>
            )}

            <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.4rem", color: "#cbd5e1" }}>
              Your Answer *
            </label>
            <textarea
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem",
                height: "130px",
                border: "1.5px solid #334155",
                borderRadius: "10px",
                fontSize: "0.95rem",
                marginBottom: "1.2rem",
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
                background: "#0f172a",
                color: "#f1f5f9"
              }}
              placeholder="Write your answer here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.4rem", color: "#cbd5e1" }}>
              Upload File (Optional)
            </label>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                setFile(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById("submitFileInput").click()}
              style={{
                marginBottom: "1.2rem",
                border: `2px dashed ${dragOver ? "#6366f1" : "#475569"}`,
                borderRadius: "10px",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "rgba(99, 102, 241, 0.1)" : "transparent",
                transition: "all 0.2s"
              }}
            >
              <input
                id="submitFileInput"
                type="file"
                accept=".pdf,.doc,.docx,image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              {file ? (
                <div>
                  <span style={{ fontSize: "1.8rem" }}>
                    {file.type.startsWith("image/") ? "🖼️" :
                     file.type.startsWith("video/") ? "🎥" :
                     file.name.endsWith(".pdf") ? "📄" : "📁"}
                  </span>
                  <p style={{ color: "#f1f5f9", fontWeight: "600", margin: "0.5rem 0 0" }}>{file.name}</p>
                  <p style={{ color: "#cbd5e1", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.4rem 0.8rem",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>☁️</span>
                  <p style={{ color: "#f1f5f9", fontWeight: "600", margin: "0" }}>
                    Drag & drop or click to upload
                  </p>
                  <small style={{ color: "#cbd5e1" }}>PDF, DOC, Image, Video (Max 10MB)</small>
                </div>
              )}
            </div>

            {assignment?.deadline && (
              <div style={{
                background: "rgba(245,158,11,0.1)",
                borderRadius: "8px",
                padding: "0.6rem 1rem",
                marginBottom: "1.2rem",
                fontSize: "0.85rem",
                color: "#fbbf24",
                border: "1px solid rgba(245,158,11,0.2)"
              }}>
                ⏰ Deadline: {new Date(assignment.deadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button
                type="button"
                onClick={() => navigate("/student")}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#334155",
                  color: "#94a3b8",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "0.75rem",
                  background: loading ? "#818cf8" : "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}