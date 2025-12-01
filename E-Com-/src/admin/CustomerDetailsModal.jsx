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
          background: "white",
          padding: "20px",
          width: "450px",
          borderRadius: "12px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2>{user.name}</h2>
        <p>{user.emailOrPhone}</p>
        <p>
          Joined: <b>{new Date(user.createdAt).toLocaleDateString()}</b>
        </p>

        <hr />

        <h3>Orders</h3>
        <p>Total Orders: <b>{orders.length}</b></p>
        <p>Total Spent: <b>₹{totalSpent}</b></p>

        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              padding: "10px",
              border: "1px solid #eee",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <b>Order #{o.id}</b>
            <p>Status: {o.status}</p>
            <p>Total: ₹{o.total}</p>
            <p>Date: {o.date}</p>
          </div>
        ))}

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            background: "#ff4d6d",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
