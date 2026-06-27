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
        <Route element={<ProtectedRoute role="mentor" />}>
  <Route path="/mentor" element={<MentorDashboard />} />
  <Route path="/mentor/create" element={<CreateAssignment />} />
</Route>
<Route element={<ProtectedRoute role="student" />}>
  <Route path="/student" element={<StudentDashboard />} />
  <Route path="/student/submit/:id" element={<SubmitAssignment />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;