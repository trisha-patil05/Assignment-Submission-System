// src/services/submissionService.js
import api from "./api";

export const submitAssignment = async (assignmentId, textContent, file) => {
  console.log("FILE BEING SENT:", file); // ← ADD
  const formData = new FormData();
  formData.append("assignmentId", assignmentId);
  formData.append("content", textContent);
  if (file) formData.append("files", file); // ← "files" (matches upload.array("files"))

  const res = await api.post("/submissions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const markReviewed = async (submissionId, grade, feedback) => {
  const res = await api.patch(`/submissions/${submissionId}/review`, {
    grade,
    feedback,
  });
  return res.data;
};

export const getSubmissions = async () => {
  const res = await api.get("/submissions");
  return res.data;
};

export const getMySubmissions = async () => {
  const res = await api.get("/submissions/my"); 
  return res.data;
};

