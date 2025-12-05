import React, { useState } from "react";

const CustomerListModal = ({ type, users, onClose, onSelect }) => {
  const [search, setSearch] = useState("");

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  // Filter new / all customers
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

    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");

    link.href = encoded;
    link.download = `customers_${now.getDate()}-${month + 1}-${year}.csv`;
    link.click();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 4000,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "22px",
          width: "470px",
          borderRadius: "14px",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* MODAL TITLE */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "12px",
            color: "#0d47a1",
          }}
        >
          {type === "new" ? "New Customers" : "All Customers"}
        </h3>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: "10px",
            border: "1px solid #d0d8ff",
            background: "#f5f7ff",
            fontSize: "15px",
            marginBottom: "14px",
            outline: "none",
          }}
        />

        {/* EXPORT BUTTON */}
        <button
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "16px",
            background: "#0d47a1",
            border: "none",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            letterSpacing: "0.3px",
            transition: "0.25s",
          }}
          onClick={exportCSV}
        >
          📤 Export CSV
        </button>

        {/* CUSTOMER LIST */}
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No customers found.
          </p>
        )}

        {filtered.map((u, i) => (
          <div
            key={i}
            onClick={() => onSelect(u)}
            style={{
              padding: "14px",
              marginBottom: "12px",
              borderRadius: "12px",
              background: "#ffffff",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 6px 18px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 10px rgba(0,0,0,0.05)";
            }}
          >
            <p style={{ fontWeight: "600", fontSize: "15px" }}>{u.name}</p>

            <p style={{ color: "#444" }}>{u.emailOrPhone}</p>

            <small style={{ color: "#777" }}>
              Joined:{" "}
              {u.createdAt
                ? new Date(u.createdAt).toLocaleDateString()
                : "Unknown"}
            </small>
          </div>
        ))}

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px",
            background: "#0d47a1",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.25s",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerListModal;
