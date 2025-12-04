import "./dashboard.css";

const DashboardHome = () => {
  // Correct source of logged-in user
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // Safe array load
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const addresses = JSON.parse(localStorage.getItem("address")) || [];

  return (
    <div className="dash-wrapper">
      <h2 className="dash-title">Welcome, {user?.name} 👋</h2>

      <div className="dash-grid">

        {/* PROFILE CARD */}
        <div className="dash-card">
          <h3>My Profile</h3>
          <p><strong>Email:</strong> {user?.email || "Not Provided"}</p>
          <p><strong>Phone:</strong> {user?.phone || "Not Provided"}</p>
        </div>

        {/* ORDERS CARD */}
        <div className="dash-card">
          <h3>My Orders</h3>
          <p>Total Orders: {orders.length}</p>
        </div>

        {/* ADDRESS CARD */}
        <div className="dash-card">
          <h3>Saved Address</h3>
          <p>{addresses.length} Saved</p>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
