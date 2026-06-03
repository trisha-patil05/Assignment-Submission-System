import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateAssignment from "./pages/CreateAssignment";
import Login from "./pages/Login";
import MentorDashboard from "./pages/MentorDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitAssignment from "./pages/SubmitAssignment";
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
  path="/mentor"
  element={
    <ProtectedRoute role="mentor">
      <MentorDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/mentor/create"
  element={
    <ProtectedRoute role="mentor">
      <CreateAssignment />
    </ProtectedRoute>
  }
/>

<Route
  path="/student"
  element={
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/student/submit/:id"
  element={
    <ProtectedRoute role="student">
      <SubmitAssignment />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;