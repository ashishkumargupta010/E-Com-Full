import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import "./AdminNavbar.css";

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  return (
    <header className="admin-navbar" role="banner">
      <div className="admin-navbar-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu size={26} />
        </button>
        <h1 className="admin-title">Welcome, Admin</h1>
      </div>

      <div className="admin-navbar-actions" role="navigation" aria-label="Admin actions">
        <input
          type="text"
          placeholder="Search..."
          className="admin-search-input"
          aria-label="Search"
        />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default AdminNavbar;
