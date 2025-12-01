import { useState, useEffect } from "react";
import "./editprofile.css";

const EditProfile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [showPassPopup, setShowPassPopup] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // 🔥 Load user from backend
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loggedInUser"));
    if (stored) {
      setUser(stored);
      setName(stored.name);
      setPhone(stored.phone || "");
      setEmail(stored.email);
    }
  }, []);

  if (!user) return <h2 style={{ padding: "20px" }}>You are not logged in.</h2>;

  // ⭐ Save Name Backend
  const saveName = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      // update local
      const updated = { ...user, name };
      setUser(updated);
      localStorage.setItem("loggedInUser", JSON.stringify(updated));

      alert("Name Updated Successfully!");
    } catch (err) {
      alert("Server Error");
    }
  };

  // ⭐ Step 1 → Ask for password before email/phone update
  const askPassword = () => {
    if (email !== user.email || phone !== user.phone) {
      setShowPassPopup(true);
    }
  };

  // ⭐ Step 2 → Verify Password + Update Email/Phone
  const verifyPassword = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/update-contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: passwordInput,
          email,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      const updated = { ...user, email, phone };
      setUser(updated);
      localStorage.setItem("loggedInUser", JSON.stringify(updated));

      alert("Contact Details Updated!");
      setShowPassPopup(false);
      setPasswordInput("");
    } catch (err) {
      alert("Server Error");
    }
  };

  return (
    <div className="profile-wrapper">
      <h2>Edit Profile</h2>

      <div className="profile-form">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={saveName}>Save Name</button>

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />

        <button onClick={askPassword}>Update Contact</button>
      </div>

      {showPassPopup && (
        <div className="password-modal">
          <div className="modal-box">
            <h3>Enter Password</h3>
            <input
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button onClick={verifyPassword}>Confirm</button>
            <button className="cancel-btn" onClick={() => setShowPassPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
