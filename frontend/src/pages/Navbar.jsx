import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";
import socket from "../socket";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState(null);

 useEffect(() => {
  if (!user) return;

  // Wait for connection THEN join rooms
  socket.on("connect", () => {
    console.log("🔌 Socket connected, joining rooms...");
    socket.emit("join", { userId: user.id || user._id, role: user.role });
  });

  // Listen for notifications
  socket.on("notification", (data) => {
    console.log("🔔 Notification:", data);
    setNotifications((prev) => [data, ...prev]);
    setToast(data.message);
    setTimeout(() => setToast(null), 4000);
  });

  // Connect AFTER listeners are set
  socket.connect();

  return () => {
    socket.off("connect");
    socket.off("notification");
    socket.disconnect();
  };
}, []);

  const handleLogout = () => {
    socket.disconnect();
    logoutUser();
    navigate("/login");
  };

  const unreadCount = notifications.length;

  const clearAll = () => setNotifications([]);

  const getIcon = (type) => {
    if (type === "assignment") return "📚";
    if (type === "submission") return "📨";
    if (type === "grade")      return "✅";
    return "🔔";
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60)   return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">📋 AssignmentHub</div>

        <div className="navbar-right">
          <span className="navbar-role">{user?.role}</span>
          <span className="navbar-user">👤 {user?.email}</span>

          {/* 🔔 Bell Icon */}
          <div className="notif-wrapper">
            <button
              className="bell-btn"
              onClick={() => setShowDropdown((p) => !p)}
            >
              🔔
              {unreadCount > 0 && (
                <span className="bell-badge">{unreadCount}</span>
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span>🔔 Notifications</span>
                  {notifications.length > 0 && (
                    <button className="clear-btn" onClick={clearAll}>
                      Clear all
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="notif-item">
                      <span className="notif-icon">{getIcon(n.type)}</span>
                      <div className="notif-body">
                        <p className="notif-msg">{n.message}</p>
                        {n.grade && (
                          <p className="notif-grade">Score: {n.grade}/100</p>
                        )}
                        <p className="notif-time">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </>
  );
}