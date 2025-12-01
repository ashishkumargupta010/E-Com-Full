import React from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 Clear admin login session
    localStorage.removeItem("isAdminLoggedIn");
    alert("Admin logged out successfully!");

    // 🔄 Redirect to home or admin login page
    navigate("/admin/login"); // or use "/" if no admin login page yet
  };

  return (
    <header className="admin-navbar">
      <h1>Welcome, Admin</h1>
      <div className="admin-navbar-actions">
        <input type="text" placeholder="Search..." />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;

