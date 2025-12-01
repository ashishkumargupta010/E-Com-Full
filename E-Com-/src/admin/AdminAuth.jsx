import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAuth.css";

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store admin token
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data.admin));

      // Redirect to Admin Dashboard
      navigate("/admin");
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <h2>👑 Admin Login</h2>
        <p className="subtitle">Secure access to admin dashboard</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Sign In</button>
        </form>

        <p className="note">
          Use your registered Admin Email / Password
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
