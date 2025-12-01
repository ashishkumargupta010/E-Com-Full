import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, refreshCart } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const coupons = JSON.parse(localStorage.getItem("coupons")) || [];

  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line
  }, []);

  const totalAmount = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const match = coupons.find((c) => c.code === code);
    if (!match) {
      setMessage("❌ Invalid coupon code");
      return;
    }
    if (totalAmount < match.minAmount) {
      setMessage(`⚠ Min order ₹${match.minAmount} required`);
      return;
    }
    const discountValue = (totalAmount * match.discount) / 100;
    setDiscount(discountValue);
    setMessage(`🎉 ${code} applied! Saved ₹${discountValue}`);
    localStorage.setItem("cartDiscount", discountValue);
    localStorage.setItem("appliedCoupon", code);
  };

  const finalPrice = (totalAmount - discount).toFixed(2);

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛍 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty 💗</p>
      ) : (
        <div className="cart-container">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.product?.image} alt={item.product?.name} />
              <div className="item-info">
                <h3>{item.product?.name}</h3>
                <p>Size: {item.size}</p>
                <p>Price: ₹{item.product?.price}</p>

                <p className="qty-row">
                  Qty:
                  <button className="qty-btn" disabled={item.quantity === 1} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </p>

                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}

          <h2 className="cart-total">Total: ₹{totalAmount}</h2>

          <div className="coupon-section">
            <input type="text" placeholder="Enter coupon" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
            <button onClick={applyCoupon}>Apply</button>
          </div>

          {message && <p className="discount-text">{message}</p>}
          {discount > 0 && <h2 className="final-price">Final: ₹{finalPrice}</h2>}

          <button className="checkout-btn" onClick={() => navigate("/checkout")}>Proceed to Checkout →</button>
        </div>
      )}
    </div>
  );
}
