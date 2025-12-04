import "./ReviewPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ReviewPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const address = JSON.parse(localStorage.getItem("checkoutAddress"));

  // LOAD CART
  const loadCart = async () => {
    const res = await fetch("http://localhost:5000/api/cart/items", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setCartItems(data);

      const total = data.reduce(
        (sum, ci) => sum + (ci.product?.price || 0) * ci.quantity,
        0
      );

      const savedDiscount = Number(localStorage.getItem("cartDiscount")) || 0;

      setSubtotal(total);
      setDiscount(savedDiscount);
      setFinalPrice(total - savedDiscount);
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    await loadCart();
  };
  fetchData();
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
    <motion.div
      className="review-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="page-title"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Review Your Order
      </motion.h2>

      {/* DELIVERY ADDRESS */}
      <motion.div
        className="review-box"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="box-title">Delivery Address</div>

        <div className="address-line">
          <div>
            <h4>{address.name}</h4>
            <p>{address.phone}</p>
            <p>{address.line1}</p>
            <p>
              {address.city} - {address.pincode}
            </p>
          </div>

          <motion.button
            className="change-btn"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/select-address")}
          >
            Change
          </motion.button>
        </div>
      </motion.div>

      {/* ITEMS */}
      <motion.div
        className="review-box"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="box-title">Items</div>

        {cartItems.map((ci) => (
          <motion.div
            key={ci.id}
            className="item-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              src={ci.product?.image}
              className="item-image"
              alt={ci.product?.name}
              whileHover={{ scale: 1.05 }}
            />

            <div className="item-info">
              <h4>{ci.product?.name}</h4>
              <p>Size: {ci.size || "-"}</p>
              <p>Qty: {ci.quantity}</p>
            </div>

            <div className="item-price">
              ₹{(ci.product?.price || 0) * ci.quantity}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* PRICE BOX */}
      <motion.div
        className="bottom-box"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>Subtotal: ₹{subtotal}</h2>

        {discount > 0 && <h3>Discount Applied: -₹{discount}</h3>}

        <h1 className="final-amount">Final Amount: ₹{finalPrice}</h1>

        <motion.button
          className="continue-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={goToPayment}
        >
          Continue to Payment →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
