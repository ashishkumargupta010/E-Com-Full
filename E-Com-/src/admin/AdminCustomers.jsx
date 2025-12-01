import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import CustomerListModal from "./CustomerListModal";
import CustomerDetailsModal from "./CustomerDetailsModal";

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [newCustomers, setNewCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [showList, setShowList] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  // ----------------------- LOAD CUSTOMERS -------------------------
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(userData);
    setTotalCustomers(userData.length);

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const newCus = userData.filter((u) => {
      if (!u.createdAt) return false;
      const d = new Date(u.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;

    setNewCustomers(newCus);
  }, []);

  // ----------------------- BAR GRAPH -------------------------
  useEffect(() => {
    if (users.length === 0) return;

    const ctx = document.getElementById("customerChart");
    if (!ctx) return;

    const monthData = new Array(12).fill(0);

    users.forEach((u) => {
      if (u.createdAt) {
        const d = new Date(u.createdAt);
        monthData[d.getMonth()]++;
      }
    });

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [
          {
            label: "Customers Joined",
            data: monthData,
            backgroundColor: "#ff69b4",
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }, [users]);

  // ----------------------- TOP SPENDERS -------------------------
  const topSpenders = users
    .map((u) => {
      const totalSpent = !u.orders
        ? 0
        : u.orders.reduce(
            (sum, o) => sum + (o.finalPrice || o.totalAmount || o.total || 0),
            0
          );

      return {
        name: u.name,
        emailOrPhone: u.emailOrPhone,
        spent: totalSpent,
      };
    })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 10);

  // ----------------------- EXPORT CSV -------------------------
  const exportCSV = () => {
    let csv = "Name,Email/Phone,Joined Date,Total Orders,Total Spent\n";

    users.forEach((u) => {
      const totalSpent = u.orders
        ? u.orders.reduce(
            (sum, o) => sum + (o.finalPrice || o.totalAmount || o.total || 0),
            0
          )
        : 0;

      csv += `${u.name},${u.emailOrPhone},${u.createdAt || "-"},${u.orders?.length || 0},${totalSpent}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "customers_report.csv";
    a.click();
  };

  // ----------------------- SEARCH FILTER -------------------------
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.emailOrPhone.includes(search)
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins" }}>
      <h2 style={{ textAlign: "center" }}>👥 All Customers</h2>
      <p
        style={{
          textAlign: "center",
          fontsize: "15px",
          color: "#555",
          marginTop: "-5px",
          marginBottom: "20px",
        }}
      >
      Monitor and analyze customer activity.</p>

      {/* Search + Export */}
      <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "60%",
            border: "1px solid #ffb6d9",
            borderRadius: "8px",
          }}
        />

        <button
          onClick={exportCSV}
          style={{
            background: "#ff2d78",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          📤 Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div
          onClick={() => setShowList("new")}
          style={{
            background: "#ffe4ec",
            padding: "1rem",
            borderRadius: "10px",
            flex: 1,
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(255,182,193,0.4)",
          }}
        >
          <h3>New Customers</h3>
          <p style={{ fontSize: "24px", fontWeight: "700" }}>{newCustomers}</p>
          <p style={{ textDecoration: "underline", color: "#c2185b" }}>View List</p>
        </div>

        <div
          onClick={() => setShowList("all")}
          style={{
            background: "#ffe4ec",
            padding: "1rem",
            borderRadius: "10px",
            flex: 1,
            cursor: "pointer",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(255,182,193,0.4)",
          }}
        >
          <h3>Total Customers</h3>
          <p style={{ fontSize: "24px", fontWeight: "700" }}>{totalCustomers}</p>
          <p style={{ textDecoration: "underline", color: "#c2185b" }}>View All</p>
        </div>
      </div>

      {/* Customer Growth Chart */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 14px rgba(0,0,0,0.1)",
          border: "1px solid #ffddea",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "10px", color: "#c2185b" }}>
          📅 Monthly Customer Growth
        </h3>

        <canvas id="customerChart" height="120"></canvas>
      </div>

      {/* ---------------- SPENDING LEADERBOARD ---------------- */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 14px rgba(0,0,0,0.1)",
          border: "1px solid #ffddea",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#c2185b" }}>
          💰 Top Spending Customers
        </h3>

        {/* Premium aligned table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fff0f6" }}>
              <th style={{ padding: "10px", width: "80px", textAlign: "center" }}>Rank</th>
              <th style={{ padding: "10px", width: "60%", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "10px", width: "20%", textAlign: "right" }}>Total Spent</th>
            </tr>
          </thead>

          <tbody>
            {topSpenders.map((u, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                {/* Rank */}
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  #{i + 1}
                </td>

                {/* Customer */}
                <td
                  style={{
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: "1.3",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
                    {u.name}
                  </span>
                  <small style={{ color: "#777" }}>{u.emailOrPhone}</small>
                </td>

                {/* Total Spent */}
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "700",
                    fontSize: "16px",
                    color: "#d6006c",
                    textAlign: "right",
                  }}
                >
                  ₹{u.spent}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showList && (
        <CustomerListModal
          type={showList}
          users={filteredUsers}
          onClose={() => setShowList(false)}
          onSelect={(u) => setShowDetails(u)}
        />
      )}

      {showDetails && (
        <CustomerDetailsModal
          user={showDetails}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
};

export default AdminCustomers;
