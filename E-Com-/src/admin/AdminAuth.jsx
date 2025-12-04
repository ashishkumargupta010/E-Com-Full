import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAuth.css";

const AdminAuth = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // -----------------------------
      //  FIXED STORAGE (MOST IMPORTANT)
      // -----------------------------
      localStorage.setItem("adminToken", data.token);        // ✔ correct token
      localStorage.setItem("adminInfo", JSON.stringify(data.admin)); // ✔ admin details
      localStorage.setItem("role", "admin");                 // ✔ login role check
      localStorage.setItem("isAdminLoggedIn", "true");       // ✔ optional use

      // redirect to dashboard
      navigate("/admin/dashboard");

    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <h2>Blushora Admin</h2>
        <p className="subtitle">Secure access to admin dashboard</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Sign In</button>
        </form>

        <p className="note">Use your registered Admin Email / Password</p>
      </div>
    </div>
  );
};

export default AdminAuth;
