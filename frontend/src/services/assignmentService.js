// src/services/assignmentService.js
import api from "./api";

export const getAssignments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/assignments?${queryString}` : "/assignments";
    
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("❌ getAssignments error:", err);
    throw err;
  }
};

export const createAssignment = async (data) => {
  try {
    const res = await api.post("/assignments", data);
    return res.data;
  } catch (err) {
    console.error("❌ createAssignment error:", err);
    throw err;
  }
};

// Optional: Helper for common filter presets
export const getAssignmentsByFilter = async (filterType) => {
  const filters = {
    recent: { sortBy: "date", sortOrder: "desc" },
    deadline: { sortBy: "deadline", sortOrder: "asc" },
    alphabetical: { sortBy: "title", sortOrder: "asc" }
  };

  return getAssignments(filters[filterType] || {});
};