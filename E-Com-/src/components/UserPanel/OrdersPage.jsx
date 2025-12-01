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

  /* 🔥 LOAD ORDERS FROM BACKEND */
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
        // sort latest first
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

  /* ⭐ Return Eligibility */
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

  /* ⭐ CARD ANIMATION */
  useEffect(() => {
    const cards = document.querySelectorAll(".order-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.4 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [orders]);

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="order-scroll-track">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              
              {/* ⭐ IMAGE FIX */}
              <img
                src={order.items?.[0]?.product?.image || ""}
                alt=""
                className="order-image"
              />

              <div className="order-info">

                <h3 className="order-product">
                  {order.items?.[0]?.product?.name}
                </h3>

                <p className="order-id">Order ID: {order.id}</p>
                <p className="order-price">₹{order.total}</p>

                <p className={`order-status status-${order.status.replace(/ /g, "")}`}>
                  {order.status}
                </p>

                {/* ⭐ If any item reviewed */}
                {order.items?.some((it) => it.review) && (
                  <p className="user-review-done">
                    ⭐ You reviewed this product
                  </p>
                )}

                {/* ⭐ Review Button */}
                {order.status === "Delivered" &&
                  order.items?.map((it) =>
                    !it.review ? (
                      <button
                        key={it.id}
                        className="review-btn"
                        onClick={() =>
                          setShowReviewModal({ orderId: order.id, itemId: it.id })
                        }
                      >
                        ⭐ Rate & Review
                      </button>
                    ) : null
                  )}

                <p className="order-date">
                  Ordered on:{" "}
                  <b>{new Date(order.placedAt).toLocaleString()}</b>
                </p>

                {/* ⭐ Cancel / Return Buttons */}
                <div className="order-buttons">
                  {order.status === "Pending" && (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {order.status === "Delivered" && isReturnAvailable(order) && (
                    <button
                      className="reorder-btn"
                      onClick={() => returnOrder(order.id)}
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⭐ REVIEW MODAL */}
      {showReviewModal && (
        <div className="review-modal">
          <div className="review-content">
            <h2 className="review-title">Rate Your Product</h2>

            <div className="star-container">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`star ${
                    (hoverRating || rating) >= num ? "filled" : ""
                  }`}
                  onMouseEnter={() => setHoverRating(num)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(num)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="review-textarea"
            />

            <label className="review-image-label">
              Upload Image (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setReviewImage(e.target.files[0])}
              className="review-image-input"
            />

            <button className="submit-review-btn" onClick={submitReview}>
              Submit Review
            </button>

            <button
              className="close-review-btn"
              onClick={() => setShowReviewModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
