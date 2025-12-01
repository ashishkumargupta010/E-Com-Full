import React, { useState } from "react";
import "./ForgotPasswordModal.css";

const ForgotPasswordModal = ({ onClose }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!emailOrPhone) {
      setError("Please enter your email or mobile number.");
      return;
    }

    // Simple validation
    if (!/^\d{10}$|^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone)) {
      setError("Enter valid email or mobile number");
      return;
    }

    // Simulated response
    setMessage("✅ A password reset link has been sent!");
    setError("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content forgot-modal">
        <h2>Forgot Password</h2>
        <p>Enter your registered email or phone number</p>
        <input
          type="text"
          placeholder="Email or Mobile No"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button onClick={handleSubmit}>Send Reset Link</button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
