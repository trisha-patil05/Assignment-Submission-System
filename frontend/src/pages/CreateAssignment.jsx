// pages/CreateAssignment.jsx
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
      navigate("/mentor/create");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    display: "block", width: "100%", padding: "0.75rem 1rem",
    marginBottom: "1.1rem", border: "1.5px solid #e2e8f0",
    borderRadius: "10px", fontSize: "0.95rem", boxSizing: "border-box", background: "#f8fafc"
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>📝 Create Assignment</h2>
        {error && <div style={{ background: "#fee2e2", color: "#ffffff",fontWeight: "600", padding: "0.8rem", borderRadius: "8px", marginBottom: "1rem" }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.3rem" }}>Title</label>
          <input style={inputStyle} placeholder="Assignment title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.3rem" }}>Description</label>
          <textarea style={{ ...inputStyle, height: "110px", resize: "vertical" }}
            placeholder="Assignment description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} required />

          <label style={{ fontWeight: "600", display: "block", marginBottom: "0.3rem" }}>Deadline <span style={{ color: "#94a3b8", fontWeight: "400" }}>(optional)</span></label>
          <input style={inputStyle} type="date" value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })} />

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "0.85rem", background: loading ? "#a5b4fc" : "#6366f1", color: "#fff", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
}
