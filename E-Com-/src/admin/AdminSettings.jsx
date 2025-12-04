import React, { useState, useEffect } from "react";
import "./AdminSettings.css";

const API = "http://localhost:5000/api";

const AdminSettings = () => {
  const token = localStorage.getItem("adminToken");

  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =============================
  // LOAD ADMIN PROFILE
  // =============================
  const loadProfile = async () => {
    try {
      const res = await fetch(`${API}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setAdminName(data.name);
      setEmail(data.email);
    } catch (err) {
      console.log("Profile Load Error:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =============================
  // UPDATE PROFILE
  // =============================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: adminName,
          email: email,
        }),
      });

      const data = await res.json();
      setSuccessMessage("✅ Profile updated successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setSuccessMessage("❌ Something went wrong!");
    }
  };

  // =============================
  // UPDATE PASSWORD
  // =============================
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setSuccessMessage("❌ New passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API}/admin/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: password,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSuccessMessage(`❌ ${data.message}`);
        return;
      }

      setSuccessMessage("🔒 Password changed successfully!");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setSuccessMessage("❌ Unable to update password!");
    }
  };

  return (
    <div className="admin-settings">
      <h2>⚙️ Admin Settings</h2>
      <p className="settings-subtitle">
        Update your personal details and manage your account securely.
      </p>

      {successMessage && <div className="settings-message">{successMessage}</div>}

      <div className="settings-section">
        <h3>👤 Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="settings-form">
          <label>Full Name</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Update Profile</button>
        </form>
      </div>

      <div className="settings-section">
        <h3>🔑 Change Password</h3>
        <form onSubmit={handlePasswordChange} className="settings-form">
          <label>Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
