import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

import DashboardHome from "./DashboardHome";
import AdminProducts from "./AdminProducts";
import AdminCustomers from "./AdminCustomers";
import AdminCoupons from "./AdminCoupons";
import AdminOrders from "./AdminOrders";
import AdminReviews from "./AdminReviews";
import AdminSettings from "./AdminSettings";

import "./AdminDashboard.css"; // make sure filename matches exactly

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const closeSidebar = () => setSidebarOpen(false);
    window.addEventListener("popstate", closeSidebar);
    return () => window.removeEventListener("popstate", closeSidebar);
  }, []);

  return (
    <div className="admin-layout">
      {/* Single Sidebar component — passes open class */}
      <AdminSidebar className={sidebarOpen ? "open" : ""} />

      {/* overlay only when mobile open */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-main">
        {/* Navbar must be direct child of admin-main (no extra wrappers) */}
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
