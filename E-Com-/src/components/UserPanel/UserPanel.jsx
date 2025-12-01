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
    return <h2 style={{ padding: "30px" }}>Please login to access account.</h2>;
  }

  return (
    <div className="flipkart-panel">
      <aside className="fk-sidebar">
        <div className="fk-profile-box">
          <div className="fk-profile-avatar">
            {user?.name?.[0] || "U"}
          </div>

          <div>
            <h4>{user.name}</h4>
            <span>{user.email || ""}</span>
            {user.phone && <span>📞 {user.phone}</span>}
          </div>
        </div>

        <div className="fk-menu">
          <p className="fk-menu-title">MY ORDERS</p>
          <NavLink to="/userpanel/orders" className="fk-link">
            Orders
          </NavLink>

          <p className="fk-menu-title">ACCOUNT SETTINGS</p>
          <NavLink to="/userpanel/profile" className="fk-link">
            Profile Information
          </NavLink>

          <NavLink to="/userpanel/address" className="fk-link">
            Manage Addresses
          </NavLink>

          <p className="fk-menu-title">PAYMENTS</p>
          <div className="fk-link muted">Saved UPI</div>
        </div>

        <button className="fk-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="fk-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserPanel;
