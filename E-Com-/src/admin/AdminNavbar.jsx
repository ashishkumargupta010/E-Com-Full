import React from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 Remove admin session
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("isAdminLoggedIn");

    alert("Admin logged out successfully!");

    // 🔄 Redirect to login page
    navigate("/admin/login");
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
