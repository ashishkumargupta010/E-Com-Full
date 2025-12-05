import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Moon, Sun } from "lucide-react";

const API = "http://localhost:5000/api";

const DashboardHome = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("adminToken");

  const BLUE = "#007bff";
  const BLUE_DARK = "#0056d6";
  const BLUE_LIGHT = "#e4f0ff";

  const PIE_COLORS = ["#007bff", "#3399ff", "#66b2ff"];

  const loadData = async () => {
    try {
      const resOrders = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await resOrders.json();

      const resUsers = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await resUsers.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.log("Dashboard Load Error:", err);
    }
  };

  useEffect(() => {
    loadData(); // First load

    // 🔥 PULLING / AUTO REFRESH EVERY 5 SECONDS
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  const getOrdersThisWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return orders.filter((o) => new Date(o.createdAt) >= weekAgo).length;
  };

  const getActiveCustomers = () => {
    return new Set(orders.map((o) => o.userId)).size;
  };

  const getRevenue = () => {
    return orders
      .filter((o) => o.status === "Delivered" || o.status === "Refund Completed")
      .reduce((sum, o) => sum + (o.total || 0), 0);
  };

  const getWeeklyChartData = () => {
    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);

    orders.forEach((o) => counts[new Date(o.createdAt).getDay()]++);

    return week.map((day, i) => ({ name: day, orders: counts[i] }));
  };

  const getCustomerTypes = () => {
    let vip = 0,
      returning = 0,
      newbie = 0;

    users.forEach((u) => {
      const spent = u.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      if (spent > 5000) vip++;
      else if ((u.orders?.length || 0) >= 2) returning++;
      else newbie++;
    });

    return [
      { name: "New", value: newbie },
      { name: "Returning", value: returning },
      { name: "VIP", value: vip },
    ];
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const themeStyle = {
    background: darkMode ? "#1a1a1a" : "#ffffff",
    color: darkMode ? "#cce0ff" : "#003f7f",
    transition: "all 0.5s ease",
    padding: "2rem",
    minHeight: "calc(100vh - 70px)",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={themeStyle}>
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "1.4rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: darkMode ? "#66b2ff" : "#0056d6",
          }}
        >
          Dashboard Overview
        </h1>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.07 }}
          style={{
            background: darkMode ? BLUE_DARK : BLUE_LIGHT,
            color: darkMode ? "white" : BLUE_DARK,
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </motion.button>
      </div>

      {/* TOP CARDS */}
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {[
          { title: "Orders This Week", value: getOrdersThisWeek() },
          { title: "Active Customers", value: getActiveCustomers() },
          { title: "Revenue", value: `₹${getRevenue().toLocaleString()}` },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            style={{
              background: darkMode ? "#2a2a2a" : "#eef5ff",
              flex: 1,
              padding: "1.5rem",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: darkMode ? "#66b2ff" : "#0056d6" }}>{card.title}</h3>
            <p style={{ fontSize: "1.8rem", fontWeight: "800" }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginTop: "2.4rem",
        }}
      >
        {/* BAR CHART */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: darkMode ? "#2a2a2a" : "#eef5ff",
            padding: "1.5rem",
            borderRadius: "15px",
          }}
        >
          <h3 style={{ color: darkMode ? "#66b2ff" : "#0056d6" }}>
            📦 Orders Trend
          </h3>

          <BarChart width={500} height={250} data={getWeeklyChartData()}>
            <XAxis stroke={darkMode ? "#cce0ff" : "#000"} dataKey="name" />
            <YAxis stroke={darkMode ? "#cce0ff" : "#000"} />
            <Tooltip />
            <Bar dataKey="orders" fill={BLUE} radius={[10, 10, 0, 0]} />
          </BarChart>
        </motion.div>

        {/* PIE CHART */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: darkMode ? "#2a2a2a" : "#eef5ff",
            padding: "1.5rem",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: darkMode ? "#66b2ff" : "#0056d6" }}>
            👥 Customer Types
          </h3>

          <PieChart width={300} height={250}>
            <Pie
              data={getCustomerTypes()}
              outerRadius={80}
              dataKey="value"
              cx="50%"
              cy="50%"
              label
            >
              {PIE_COLORS.map((c, i) => (
                <Cell key={i} fill={c} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
