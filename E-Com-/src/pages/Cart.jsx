import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, refreshCart } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [activeCoupons, setActiveCoupons] = useState([]);

  const API = "http://localhost:5000/api";

  // ----------------------------------------------------------------
  // LOAD ACTIVE COUPONS FROM BACKEND
  // ----------------------------------------------------------------
  const loadActiveCoupons = async () => {
    try {
      const res = await fetch(`${API}/coupons/all`);
      const data = await res.json();
      setActiveCoupons(data || []);
    } catch {
      console.log("Error loading coupons");
    }
  };

  // ----------------------------------------------------------------
  // AUTO RESTORE BUT ALSO AUTO VALIDATE COUPON
  // ----------------------------------------------------------------
  const autoValidateCoupon = async (savedCoupon, savedDiscount) => {
    if (!savedCoupon) return;

    try {
      const res = await fetch(`${API}/coupons/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: savedCoupon,
          amount: calculateTotal(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ❌ Invalid or deleted coupon → auto remove
        removeCoupon();
        return;
      }

      // Still valid
      setDiscount(data.discountAmount);
      setMessage(`🎉 ${savedCoupon} applied! Saved ₹${data.discountAmount}`);
    } catch {
      removeCoupon();
    }
  };

  // ----------------------------------------------------------------
  // Load cart + Validate coupon on page load
  // ----------------------------------------------------------------
  useEffect(() => {
    refreshCart();
    loadActiveCoupons();

    const savedCoupon = localStorage.getItem("appliedCoupon");
    const savedDiscount = Number(localStorage.getItem("cartDiscount") || 0);

    if (savedCoupon) setCouponInput(savedCoupon);

    setTimeout(() => {
      autoValidateCoupon(savedCoupon, savedDiscount);
    }, 300);
  }, []);

  // ----------------------------------------------------------------
  // CALCULATE TOTAL
  // ----------------------------------------------------------------
  const calculateTotal = () =>
    cart.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    );

  const totalAmount = calculateTotal();

  // ----------------------------------------------------------------
  // APPLY COUPON
  // ----------------------------------------------------------------
  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return setMessage("❌ Enter coupon code");

    try {
      const res = await fetch(`${API}/coupons/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, amount: totalAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        removeCoupon();
        return setMessage("❌ " + data.message);
      }

      setDiscount(data.discountAmount);
      setMessage(`🎉 ${code} applied! Saved ₹${data.discountAmount}`);

      localStorage.setItem("appliedCoupon", code);
      localStorage.setItem("cartDiscount", data.discountAmount);
    } catch {
      removeCoupon();
      setMessage("❌ Server Error");
    }
  };

  // ----------------------------------------------------------------
  // REMOVE COUPON BUTTON
  // ----------------------------------------------------------------
  const removeCoupon = () => {
    setDiscount(0);
    setCouponInput("");
    setMessage("Coupon removed ❌");

    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("cartDiscount");
  };

  const finalPrice = (totalAmount - discount).toFixed(2);

  return (
    <motion.div
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="cart-title">🛍 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty 💗</p>
      ) : (
        <div className="cart-container">
          {/* CART ITEMS */}
          {cart.map((item) => (
            <motion.div
              key={item.id}
              className="cart-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.img
                src={item.product?.image}
                alt={item.product?.name}
                whileHover={{ scale: 1.05 }}
              />

              <div className="item-info">
                <h3>{item.product?.name}</h3>
                <p>Size: {item.size}</p>
                <p>Price: ₹{item.product?.price}</p>

                <p className="qty-row">
                  Qty:
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    className="qty-btn"
                    disabled={item.quantity === 1}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </motion.button>

                  <span className="qty-value">{item.quantity}</span>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </motion.button>
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* TOTAL */}
          <motion.h2 className="cart-total">{`Total: ₹${totalAmount}`}</motion.h2>

          {/* COUPON */}
          <div className="coupon-section">
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="text"
              placeholder="Enter coupon"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <motion.button whileHover={{ scale: 1.05 }} onClick={applyCoupon}>
              Apply
            </motion.button>

            {discount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="remove-coupon-btn"
                onClick={removeCoupon}
              >
                ❌ Remove
              </motion.button>
            )}
          </div>

          {/* ACTIVE COUPONS LIST */}
          <div className="active-coupons-box">
            <h4>Available Coupons:</h4>
            {activeCoupons.length === 0 ? (
              <p>No active coupons</p>
            ) : (
              activeCoupons.map((c) => (
                <p key={c.id}>
                  <b>{c.code}</b> — {c.discount}% OFF (Min ₹{c.minAmount})
                </p>
              ))
            )}
          </div>

          {/* MESSAGES */}
          {message && <p className="discount-text">{message}</p>}

          {/* FINAL PRICE */}
          {discount > 0 && (
            <motion.h2 className="final-price">
              Final: ₹{finalPrice}
            </motion.h2>
          )}

          {/* CHECKOUT */}
          <motion.button
            className="checkout-btn"
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout →
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
