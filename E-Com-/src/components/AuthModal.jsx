import React, { useState, useEffect } from "react";
import "./AuthModal.css";

const API = "http://localhost:5000/api/auth";

const AuthModal = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot | otp | reset

  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // clear errors when switching tab
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [mode]);

  // ---------------------------------------
  // VALIDATION
  // ---------------------------------------
  const validateInput = () => {
    if (!emailOrPhone.trim()) {
      setError("Please enter email or phone");
      return false;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone.trim());
    const isPhone = /^\d{10}$/.test(emailOrPhone.trim());

    if (!isEmail && !isPhone) {
      setError("Enter valid email or 10-digit phone");
      return false;
    }

    return true;
  };

  // Creates backend-friendly payload
  const formatPayload = () => {
    const value = emailOrPhone.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^\d{10}$/.test(value);

    return {
      email: isEmail ? value : null,
      phone: isPhone ? value : null,
    };
  };

  // ---------------------------------------
  // MAIN AUTH FUNCTION
  // ---------------------------------------
  const handleAuth = async () => {
    // ---------------------- SIGN UP ----------------------
    if (mode === "signup") {
      if (!name.trim()) return setError("Name required");
      if (!validateInput()) return;
      if (!password.trim()) return setError("Password required");
      if (password !== confirmPassword) return setError("Passwords do not match");

      const { email, phone } = formatPayload();

      try {
        const res = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Signup failed");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
        onClose();
      } catch {
        setError("Server error");
      }

      return;
    }

    // ---------------------- SIGN IN ----------------------
    if (mode === "signin") {
      if (!validateInput()) return;
      if (!password.trim()) return setError("Password required");

      const { email, phone } = formatPayload();

      try {
        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Invalid login credentials");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
        onClose();
      } catch {
        setError("Server error");
      }

      return;
    }

    // ---------------------- FORGOT → OTP ----------------------
    if (mode === "forgot") {
      if (!validateInput()) return;

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      alert("Your OTP: " + code);
      setMode("otp");
      return;
    }

    // ---------------------- OTP ----------------------
    if (mode === "otp") {
      if (otp === generatedOtp) {
        setSuccess("OTP verified! Create new password.");
        setTimeout(() => setMode("reset"), 1200);
      } else {
        setError("Incorrect OTP");
      }
      return;
    }

    // ---------------------- RESET PASSWORD ----------------------
    if (mode === "reset") {
      if (!password.trim() || password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setSuccess("Password reset successful!");
      setTimeout(() => setMode("signin"), 1500);
      return;
    }
  };

  // ---------------------------------------
  // UI Forms
  // ---------------------------------------
  const renderForm = () => {
    switch (mode) {
      case "signup":
        return (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={handleAuth}>Create Account</button>

            <p className="forgot-btn" onClick={() => setMode("signin")}>
              Already have an account? Sign In
            </p>
          </>
        );

      case "signin":
        return (
          <>
            <input
              type="text"
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleAuth}>Sign In</button>

            <button className="forgot-btn" onClick={() => setMode("forgot")}>
              Forgot Password?
            </button>

            <p className="forgot-btn" onClick={() => setMode("signup")}>
              Don’t have an account? Sign Up
            </p>
          </>
        );

      case "forgot":
        return (
          <>
            <input
              type="text"
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <button onClick={handleAuth}>Send OTP</button>

            <p className="forgot-btn" onClick={() => setMode("signin")}>
              ← Back to Sign In
            </p>
          </>
        );

      case "otp":
        return (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleAuth}>Verify OTP</button>
          </>
        );

      case "reset":
        return (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleAuth}>Reset Password</button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {(mode === "signin" || mode === "signup") && (
          <div className="auth-tabs">
            <button
              className={mode === "signin" ? "active" : ""}
              onClick={() => setMode("signin")}
            >
              Sign In
            </button>

            <button
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="auth-body">
          {renderForm()}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
