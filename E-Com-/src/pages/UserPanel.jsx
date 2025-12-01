import { useEffect, useState } from "react";
import "./UserPanel.css"; // optional styling

function UserPanel() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, profile, address, orders
  const [addresses, setAddresses] = useState([]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const savedAddress = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(savedAddress);
  }, []);

  /* ----------------------------------------------
     HANDLE PROFILE UPDATE
  ---------------------------------------------- */
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile updated!");
  };

  /* ----------------------------------------------
     ADDRESS CRUD FUNCTIONS
  ---------------------------------------------- */
  const addAddress = () => {
    const newAddress = {
      id: Date.now(),
      line1: "",
      city: "",
      state: "",
      pin: "",
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const updateAddress = (id, field, value) => {
    const updated = addresses.map((addr) =>
      addr.id === id ? { ...addr, [field]: value } : addr
    );
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  /* ----------------------------------------------
     LOGOUT
  ---------------------------------------------- */
  const logout = () => {
    localStorage.removeItem("user");
    alert("Logged Out!");
    window.location.href = "/"; // redirect home
  };

  if (!user) return <h2>Please Sign In First!</h2>;

  return (
    <div className="user-panel">
      <aside className="sidebar">
        <h3>User Panel</h3>
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("profile")}>Edit Profile</button>
        <button onClick={() => setActiveTab("address")}>Addresses</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="panel-content">
        {/* -------------------- Dashboard -------------------- */}
        {activeTab === "dashboard" && (
          <div>
            <h2>Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
          </div>
        )}

        {/* -------------------- Edit Profile -------------------- */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <h2>Edit Profile</h2>

            <label>Name:</label>
            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />

            <label>Email:</label>
            <input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />

            <label>Phone:</label>
            <input
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              required
            />

            <button type="submit">Save Changes</button>
          </form>
        )}

        {/* -------------------- Address Section -------------------- */}
        {activeTab === "address" && (
          <div className="address-section">
            <h2>Saved Addresses</h2>
            <button onClick={addAddress} className="add-btn">+ Add New Address</button>

            {addresses.length === 0 && <p>No address added yet.</p>}

            {addresses.map((addr) => (
              <div key={addr.id} className="address-card">
                <input
                  placeholder="Address Line"
                  value={addr.line1}
                  onChange={(e) =>
                    updateAddress(addr.id, "line1", e.target.value)
                  }
                />
                <input
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) =>
                    updateAddress(addr.id, "city", e.target.value)
                  }
                />
                <input
                  placeholder="State"
                  value={addr.state}
                  onChange={(e) =>
                    updateAddress(addr.id, "state", e.target.value)
                  }
                />
                <input
                  placeholder="PIN Code"
                  value={addr.pin}
                  onChange={(e) =>
                    updateAddress(addr.id, "pin", e.target.value)
                  }
                />

                <button onClick={() => deleteAddress(addr.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* -------------------- Orders -------------------- */}
        {activeTab === "orders" && (
          <div>
            <h2>Your Orders</h2>
            <p>No orders placed yet.</p>
            {/* If you store orders in localStorage, show them here */}
          </div>
        )}
      </main>
    </div>
  );
}

export default UserPanel;
