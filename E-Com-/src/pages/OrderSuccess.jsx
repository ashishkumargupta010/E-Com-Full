import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get Order ID from state or localStorage 
  const orderId =
    location.state?.orderId || localStorage.getItem("lastOrderId");

  /* ------------------------
        CONFETTI ANIMATION
  -------------------------*/
  useEffect(() => {
    // Center Blast
    confetti({
      particleCount: 200,
      spread: 90,
      startVelocity: 45,
      ticks: 200,
      gravity: 0.4,
      origin: { y: 0.6 },
    });

    // Side Confetti
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 150,
        spread: 120,
        origin: { x: 1 },
      });
    }, 400);
  }, []);

  /* ------------------------
        NAVIGATION FIX
  -------------------------*/
  const goToOrders = () => {
    console.log("Navigating → /userpanel/orders");
    navigate("/userpanel/orders");
  };

  return (
    <div className="success-wrapper">

      {/* Disable click-blocking for animations */}
      <div className="blast-circle" style={{ pointerEvents: "none" }}></div>

      <div className="success-icon" style={{ pointerEvents: "none" }}>
        ✓
      </div>

      <h1 className="title">Order Placed Successfully! 🎉</h1>

      {orderId ? (
        <h2 className="order-id">Order ID: {orderId}</h2>
      ) : (
        <h2 className="order-id">Order ID Not Found</h2>
      )}

      <p className="message">
        Thank you for shopping with us. Your items will arrive soon ❤️
      </p>

      {/* BUTTON ALWAYS CLICKABLE */}
      <button
        className="btn"
        onClick={goToOrders}
        style={{ position: "relative", zIndex: 9999 }}
      >
        View My Orders →
      </button>
    </div>
  );
};

export default OrderSuccess;
