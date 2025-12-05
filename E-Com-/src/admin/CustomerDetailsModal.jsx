import React from "react";

const CustomerDetailsModal = ({ user, onClose }) => {
  const orders = user.orders || [];
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5000,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "24px",
          width: "480px",
          borderRadius: "14px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* HEADER */}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#0d47a1",
            marginBottom: "4px",
          }}
        >
          {user.name}
        </h2>

        <p style={{ color: "#444", marginBottom: "6px" }}>
          {user.emailOrPhone}
        </p>

        <p style={{ fontSize: "14px", color: "#666" }}>
          Joined on: 
          <b style={{ color: "#000" }}>
            {" "}{new Date(user.createdAt).toLocaleDateString()}
          </b>
        </p>

        <hr style={{ margin: "16px 0", borderColor: "#e0e0e0" }} />

        {/* SUMMARY */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#0d47a1",
            marginBottom: "10px",
          }}
        >
          Order Summary
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            background: "#f5f7ff",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "14px",
            border: "1px solid #d0d8ff",
          }}
        >
          <p><b>Total Orders:</b> {orders.length}</p>
          <p><b>Total Spent:</b> ₹{totalSpent}</p>
        </div>

        {/* ORDER LIST */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#0d47a1",
            marginBottom: "10px",
          }}
        >
          Order History
        </h3>

        {orders.length === 0 ? (
          <p style={{ color: "#777" }}>No orders found.</p>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              style={{
                padding: "14px",
                borderRadius: "10px",
                marginBottom: "12px",
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ fontWeight: "600", fontSize: "15px" }}>
                Order #{o.id}
              </p>

              <p style={{ color: "#444", margin: "2px 0" }}>
                Status: <b>{o.status}</b>
              </p>

              <p style={{ color: "#444", margin: "2px 0" }}>
                Total: <b>₹{o.total}</b>
              </p>

              <p style={{ color: "#777", fontSize: "13px" }}>
                Date: {new Date(o.date || o.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#0d47a1",
            color: "white",
            borderRadius: "10px",
            border: "none",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.25s",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
