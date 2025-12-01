import "./dashboard.css";

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const address = JSON.parse(localStorage.getItem("address")) || [];

  return (
    <div className="dash-wrapper">
      <h2 className="dash-title">Welcome, {user?.name} 👋</h2>

      <div className="dash-grid">
        
        <div className="dash-card">
          <h3>My Profile</h3>
          <p>Email: {user?.email}</p>
          <p>Phone: {user?.phone}</p>
        </div>

        <div className="dash-card">
          <h3>My Orders</h3>
          <p>Total Orders: {orders.length}</p>
        </div>

        <div className="dash-card">
          <h3>Saved Addresses</h3>
          <p>{address.length} Address Saved</p>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
