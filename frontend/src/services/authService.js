// src/services/authService.js
import api from "./api";

const decodeToken = (token) => {
  try {
    const base64 = token.split(".")[1];
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch {
    return null;
  }
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  const decoded = decodeToken(res.data.token);

  const user = {
    id: decoded.id,
    _id: decoded.id,
    role: decoded.role,
    email: data.email,
    name: data.name,
  };

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  const decoded = decodeToken(res.data.token);

  const user = {
    id: decoded.id,
    _id: decoded.id,
    role: decoded.role,
    email,
  };

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};