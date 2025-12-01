import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // get orderId from navigation OR fallback from localStorage
  const orderId = location.state?.orderId || localStorage.getItem("lastOrderId");

  return (
    <div className="success-box">
      <div className="success-icon">✓</div>

      <h1>Order Placed Successfully!</h1>

      {orderId ? (
        <h2>Order ID: {orderId}</h2>
      ) : (
        <h2>Order ID Not Found</h2>
      )}

      <p>Your items will be delivered soon.</p>

      <button onClick={() => navigate("/userpanel/orders")}>
        View My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;
