// src/services/submissionService.js
import api from "./api";

export const submitAssignment = async (assignmentId, content, file) => {
  try {
    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("content", content);
    if (file) formData.append("files", file);

    const res = await api.post("/submissions", formData);
    return res.data;
  } catch (err) {
    console.error("❌ submitAssignment error:", err);
    throw err;
  }
};

export const getSubmissions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/submissions?${queryString}` : "/submissions";
    
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("❌ getSubmissions error:", err);
    throw err;
  }
};

export const getMySubmissions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/submissions/my?${queryString}` : "/submissions/my";
    
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("❌ getMySubmissions error:", err);
    throw err;
  }
};

export const markReviewed = async (submissionId, grade, feedback) => {
  try {
    const res = await api.patch(`/submissions/${submissionId}/review`, {
      grade: Number(grade),
      feedback: feedback || ""
    });
    return res.data;
  } catch (err) {
    console.error("❌ markReviewed error:", err);
    throw err;
  }
};

export const getSubmissionHistory = async (assignmentId) => {
  try {
    const res = await api.get(`/submissions/history/${assignmentId}`);
    return res.data;
  } catch (err) {
    console.error("❌ getSubmissionHistory error:", err);
    throw err;
  }
};

// Helper: Filter presets
export const getSubmissionsByFilter = async (filterType, role = "mentor") => {
  const filters = {
    pending: { status: "submitted", sortBy: "date", sortOrder: "desc" },
    graded: { status: "reviewed", sortBy: "grade", sortOrder: "desc" },
    recent: { sortBy: "date", sortOrder: "desc" },
    late: { isLate: true }
  };

  return role === "mentor" 
    ? getSubmissions(filters[filterType] || {})
    : getMySubmissions(filters[filterType] || {});
};