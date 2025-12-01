import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import DashboardHome from "./DashboardHome";
import AdminProducts from "./AdminProducts";
import AdminCustomers from "./AdminCustomers";
import AdminCoupons from "./AdminCoupons"; // ✅ fixed spelling
import AdminOrders from "./AdminOrders";   // ✅ added
import AdminReviews from "./AdminReviews";
import AdminSettings from "./AdminSettings";
import "./Admin.css";

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="orders" element={<AdminOrders />} /> {/* ✅ added */}
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


