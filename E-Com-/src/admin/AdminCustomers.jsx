import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import CustomerListModal from "./CustomerListModal";
import CustomerDetailsModal from "./CustomerDetailsModal";

import "./AdminCustomers.css";

const API = "http://localhost:5000/api";

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [newCustomers, setNewCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [showList, setShowList] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("adminToken");
  const chartRef = useRef(null);

  // -----------------------------------
  // LOAD USERS
  // -----------------------------------
  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setUsers(data);
      setTotalCustomers(data.length);

      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      const newCus = data.filter((u) => {
        const d = new Date(u.createdAt);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;

      setNewCustomers(newCus);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // -----------------------------------
  // CHART (BLUE CORPORATE)
  // -----------------------------------
  useEffect(() => {
    if (users.length === 0) return;

    const ctx = document.getElementById("customerChart");
    if (!ctx) return;

    // Destroy old chart before drawing new
    if (chartRef.current) chartRef.current.destroy();

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
            backgroundColor: "rgba(0, 123, 255, 0.65)", // 🔵 BLUE FIXED
            borderColor: "#0056d6",
            borderWidth: 2,
            borderRadius: 10,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { 
          y: { 
            beginAtZero: true,
            ticks: { color: "#222" }
          },
          x: {
            ticks: { color: "#222" }
          }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, [users]);

  // -----------------------------------
  // TOP SPENDERS
  // -----------------------------------
  const topSpenders = users
    .map((u) => ({
      name: u.name,
      email: u.email,
      spent: u.orders?.reduce((s, o) => s + o.total, 0) || 0,
    }))
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
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
    <div className="admin-customers-wrapper">

      {/* PAGE TITLE */}
      <h2>👥 Customers Overview</h2>

      {/* SUMMARY CARDS */}
      <div className="customer-summary">

        <div className="customer-card" onClick={() => setShowList("new")}>
          <h3>New Customers</h3>
          <p className="customer-card-count">{newCustomers}</p>
          <p className="customer-card-view">View List</p>
        </div>

        <div className="customer-card" onClick={() => setShowList("all")}>
          <h3>Total Customers</h3>
          <p className="customer-card-count">{totalCustomers}</p>
          <p className="customer-card-view">View All</p>
        </div>

      </div>

      {/* CHART BOX */}
      <div className="customer-chart-box">
        <h3>📅 Monthly Customer Growth</h3>
        <canvas id="customerChart" height="120"></canvas>
      </div>

      {/* TOP SPENDERS */}
      <div className="customer-top-box">
        <h3>💰 Top Spending Customers</h3>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Customer</th>
              <th style={{ textAlign: "right" }}>Total Spent</th>
            </tr>
          </thead>

          <tbody>
            {topSpenders.map((u, i) => (
              <tr key={i}>
                <td>#{i + 1}</td>
                <td>
                  <b>{u.name}</b>
                  <br />
                  <small>{u.email}</small>
                </td>
                <td style={{ textAlign: "right", fontWeight: "700" }}>
                  ₹{u.spent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LIST MODAL */}
      {showList && (
        <CustomerListModal
          type={showList}
          users={filteredUsers}
          onClose={() => setShowList(false)}
          onSelect={(u) => setShowDetails(u)}
        />
      )}

      {/* DETAILS MODAL */}
      {showDetails && (
        <CustomerDetailsModal
          user={showDetails}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
}
