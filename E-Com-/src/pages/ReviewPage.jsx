import "./ReviewPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReviewPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const address = JSON.parse(localStorage.getItem("checkoutAddress"));

  // --------------------------------------------------
  // LOAD CART FROM BACKEND
  // --------------------------------------------------
  const loadCart = async () => {
    const res = await fetch("http://localhost:5000/api/cart/items", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setCartItems(data);

      const total = data.reduce(
        (sum, ci) => sum + (ci.product?.price || 0) * (ci.quantity || 1),
        0
      );

      setSubtotal(total);

      const savedDiscount = Number(localStorage.getItem("cartDiscount")) || 0;
      setDiscount(savedDiscount);

      setFinalPrice(total - savedDiscount);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const goToPayment = () => {
    localStorage.setItem("finalPrice", finalPrice);
    localStorage.setItem("cartTotal", subtotal);
    navigate("/payment");
  };

  if (!address) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 50 }}>
        No Address Selected  
        <br />
        <button onClick={() => navigate("/select-address")}>
          Select Address
        </button>
      </h2>
    );
  }

  return (
    <div className="review-wrapper">

      <h2 className="page-title">Review Your Order</h2>

      {/* Delivery Address */}
      <div className="review-box">
        <div className="box-title">Delivery Address</div>

        <div className="address-line">
          <div>
            <h4>{address.name}</h4>
            <p>{address.phone}</p>
            <p>{address.line1}</p>
            <p>{address.city} - {address.pincode}</p>
          </div>

          <button className="change-btn" onClick={() => navigate("/select-address")}>
            Change
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="review-box">
        <div className="box-title">Items</div>

        {cartItems.map((ci) => (
          <div key={ci.id} className="item-row">
            <img
              src={ci.product?.image}
              alt={ci.product?.name}
              className="item-image"
            />

            <div className="item-info">
              <h4>{ci.product?.name}</h4>
              <p>Size: {ci.size || "-"}</p>
              <p>Qty: {ci.quantity}</p>
            </div>

            <div className="item-price">
              ₹{(ci.product?.price || 0) * ci.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="bottom-box">
        <h2>Subtotal: ₹{subtotal}</h2>

        {discount > 0 && <h3>Discount: -₹{discount}</h3>}

        <h2>Final Amount: ₹{finalPrice}</h2>

        <button className="continue-btn" onClick={goToPayment}>
          Continue to Payment
        </button>
      </div>

    </div>
  );
}
