import React, { useEffect, useState } from "react";
import "./OrderPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  // ⭐ Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState(null);

  const token = localStorage.getItem("token");

  /* 🔥 LOAD ORDERS */
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
        setOrders(data);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };

  /* ⭐ Cancel Order */
  const cancelOrder = async (id) => {
    const reason = prompt("Reason for cancellation?");
    if (!reason) return;

    const res = await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      alert("Order Cancelled!");
      loadOrders();
    }
  };

  /* ⭐ Check Return Eligibility */
  const isReturnAvailable = (order) => {
    if (!order.returnDeadline) return false;
    return new Date() <= new Date(order.returnDeadline);
  };

  /* ⭐ Return Order */
  const returnOrder = async (id) => {
    const reason = prompt("Why do you want to return?");
    if (!reason) return;

    const res = await fetch(`http://localhost:5000/api/orders/${id}/return`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      alert("Return Requested!");
      loadOrders();
    }
  };

  /* ⭐ Submit Review */
  const submitReview = async () => {
    const { orderId, itemId } = showReviewModal;
    if (rating === 0) return alert("Select rating");

    let imgData = null;

    if (reviewImage) {
      const reader = new FileReader();
      reader.onload = async () => {
        imgData = reader.result;
        await sendReview(orderId, itemId, imgData);
      };
      reader.readAsDataURL(reviewImage);
    } else {
      await sendReview(orderId, itemId, null);
    }
  };

  const sendReview = async (orderId, itemId, imgData) => {
    await fetch(
      `http://localhost:5000/api/orders/${orderId}/items/${itemId}/review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          text: reviewText,
          image: imgData,
        }),
      }
    );

    alert("Review Submitted!");
    setShowReviewModal(null);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setReviewImage(null);
    loadOrders();
  };

  /* ⭐ Scroll Animation */
  useEffect(() => {
    const cards = document.querySelectorAll(".order-card");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [orders]);

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              
              {/* ORDER HEADER */}
              <div className="order-header">
                <span className={`status-badge ${order.status.replace(/\s+/g, "")}`}>
                  {order.status}
                </span>

                <span className="order-date">
                  {new Date(order.placedAt).toLocaleString()}
                </span>

                <span className="order-id">Order #{order.id}</span>
              </div>

              {/* TIMELINE */}
              <div className="timeline">

                {/* Ordered */}
                <div className={`step ${["Pending","Packed","Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}`}>
                  <div className="step-circle"></div>
                  <p>Ordered</p>
                </div>

                <div className={`step-line ${["Packed","Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}`} />

                {/* Packed */}
                <div className={`step ${["Packed","Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}`}>
                  <div className="step-circle"></div>
                  <p>Packed</p>
                </div>

                <div className={`step-line ${["Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}`} />

                {/* Shipped */}
                <div className={`step ${["Shipped","Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}`}>
                  <div className="step-circle"></div>
                  <p>Shipped</p>
                </div>

                <div className={`step-line ${["Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}`} />

                {/* Out for Delivery */}
                <div className={`step ${["Out for Delivery","Delivered"].includes(order.status) ? "active" : ""}`}>
                  <div className="step-circle"></div>
                  <p>Out for Delivery</p>
                </div>

                <div className={`step-line ${["Delivered"].includes(order.status) ? "active" : ""}`} />

                {/* Delivered */}
                <div className={`step ${order.status === "Delivered" ? "active" : ""}`}>
                  <div className="step-circle"></div>
                  <p>Delivered</p>
                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="delivery-box">
                <h4>Delivery Address</h4>

                <p><b>{order.address?.name}</b></p>
                <p>📞 {order.address?.phone}</p>
                <p>
                  {order.address?.street}, {order.address?.city}
                  <br />
                  {order.address?.state} - {order.address?.pincode}
                </p>
              </div>

              {/* ORDER ITEMS */}
              <div className="order-items">
                {order.items?.map((item) => (
                  <div className="order-item" key={item.id}>

                    <img
                      src={item.product?.image}
                      alt=""
                      className="order-img"
                    />

                    <div className="item-details">
                      <h3>{item.product?.name}</h3>
                      <p>₹{item.price} × {item.quantity}</p>
                      {item.size && <p>Size: {item.size}</p>}
                    </div>

                    {/* ⭐ Review Button */}
                    {order.status === "Delivered" && !item.review && (
                      <button
                        className="review-btn"
                        onClick={() =>
                          setShowReviewModal({
                            orderId: order.id,
                            itemId: item.id,
                          })
                        }
                      >
                        ⭐ Review
                      </button>
                    )}

                    {item.review && (
                      <p className="reviewed-tag">Reviewed ✓</p>
                    )}

                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="order-total">
                <strong>Total Amount:</strong> ₹{order.total}
              </div>

              {/* ACTION BUTTONS */}
              <div className="order-actions">
                {order.status === "Pending" && (
                  <button className="cancel-btn" onClick={() => cancelOrder(order.id)}>
                    Cancel Order
                  </button>
                )}

                {order.status === "Delivered" && isReturnAvailable(order) && (
                  <button className="return-btn" onClick={() => returnOrder(order.id)}>
                    Return Order
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ⭐ REVIEW MODAL */}
      {showReviewModal && (
        <div className="review-modal">
          <div className="review-card-modal">
            <h2>Rate Your Product</h2>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`star ${(hoverRating || rating) >= s ? "filled" : ""}`}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <input
              type="file"
              onChange={(e) => setReviewImage(e.target.files[0])}
            />

            <button className="submit-review" onClick={submitReview}>
              Submit Review
            </button>
            <button className="close-modal" onClick={() => setShowReviewModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
