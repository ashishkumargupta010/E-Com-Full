import React, { useState, useEffect } from "react";
import "./AdminCoupons.css";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    minAmount: "",
  });

  // Load coupons
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("coupons")) || [];
    setCoupons(saved);
  }, []);

  const saveCoupons = (updated) => {
    setCoupons(updated);
    localStorage.setItem("coupons", JSON.stringify(updated));
  };

  const addCoupon = () => {
    if (!form.code || !form.discount) {
      alert("Enter coupon code and discount!");
      return;
    }

    const newCoupon = {
      code: form.code.toUpperCase(),
      discount: Number(form.discount),
      minAmount: Number(form.minAmount || 0),
    };

    saveCoupons([...coupons, newCoupon]);

    setForm({ code: "", discount: "", minAmount: "" });
  };

  const deleteCoupon = (index) => {
    const updated = coupons.filter((_, i) => i !== index);
    saveCoupons(updated);
  };

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
        {coupons.map((c, i) => (
          <li key={i}>
            <b>{c.code}</b> — {c.discount}% OFF  
            {c.minAmount > 0 && <span>(Min ₹{c.minAmount})</span>}
            <button onClick={() => deleteCoupon(i)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCoupons;
