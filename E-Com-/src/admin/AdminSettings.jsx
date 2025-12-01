import React, { useState } from "react";
import "./Admin.css";

const AdminSettings = () => {
  const [adminName, setAdminName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setSuccessMessage("✅ Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSuccessMessage("❌ New passwords do not match!");
      return;
    }
    if (!password || !newPassword) {
      setSuccessMessage("❌ Please fill all password fields!");
      return;
    }
    setSuccessMessage("🔒 Password changed successfully!");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="admin-settings">
      <h2>⚙️ Admin Settings</h2>
      <p className="settings-subtitle">
        Manage your profile information and account security.
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


