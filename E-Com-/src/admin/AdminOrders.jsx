import React, { useState, useEffect } from "react";
import "./AdminOrders.css";

const API = "http://localhost:5000/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");

  // SECURITY CHECK
  if (!token || role !== "admin") {
    return <h2 style={{ padding: "20px" }}>❌ Unauthorized – Admin only</h2>;
  }

  // LOAD ALL ORDERS
  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!Array.isArray(data)) return setOrders([]);

      // Latest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(data);
    } catch (err) {
      console.log("Error loading orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // FILTERED ORDERS
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      search === "" ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search);

    const matchesStatus =
      statusFilter === "All" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) return alert("Status update failed");

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  // CANCEL ORDER
  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      await fetch(`${API}/orders/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-orders-layout">

      {/* ---------------- LEFT FILTER PANEL ---------------- */}
      <div className="orders-filter-box">
        <h3>🔍 Filters</h3>

        <input
          type="text"
          placeholder="Search by name or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Return Requested">Return Requested</option>
          <option value="Return Approved">Return Approved</option>
          <option value="Refund Completed">Refund Completed</option>
        </select>
      </div>

      {/* ---------------- RIGHT ORDER LIST ---------------- */}
      <div className="orders-right">
        <h1>📦 All Orders</h1>

        {filteredOrders.length === 0 && (
          <h3>No Orders Found</h3>
        )}

        {filteredOrders.map((o) => (
          <div key={o.id} className="admin-order-card">
            
            {/* STATUS BADGE */}
            <div className={`status-tag ${o.status.replace(/\s+/g, "")}`}>
              {o.status}
            </div>

            <h3>Order #{o.id}</h3>

            {/* USER DETAILS */}
            <p><b>User:</b> {o.user?.name} ({o.user?.email})</p>
            <p><b>Phone:</b> {o.address?.phone}</p>

            {/* ORDER TIMING */}
            <p><b>Placed On:</b> {new Date(o.createdAt).toLocaleString()}</p>

            {/* PAYMENT */}
            <p><b>Payment:</b> {o.paymentMethod}</p>

            {/* ADDRESS */}
            <p>
              <b>Address:</b> {o.address?.address}, {o.address?.city} -{" "}
              {o.address?.pincode}
            </p>

            {/* ITEMS */}
            <h4>Items</h4>
            <ul className="item-list">
              {o.items?.map((item) => (
                <li key={item.id}>
                  <img
                    src={item.product?.image || "/no-image.png"}
                    className="order-img"
                  />
                  <div>
                    <p>{item.product?.name}</p>
                    <p>₹{item.price} × {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* TOTAL AMOUNT */}
            <p className="order-total">
              <b>Total:</b> ₹{o.total}
            </p>

            {/* ACTION BUTTONS */}
            <div className="order-actions">
              {o.status === "Pending" && (
                <>
                  <button onClick={() => updateStatus(o.id, "Shipped")}>
                    Ship
                  </button>
                  <button className="cancel" onClick={() => cancelOrder(o.id)}>
                    Cancel
                  </button>
                </>
              )}

              {o.status === "Shipped" && (
                <button onClick={() => updateStatus(o.id, "Delivered")}>
                  Mark Delivered
                </button>
              )}

              {o.status === "Return Requested" && (
                <>
                  <button
                    className="approve"
                    onClick={() => updateStatus(o.id, "Return Approved")}
                  >
                    Approve Return
                  </button>

                  <button
                    className="reject"
                    onClick={() => updateStatus(o.id, "Return Rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>

            {/* STATUS DROPDOWN */}
            <div className="status-update">
              <label>Update Status:</label>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Return Requested">Return Requested</option>
                <option value="Return Approved">Return Approved</option>
                <option value="Refund Completed">Refund Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
