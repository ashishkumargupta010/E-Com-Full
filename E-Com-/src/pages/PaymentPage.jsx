import React, { useEffect, useState } from "react";
import "./PaymentPage.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 🔥 ADD THIS

const PaymentPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { refreshCart } = useCart(); // 🔥 VERY IMPORTANT

  const [items, setItems] = useState([]);
  const [address, setAddress] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------ INITIAL LOAD ------------------ */
  useEffect(() => {
    loadCart();
    loadAddress();
    loadLocalAmounts();
  }, []);

  /* ------------------ LOAD CART ------------------ */
  const loadCart = async () => {
    try {
      let res = await fetch("http://localhost:5000/api/cart/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = await res.json();

      // If backend didn't return array → fallback
      if (!Array.isArray(data)) {
        const ls = JSON.parse(localStorage.getItem("cartItems")) || [];
        return setItems(
          ls.map((it) => ({
            cartId: it.id,
            productId: it.productId,
            quantity: it.quantity,
            size: it.size,
            price: it.price,
            image: it.image,
            name: it.name,
          }))
        );
      }

      // Normalize cart shape
      const prepared = data.map((ci) => ({
        cartId: ci.id,
        productId: ci.productId,
        quantity: ci.quantity,
        size: ci.size || null,
        price: Number(ci.product?.price),
        name: ci.product?.name || "",
        image: ci.product?.image || "",
      }));

      setItems(prepared);
    } catch (err) {
      console.log("Cart load failed", err);
      const ls = JSON.parse(localStorage.getItem("cartItems")) || [];
      setItems(ls);
    }
  };

  /* ------------------ LOAD ADDRESS ------------------ */
  const loadAddress = () => {
    const addr = JSON.parse(localStorage.getItem("checkoutAddress")) || {};
    setAddress(addr);
  };

  /* ------------------ LOAD DISCOUNT & PRICE ------------------ */
  const loadLocalAmounts = () => {
    const final = Number(localStorage.getItem("finalPrice"));
    const total = Number(localStorage.getItem("cartTotal"));
    const disc = Number(localStorage.getItem("cartDiscount")) || 0;

    setDiscount(disc);

    if (!isNaN(final) && final > 0) {
      setFinalPrice(final);
      setSubtotal(total || 0);
    } else {
      setFinalPrice(total - disc);
      setSubtotal(total || 0);
    }
  };

  /* ------------------ RECALCULATE WHEN CART CHANGES ------------------ */
  useEffect(() => {
    const total = items.reduce(
      (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
      0
    );

    const disc = Number(localStorage.getItem("cartDiscount")) || 0;

    setSubtotal(total);
    setDiscount(disc);
    setFinalPrice(total - disc);

    localStorage.setItem("cartTotal", String(total));
    localStorage.setItem("finalPrice", String(Math.max(0, total - disc)));
  }, [items]);

  /* ------------------ PLACE ORDER ------------------ */
  const handlePlaceOrder = async () => {
    if (!method) return alert("Select payment method");
    if (!token) return navigate("/login");
    if (!address || !address.name) return navigate("/select-address");

    setLoading(true);

    const payload = {
      items: items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        size: it.size || null,
      })),
      address: {
        fullName: address.name,
        phone: address.phone,
        house: address.line1,
        city: address.city,
        pincode: address.pincode,
      },
      paymentMethod: method,
      total: finalPrice,
      paymentResult: null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      // Save order id
      if (data.order?.id) {
        localStorage.setItem("lastOrderId", data.order.id);
      }

      /* ------------------ BACKEND CART CLEAR ------------------ */
      await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      /* ------------------ REACT CONTEXT CART CLEAR ------------------ */
      await refreshCart(); // 🔥 SUPER IMPORTANT

      /* ------------------ LOCAL CLEAR ------------------ */
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartTotal");
      localStorage.removeItem("cartDiscount");
      localStorage.removeItem("finalPrice");

      navigate("/order-success", { state: { orderId: data.order.id } });
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Order failed");
    }
  };

  return (
    <div className="payment-container">
      <h1>Complete Payment</h1>

      <h2>Subtotal: ₹{subtotal}</h2>
      <h2>Discount: -₹{discount}</h2>
      <h1>Final Amount: ₹{finalPrice}</h1>

      <div className="payment-box">
        <h3>Select Payment Method</h3>

        {["UPI", "Card", "NetBanking", "COD"].map((m) => (
          <button
            key={m}
            className={`payment-option ${method === m ? "active" : ""}`}
            onClick={() => setMethod(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {method && (
        <button
          className="pay-btn"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading
            ? method === "COD"
              ? "Placing Order..."
              : "Processing Payment..."
            : method === "COD"
            ? "Place Order"
            : "Pay Now"}
        </button>
      )}
    </div>
  );
};

export default PaymentPage;
