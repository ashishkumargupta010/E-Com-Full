import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { motion } from "framer-motion";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  let appliedCoupon = localStorage.getItem("appliedCoupon");
  let discountAmount = Number(localStorage.getItem("cartDiscount") || 0);

  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  // Load Cart
  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/cart/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Cart Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const finalTotal = subtotal - discountAmount;

  // Continue
  const goToPayment = () => {
    localStorage.setItem("checkoutTotal", finalTotal);
    navigate("/review");
  };

  if (loading)
    return (
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
        Loading...
      </motion.h2>
    );

  return (
    <motion.div className="checkout-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="checkout-wrapper">
        <motion.h1 className="checkout-title" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          Checkout
        </motion.h1>

        <motion.div className="checkout-box" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h2>Your Items</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <motion.div key={item.id} className="checkout-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <b>{item.product.name}</b>
                <span>Qty: {item.quantity}</span>
                <span>₹ {item.product.price * item.quantity}</span>
              </motion.div>
            ))
          )}

          <div className="price-section">
            <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>

            {discountAmount > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  color: "#0b8a3b",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Coupon ({appliedCoupon})</span>
                <span>- ₹ {discountAmount.toFixed(2)}</span>
              </motion.p>
            )}

            <h3>Total: ₹ {finalTotal.toFixed(2)}</h3>
          </div>

          {discountAmount === 0 && (
            <p style={{ color: "gray", fontSize: "14px", marginTop: "8px" }}>
              Apply coupon on cart page.
            </p>
          )}

          <motion.button className="primary-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={goToPayment}>
            Proceed To Payment →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Checkout;
