import { useState, useEffect } from "react";
import "./editprofile.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:5000/api/users";

const EditProfile = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

  // Profile Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password Change Fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Popup for verifying contact update
  const [showPassPopup, setShowPassPopup] = useState(false);
  const [verifyPasswordInput, setVerifyPasswordInput] = useState("");

  /* ------------------------------------
        LOAD USER DETAILS
  ------------------------------------ */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loggedInUser"));
    if (stored) {
      setUser(stored);
      setName(stored.name);
      setEmail(stored.email);
      setPhone(stored.phone || "");
    }
  }, []);

  if (!user)
    return (
      <h2 style={{ textAlign: "center", padding: "20px", color: "#ff2d78" }}>
        You are not logged in.
      </h2>
    );

  /* ------------------------------------
        UPDATE NAME
  ------------------------------------ */
  const updateNameHandler = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");

    try {
      const res = await fetch(`${API}/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      const updated = { ...user, name };
      localStorage.setItem("loggedInUser", JSON.stringify(updated));
      setUser(updated);

      toast.success("Name updated successfully! 💖");
    } catch {
      toast.error("Server error");
    }
  };

  /* ------------------------------------
        ASK PASSWORD BEFORE CONTACT UPDATE
  ------------------------------------ */
  const askPasswordBeforeUpdate = () => {
    if (email !== user.email || phone !== user.phone) {
      setShowPassPopup(true);
    } else {
      toast.info("No changes detected");
    }
  };

  /* ------------------------------------
        VERIFY PASSWORD + UPDATE CONTACT
  ------------------------------------ */
  const updateContactHandler = async () => {
    if (!verifyPasswordInput.trim())
      return toast.error("Please enter your password");

    try {
      const res = await fetch(`${API}/update-contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: verifyPasswordInput,
          email,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      const updated = { ...user, email, phone };
      localStorage.setItem("loggedInUser", JSON.stringify(updated));
      setUser(updated);

      toast.success("Contact details updated successfully 💗");

      setShowPassPopup(false);
      setVerifyPasswordInput("");
    } catch {
      toast.error("Server error");
    }
  };

  /* ------------------------------------
        CHANGE PASSWORD
  ------------------------------------ */
  const changePasswordHandler = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return toast.error("All fields are required");

    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match!");

    try {
      const res = await fetch(`${API}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Password changed successfully! 🔐");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="profile-wrapper">
      <h2>Edit Profile</h2>

      {/* ---------- NAME + CONTACT SECTION ---------- */}
      <div className="profile-form">
        <label>Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={updateNameHandler}>Save Name</button>

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />

        <button onClick={askPasswordBeforeUpdate}>
          Update Email / Phone
        </button>
      </div>

      {/* ---------- CHANGE PASSWORD SECTION ---------- */}
      <div className="profile-form" style={{ marginTop: "30px" }}>
        <h3 style={{ marginBottom: "10px", color: "#ff2d78" }}>
          Change Password
        </h3>

        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={changePasswordHandler}>Save New Password</button>
      </div>

      {/* ---------- POPUP PASSWORD VERIFY ---------- */}
      {showPassPopup && (
        <div className="password-modal">
          <div className="modal-box">
            <h3>Verify Password</h3>

            <input
              type="password"
              placeholder="Enter your password"
              value={verifyPasswordInput}
              onChange={(e) => setVerifyPasswordInput(e.target.value)}
            />

            <button onClick={updateContactHandler}>Confirm Update</button>
            <button
              className="cancel-btn"
              onClick={() => setShowPassPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
