// src/services/api.js
import axios from "axios";

// ← Detect environment and use correct API URL
const getApiUrl = () => {
  // In production (Vercel), use Render backend
  if (window.location.hostname === "assignment-submission-frontend-xxxxx.vercel.app") {
    return "https://assignment-submission-system-utbj.onrender.com";
  }
  
  // In local development, use localhost
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  
  // Default to environment variable if set
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
};

const API_URL = getApiUrl();

console.log("🔗 API URL:", API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;