import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "../services/assignmentService";
import Navbar from "./Navbar";

export default function CreateAssignment() {
  const [form, setForm] = useState({ title: "", description: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createAssignment(form);
      navigate("/mentor");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/mentor")}
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

        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem", fontWeight: "700", color: "#fff" }}>
          📝 Create Assignment
        </h2>

        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "0.8rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontWeight: "600"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          background: "#1e293b",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          border: "1px solid #334155"
        }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "#cbd5e1" }}>
            Title
          </label>
          <input
            style={{
              display: "block",
              width: "100%",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              border: "1px solid #475569",
              borderRadius: "8px",
              fontSize: "0.95rem",
              background: "#0f172a",
              color: "#f1f5f9"
            }}
            placeholder="Assignment title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "#cbd5e1" }}>
            Description
          </label>
          <textarea
            style={{
              display: "block",
              width: "100%",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              border: "1px solid #475569",
              borderRadius: "8px",
              fontSize: "0.95rem",
              background: "#0f172a",
              color: "#f1f5f9",
              minHeight: "120px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            placeholder="Assignment description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "#cbd5e1" }}>
            Deadline (Optional)
          </label>
          <input
            style={{
              display: "block",
              width: "100%",
              padding: "0.75rem 1rem",
              marginBottom: "2rem",
              border: "1px solid #475569",
              borderRadius: "8px",
              fontSize: "0.95rem",
              background: "#0f172a",
              color: "#f1f5f9"
            }}
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => navigate("/mentor")}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "#475569",
                color: "#f1f5f9",
                border: "none",
                borderRadius: "8px",
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
                flex: 1,
                padding: "0.75rem",
                background: loading ? "#818cf8" : "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}