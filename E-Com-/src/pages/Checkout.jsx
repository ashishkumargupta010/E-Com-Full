import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";


const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountInput, setDiscountInput] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API = "http://localhost:5000/api";

  // 🟢 Load Cart Items
  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/cart/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Cart API Failed:", await res.text());
        return;
      }

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

  // 🧮 Price Calculation
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal - discountAmount;

  // 🟣 Apply Discount Code
  const applyCoupon = () => {
    if (discountInput === "DISCOUNT10") {
      setDiscount(10);
      alert("10% Discount Applied!");
    } else if (discountInput === "DISCOUNT20") {
      setDiscount(20);
      alert("20% Discount Applied!");
    } else {
      alert("Invalid Coupon Code");
      setDiscount(0);
    }
  };

  // 👉 Navigate to Review Page
  const goToPayment = () => {
    localStorage.setItem("checkoutTotal", finalTotal);
    navigate("/review");
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-box">

          {/* CART ITEMS */}
          <h2>Your Items</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="checkout-item">
                <b>{item.product.name}</b>
                <span>Qty: {item.quantity}</span>
                <span>₹ {item.product.price * item.quantity}</span>
              </div>
            ))
          )}

          {/* PRICE CALCULATION */}
          <div className="price-section">
            <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
            <p>Discount ({discount}%): - ₹ {discountAmount.toFixed(2)}</p>

            <h3>Total: ₹ {finalTotal.toFixed(2)}</h3>
          </div>

          {/* COUPON APPLY */}
          <div className="coupon-box">
            <input
              type="text"
              placeholder="Enter Discount Code"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>

          {/* PROCEED BUTTON */}
          <button className="primary-btn" onClick={goToPayment}>
            Proceed To Payment
          </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
