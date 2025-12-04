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
    <header className="admin-navbar">

      {/* LEFT SECTION */}
      <div className="admin-navbar-left">
        
        {/* Mobile Hamburger */}
        <button className="menu-btn mobile-only" onClick={toggleSidebar}>
          <Menu size={26} />
        </button>

        <h1 className="admin-title">Dashboard</h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="admin-navbar-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </header>
  );
};

export default AdminNavbar;
