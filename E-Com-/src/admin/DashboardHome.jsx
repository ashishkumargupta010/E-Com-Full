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

  // ----------------- LOAD DASHBOARD DATA -----------------
  const loadData = async () => {
    try {
      // ✔ Correct backend route for admin orders
      const resOrders = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await resOrders.json();

      // ✔ Correct backend route for admin users
      const resUsers = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await resUsers.json();

      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(usersData)) setUsers(usersData);
    } catch (err) {
      console.log("Dashboard Load Error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ----------------- STATS GENERATION -----------------

  const getOrdersThisWeek = () => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    return orders.filter((o) => new Date(o.createdAt) >= weekAgo).length;
  };

  const getActiveCustomers = () => {
    const unique = new Set(orders.map((o) => o.userId));
    return unique.size;
  };

  const getRevenue = () => {
    return orders
      .filter((o) => o.status === "Delivered" || o.status === "Refund Completed")
      .reduce((sum, o) => sum + (o.total || 0), 0);
  };

  // WEEKLY TREND (Sun → Sat)
  const getWeeklyChartData = () => {
    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);

    orders.forEach((o) => {
      const d = new Date(o.createdAt).getDay();
      counts[d]++;
    });

    return week.map((day, i) => ({
      name: day,
      orders: counts[i],
    }));
  };

  // Customer Types (New, Returning, VIP)
  const getCustomerTypes = () => {
    let vip = 0,
      returning = 0,
      newbie = 0;

    users.forEach((u) => {
      const spent =
        u.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

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

  const COLORS = ["#ff8fa3", "#ffc2d1", "#ffe5ec"];

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Theme Style
  const themeStyle = {
    background: darkMode ? "#1a1a1a" : "#fff",
    color: darkMode ? "#ffe4ec" : "#d63384",
    transition: "all 0.5s ease",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        ...themeStyle,
        padding: "2rem",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: darkMode ? "#ffb6c1" : "#d63384",
          }}
        >
          Dashboard Overview
        </h1>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          style={{
            background: darkMode ? "#d63384" : "#ffe4ec",
            color: darkMode ? "white" : "#d63384",
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
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        {[
          { title: "Orders This Week", value: getOrdersThisWeek() },
          { title: "Active Customers", value: getActiveCustomers() },
          {
            title: "Revenue",
            value: `₹${getRevenue().toLocaleString()}`,
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            style={{
              background: darkMode ? "#2a2a2a" : "#ffe4ec",
              flex: 1,
              textAlign: "center",
              padding: "1.5rem",
              borderRadius: "14px",
            }}
          >
            <h3 style={{ color: darkMode ? "#ff8fa3" : "#d63384" }}>
              {card.title}
            </h3>
            <p
              style={{
                fontSize: "1.7rem",
                fontWeight: "800",
                marginTop: "10px",
              }}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginTop: "3rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: darkMode ? "#2a2a2a" : "#fff0f5",
            padding: "1.5rem",
            borderRadius: "15px",
          }}
        >
          <h3 style={{ color: darkMode ? "#ff8fa3" : "#d63384" }}>
            📦 Orders Trend
          </h3>

          <BarChart width={500} height={250} data={getWeeklyChartData()}>
            <XAxis stroke={darkMode ? "#ffe4ec" : "#000"} dataKey="name" />
            <YAxis stroke={darkMode ? "#ffe4ec" : "#000"} />
            <Tooltip />
            <Bar
              dataKey="orders"
              fill={darkMode ? "#ff8fa3" : "#d63384"}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: darkMode ? "#2a2a2a" : "#fff0f5",
            padding: "1.5rem",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: darkMode ? "#ff8fa3" : "#d63384" }}>
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
              {COLORS.map((c, i) => (
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
