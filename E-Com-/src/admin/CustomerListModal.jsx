import React, { useState } from "react";

const CustomerListModal = ({ type, users, onClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  // Filter list depending on type
  let list =
    type === "new"
      ? users.filter((u) => {
          if (!u.createdAt) return false;
          const d = new Date(u.createdAt);
          return d.getMonth() === month && d.getFullYear() === year;
        })
      : users;

  // Search filter
  const filtered = list.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.emailOrPhone?.toLowerCase().includes(q)
    );
  });

  // Export CSV
  const exportCSV = () => {
    if (filtered.length === 0) return alert("No customers to export!");

    const headers = ["Name", "Email/Phone", "Joined"];
    const rows = filtered.map((u) => [
      u.name,
      u.emailOrPhone,
      new Date(u.createdAt).toLocaleString(),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.href = encodedUri;
    link.download = `customers_export_${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}.csv`;

    link.click();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 4000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          width: "420px",
          borderRadius: "12px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>
          {type === "new" ? "New Customers" : "Total Customers"}
        </h3>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "12px",
          }}
        />

        {/* Export Button */}
        <button
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            background: "#ff69b4",
            border: "none",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={exportCSV}
        >
          📤 Export CSV
        </button>

        {/* Customer List */}
        {filtered.length === 0 && <p>No customers found.</p>}

        {filtered.map((u, i) => (
          <div
            key={i}
            onClick={() => onSelect(u)}
            style={{
              padding: "10px",
              margin: "8px 0",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <b>{u.name}</b>
            <br />
            <span>{u.emailOrPhone}</span>
            <br />
            <small>
              Joined:{" "}
              {u.createdAt
                ? new Date(u.createdAt).toLocaleDateString()
                : "Unknown"}
            </small>
          </div>
        ))}

        <button
          onClick={onClose}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "10px",
            background: "#ff4d6d",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerListModal;

