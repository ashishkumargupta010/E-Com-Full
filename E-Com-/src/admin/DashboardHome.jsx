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

const DashboardHome = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // ---------- Fetch Data ----------
  useEffect(() => {
    const adminOrders = JSON.parse(localStorage.getItem("adminOrders")) || [];
    const userList = JSON.parse(localStorage.getItem("users")) || [];

    setOrders(adminOrders);
    setUsers(userList);
  }, []);

  // ---------- 1. Orders This Week ----------
  const getOrdersThisWeek = () => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    return orders.filter((o) => new Date(o.date) >= weekAgo).length;
  };

  // ---------- 2. Active Customers ----------
  const getActiveCustomers = () => {
    const unique = new Set(orders.map((o) => o.userId));
    return unique.size;
  };

  // ---------- 3. Revenue ----------
  const getRevenue = () => {
    return orders
      .filter((o) => o.status === "Delivered" || o.status === "Refund Completed")
      .reduce((sum, o) => sum + (o.total || 0), 0);
  };

  // ---------- 4. Orders Trend Mon–Sun ----------
  const getWeeklyChartData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = new Array(7).fill(0);

    orders.forEach((o) => {
      const d = new Date(o.date).getDay();
      data[d] += 1;
    });

    return days.map((day, i) => ({
      name: day,
      orders: data[i],
    }));
  };

  // ---------- 5. Customer Type Pie Chart ----------
  const getCustomerTypes = () => {
    let vip = 0,
      returning = 0,
      newbie = 0;

    users.forEach((u) => {
      const spent = u.totalSpent || 0;
      const orderCount = u.orders?.length || 0;

      if (spent > 5000) vip++;
      else if (orderCount >= 2) returning++;
      else newbie++;
    });

    return [
      { name: "New", value: newbie },
      { name: "Returning", value: returning },
      { name: "VIP", value: vip },
    ];
  };

  // ---------- Theme Toggle ----------
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const COLORS = ["#ff8fa3", "#ffc2d1", "#ffe5ec"];

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
      style={{ ...themeStyle, padding: "2rem", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: darkMode ? "#ffb6c1" : "#d63384",
          }}
        >
          Admin Dashboard
        </h1>

        <motion.button
          whileHover={{ scale: 1.1 }}
          style={{
            border: "none",
            background: darkMode ? "#d63384" : "#ffe4ec",
            color: darkMode ? "white" : "#d63384",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={toggleTheme}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </motion.button>
      </div>

      <p style={{ color: darkMode ? "#ccc" : "#555" }}>
        Welcome to your control center — your dashboard updates in real-time 💫
      </p>

      {/* Top Cards */}
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}>
        {[
          { title: "Orders This Week", value: getOrdersThisWeek() },
          { title: "Active Customers", value: getActiveCustomers() },
          { title: "Revenue", value: `₹${getRevenue().toLocaleString()}` },
        ].map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            style={{
              background: darkMode ? "#2a2a2a" : "#ffe4ec",
              flex: 1,
              padding: "1.5rem",
              borderRadius: "15px",
              boxShadow: darkMode
                ? "0 4px 15px rgba(255,182,193,0.2)"
                : "0 4px 15px rgba(255,182,193,0.4)",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: darkMode ? "#ff8fa3" : "#d63384" }}>
              {card.title}
            </h3>
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: darkMode ? "#ffe4ec" : "#d63384",
              }}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginTop: "3rem",
        }}
      >
        {/* Orders Trend */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
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
            <XAxis dataKey="name" stroke={darkMode ? "#ffe4ec" : "#000"} />
            <YAxis stroke={darkMode ? "#ffe4ec" : "#000"} />
            <Tooltip />
            <Bar
              dataKey="orders"
              fill={darkMode ? "#ff8fa3" : "#d63384"}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </motion.div>

        {/* Customer Type */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: darkMode ? "#2a2a2a" : "#fff0f5",
            padding: "1.5rem",
            borderRadius: "15px",
          }}
        >
          <h3 style={{ textAlign: "center", color: darkMode ? "#ff8fa3" : "#d63384" }}>
            👥 Customer Types
          </h3>

          <PieChart width={300} height={250}>
            <Pie
              data={getCustomerTypes()}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
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
