import React, { useState, useEffect } from "react";
import "./AdminCoupons.css";

const API = "http://localhost:5000/api";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    minAmount: "",
  });

  const token = localStorage.getItem("adminToken");

  // Load coupons from Backend
  const loadCoupons = async () => {
    try {
      const res = await fetch(`${API}/admin/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.log("Error loading coupons:", err);
    }
  };

  // Add coupon
  const addCoupon = async () => {
    if (!form.code || !form.discount) {
      alert("Enter coupon code and discount!");
      return;
    }

    try {
      const res = await fetch(`${API}/admin/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: form.code,
          discount: Number(form.discount),
          minAmount: Number(form.minAmount || 0),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      loadCoupons();
      setForm({ code: "", discount: "", minAmount: "" });

    } catch (err) {
      console.log("Error adding coupon:", err);
    }
  };

  // Delete coupon
  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;

    try {
      const res = await fetch(`${API}/admin/coupons/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }

      loadCoupons();

    } catch (err) {
      console.log("Error deleting coupon:", err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  return (
    <div className="admin-coupon-box">
      <h2>🎟️ Manage Coupons</h2>

      {/* Add Coupon */}
      <div className="add-coupon-form">
        <input
          placeholder="Coupon Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <input
          type="number"
          placeholder="Discount %"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Amount (Optional)"
          value={form.minAmount}
          onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
        />

        <button onClick={addCoupon}>Add Coupon</button>
      </div>

      <h3>Active Coupons</h3>
      <ul>
        {coupons.map((c) => (
          <li key={c.id}>
            <b>{c.code}</b> — {c.discount}% OFF  
            {c.minAmount > 0 && <span>(Min ₹{c.minAmount})</span>}
            <button onClick={() => deleteCoupon(c.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCoupons;
