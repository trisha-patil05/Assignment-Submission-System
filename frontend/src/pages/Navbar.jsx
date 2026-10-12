import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";
import socket from "../socket";

export default function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    const onNotification = (data) => {
      console.log("🔔 Notification:", data);
      setNotifications(prev => [data, ...prev].slice(0, 10));
    };
    socket.on("notification", onNotification);
    return () => socket.off("notification", onNotification);
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        📚 AssignmentHub
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-role">{user.role?.toUpperCase() || "USER"}</span>
            <span className="navbar-user">{user.email}</span>
            
            {/* Notification Bell */}
            <div className="notif-wrapper">
              <button 
                className="bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {notifications.length > 0 && (
                  <span className="bell-badge">{Math.min(notifications.length, 9)}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    Notifications
                    {notifications.length > 0 && (
                      <button 
                        className="clear-btn"
                        onClick={() => setNotifications([])}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications yet</div>
                  ) : (
                    notifications.map((notif, i) => (
                      <div key={i} className="notif-item">
                        <span className="notif-icon">
                          {notif.type === "assignment" && "📚"}
                          {notif.type === "submission" && "📤"}
                          {notif.type === "grade" && "✅"}
                          {notif.type === "resubmission" && "🔁"}
                        </span>
                        <div className="notif-body">
                          <p className="notif-msg">{notif.message}</p>
                          {notif.grade && (
                            <p className="notif-grade">Grade: {notif.grade}/100</p>
                          )}
                          <p className="notif-time">
                            {new Date(notif.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}