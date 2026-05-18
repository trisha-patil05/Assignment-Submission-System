// src/components/ReviewModal.jsx
import { useState } from "react";
import { markReviewed } from "../services/submissionService";

export default function ReviewModal({ submission, onClose, onSuccess }) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getGradeColor = (g) => {
    if (g >= 80) return "#10b981";
    if (g >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grade) { setError("Please enter a grade"); return; }
    setLoading(true);
    setError("");
    try {
      await markReviewed(submission._id, Number(grade), feedback);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: "1rem"
    }} onClick={onClose}>

      <div style={{
        background: "#fff", borderRadius: "16px",
        padding: "2rem", width: "100%", maxWidth: "500px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>📝 Review Submission</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#9ca3af" }}>✕</button>
        </div>

        {/* Student Info */}
        <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ fontWeight: "600", marginBottom: "0.3rem" }}>
            👤 {submission.studentId?.name || submission.studentId?.email || "Student"}
          </p>
          {submission.content && (
            <p style={{ color: "#6b7280", fontSize: "0.88rem" }}>{submission.content}</p>
          )}
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
            {submission.files?.document && <a href={submission.files.document} target="_blank" rel="noreferrer" style={{ fontSize: "0.82rem", color: "#4f46e5" }}>📄 Document</a>}
            {submission.files?.image && <a href={submission.files.image} target="_blank" rel="noreferrer" style={{ fontSize: "0.82rem", color: "#4f46e5" }}>🖼️ Image</a>}
            {submission.files?.video && <a href={submission.files.video} target="_blank" rel="noreferrer" style={{ fontSize: "0.82rem", color: "#4f46e5" }}>🎥 Video</a>}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Grade Input */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.5rem" }}>
              Grade (0 - 100) *
            </label>
            <input
              type="number" min="0" max="100"
              value={grade}
              onChange={e => setGrade(e.target.value)}
              placeholder="Enter grade e.g. 85"
              style={{
                width: "100%", padding: "0.75rem 1rem",
                border: "1.5px solid #e5e7eb", borderRadius: "10px",
                fontSize: "1.1rem", fontWeight: "600", boxSizing: "border-box",
                color: grade ? getGradeColor(Number(grade)) : "#1f2937",
              }}
              required
            />
            {/* Grade bar preview */}
            {grade && (
              <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <div style={{ flex: 1, height: "6px", background: "#f3f4f6", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(grade, 100)}%`, height: "100%",
                    background: getGradeColor(Number(grade)),
                    borderRadius: "10px", transition: "width 0.3s"
                  }} />
                </div>
                <span style={{ fontWeight: "700", color: getGradeColor(Number(grade)), fontSize: "0.9rem" }}>
                  {grade}/100
                </span>
              </div>
            )}
          </div>

          {/* Quick grade buttons */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
            {[100, 90, 80, 70, 60, 50].map(g => (
              <button key={g} type="button"
                onClick={() => setGrade(String(g))}
                style={{
                  padding: "0.3rem 0.8rem", borderRadius: "8px",
                  border: "1.5px solid #e5e7eb", cursor: "pointer",
                  fontSize: "0.82rem", fontWeight: "600",
                  background: Number(grade) === g ? getGradeColor(g) : "#fff",
                  color: Number(grade) === g ? "#fff" : "#374151",
                  transition: "all 0.15s"
                }}>
                {g}
              </button>
            ))}
          </div>

          {/* Feedback */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: "600", fontSize: "0.88rem", marginBottom: "0.5rem" }}>
              Feedback <span style={{ color: "#9ca3af", fontWeight: "400" }}>(optional)</span>
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Write feedback for the student..."
              rows={3}
              style={{
                width: "100%", padding: "0.75rem 1rem",
                border: "1.5px solid #e5e7eb", borderRadius: "10px",
                fontSize: "0.92rem", resize: "vertical",
                fontFamily: "inherit", boxSizing: "border-box"
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: "0.75rem", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 2, padding: "0.75rem", background: loading ? "#a5b4fc" : "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600" }}>
              {loading ? "Submitting..." : "✅ Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
