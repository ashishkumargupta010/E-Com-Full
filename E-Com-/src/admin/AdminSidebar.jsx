import React from "react";
import { NavLink } from "react-router-dom";
import "./Admin.css";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2 className="sidebar-title">Blushora</h2>
      <nav className="sidebar-links">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/customers">Customers</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink> {/* ✅ added */}
        <NavLink to="/admin/coupons">Coupons</NavLink> {/* ✅ fixed spelling */}
        <NavLink to="/admin/reviews">Reviews</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;