import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import CustomerListModal from "./CustomerListModal";
import CustomerDetailsModal from "./CustomerDetailsModal";

const API = "http://localhost:5000/api";

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [newCustomers, setNewCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [showList, setShowList] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("adminToken");

  // ---- Chart reference --------
  const chartRef = useRef(null);

  // -----------------------------------
  // LOAD CUSTOMERS FROM BACKEND
  // -----------------------------------
  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data);
      setTotalCustomers(data.length);

      // Check new customers this month
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      const newCus = data.filter((u) => {
        const d = new Date(u.createdAt);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;

      setNewCustomers(newCus);
    } catch (err) {
      console.log("Error loading users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // -----------------------------------
  // CUSTOMER GROWTH CHART (FIXED)
  // -----------------------------------
  useEffect(() => {
    if (users.length === 0) return;

    const ctx = document.getElementById("customerChart");
    if (!ctx) return;

    // FIX — Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const monthData = new Array(12).fill(0);
    users.forEach((u) => {
      const d = new Date(u.createdAt);
      monthData[d.getMonth()]++;
    });

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ],
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

    // Cleanup when leaving component
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [users]);

  // -----------------------------------
  // TOP SPENDERS
  // -----------------------------------
  const topSpenders = users
    .map((u) => {
      const spent = u.orders?.reduce((s, o) => s + o.total, 0) || 0;

      return {
        name: u.name,
        emailOrPhone: u.email,
        spent,
      };
    })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 10);

  // -----------------------------------
  // EXPORT CSV
  // -----------------------------------
  const exportCSV = () => {
    let csv = "Name,Email,Joined,Total Orders,Total Spent\n";

    users.forEach((u) => {
      const spent = u.orders?.reduce((s, o) => s + o.total, 0) || 0;

      csv += `${u.name},${u.email},${u.createdAt},${u.orders?.length || 0},${spent}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "customers_report.csv";
    a.click();
  };

  // -----------------------------------
  // SEARCH FILTER
  // -----------------------------------
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins" }}>
      <h2 style={{ textAlign: "center" }}>👥 All Customers</h2>

      {/* SEARCH + EXPORT */}
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

      {/* SUMMARY CARDS */}
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
          }}
        >
          <h3>New Customers</h3>
          <p style={{ fontSize: "24px", fontWeight: "700" }}>{newCustomers}</p>
          <p style={{ color: "#c2185b", textDecoration: "underline" }}>View List</p>
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
          }}
        >
          <h3>Total Customers</h3>
          <p style={{ fontSize: "24px", fontWeight: "700" }}>{totalCustomers}</p>
          <p style={{ color: "#c2185b", textDecoration: "underline" }}>View All</p>
        </div>
      </div>

      {/* CHART */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 14px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          📅 Monthly Customer Growth
        </h3>

        <canvas id="customerChart" height="120"></canvas>
      </div>

      {/* TOP SPENDERS */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 14px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
          💰 Top Spending Customers
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fff0f6" }}>
              <th style={{ padding: "10px" }}>Rank</th>
              <th style={{ padding: "10px" }}>Customer</th>
              <th style={{ padding: "10px", textAlign: "right" }}>Total Spent</th>
            </tr>
          </thead>

          <tbody>
            {topSpenders.map((u, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px", textAlign: "center" }}>#{i + 1}</td>

                <td style={{ padding: "10px" }}>
                  <b>{u.name}</b>
                  <br />
                  <small style={{ color: "#888" }}>{u.emailOrPhone}</small>
                </td>

                <td
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    fontWeight: "700",
                  }}
                >
                  ₹{u.spent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
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
}
