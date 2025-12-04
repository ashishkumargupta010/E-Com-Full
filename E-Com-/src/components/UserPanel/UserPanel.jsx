import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./userpanel.css";

const UserPanel = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  if (!user) {
    return (
      <h2 style={{ padding: "30px", textAlign: "center", color: "#ff2d78" }}>
        Please login to access account.
      </h2>
    );
  }

  return (
    <div className="blush-panel">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="blush-sidebar">

        <div className="profile-card">
          <div className="avatar-circle">{user?.name?.[0] || "U"}</div>

          <div>
            <h4>{user.name}</h4>
            <span>{user.email}</span>
            {user.phone && <span>📞 {user.phone}</span>}
          </div>
        </div>

        <div className="panel-links">
          <p className="panel-title">MY ORDERS</p>
          <NavLink to="/userpanel/orders" className="panel-link">
            Orders
          </NavLink>

          <p className="panel-title">ACCOUNT SETTINGS</p>
          <NavLink to="/userpanel/profile" className="panel-link">
            Profile Information
          </NavLink>

          <NavLink to="/userpanel/address" className="panel-link">
            Manage Address
          </NavLink>

          <p className="panel-title">PAYMENTS</p>
          <div className="panel-link disabled">Saved UPI</div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* ---------------- CONTENT ---------------- */}
      <main className="blush-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserPanel;
