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
  localStorage.setItem("role", decoded.role);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  const decoded = decodeToken(res.data.token);

  const user = {
    id: decoded.id,
    _id: decoded.id,
    role: decoded.role,
    email: data.email,
  };

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("role", decoded.role);
  return res.data;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("role");
};