// pages/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
