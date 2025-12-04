import React, { useEffect, useState } from "react";
import "./AdminReviews.css";

const API = "http://localhost:5000/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("adminToken");

  const loadReviews = async () => {
    try {
      const res = await fetch(`${API}/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.log("Invalid data:", data);
        return;
      }

      setReviews(data);
    } catch (err) {
      console.log("Review Load Error:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const getStars = (count) => "⭐".repeat(count);

  return (
    <div className="admin-reviews-container">

      {/* PAGE TITLE */}
      <h2 className="admin-reviews-title">⭐ Rating & Reviews</h2>
      <p className="admin-reviews-subtitle">
       Monitor customer feedback to enhance product experiences and service.
      </p> 

      {/* NO REVIEWS */}
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews available.</p>
      ) : (
        <div className="review-list">
          {reviews.map((r, index) => (
            <div className="review-card" key={index}>
              
              {/* PRODUCT IMAGE */}
              <img
                src={r.image}
                alt="product"
                className="review-product-img"
              />

              {/* CONTENT */}
              <div className="review-content">
                <h3 className="review-product-name">{r.product}</h3>

                <p className="review-user">
                  <b>User:</b> {r.user}
                  {r.userPhone ? ` (${r.userPhone})` : ""}
                </p>

                <p className="review-stars">{getStars(r.rating)}</p>

                <p className="review-text">{r.text}</p>

                {/* USER REVIEW IMAGE */}
                {r.reviewImg && (
                  <img
                    src={r.reviewImg}
                    alt="review-img"
                    className="review-img"
                  />
                )}

                <p className="review-date">
                  Reviewed on: {new Date(r.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
