import React, { useEffect, useState } from "react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const adminOrders = JSON.parse(localStorage.getItem("adminOrders")) || [];

    // Extract only orders that have reviews
    const allReviews = adminOrders
      .filter((o) => o.review)
      .map((o) => ({
        id: o.id,
        product: o.items?.[0]?.name || "Unknown Product",
        image: o.items?.[0]?.image || "",
        rating: o.review.rating,
        text: o.review.text,
        reviewImg: o.review.image,
        date: o.review.date,
        user: o.userName || "Unknown User",
        userPhone: o.userPhone || "",
      }));

    setReviews(allReviews);
  }, []);

  const getStars = (count) => "⭐".repeat(count);

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins" }}>
      
      <h2 style={{ textAlign: "center" }}>⭐ Product Reviews</h2>
      <p style={{ textAlign: "center", color: "#555", marginTop: "-5px" }}>
        Monitor and moderate customer reviews.
      </p>

      <hr style={{ margin: "20px 0" }} />

      {reviews.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", fontSize: "18px" }}>
          No reviews available.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
                border: "1px solid #ffddea",
                display: "flex",
                gap: "15px",
                alignItems: "flex-start",
              }}
            >
              {/* Product Image */}
              <img
                src={r.image}
                alt="product"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0", color: "#d6006c" }}>{r.product}</h3>

                <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#333" }}>
                  <b>User:</b> {r.user}  
                  {r.userPhone && <span> ( {r.userPhone} )</span>}
                </p>

                <p style={{ margin: "5px 0", fontSize: "16px" }}>
                  <span style={{ fontSize: "18px" }}>{getStars(r.rating)}</span>
                </p>

                <p style={{ margin: "8px 0", color: "#444" }}>{r.text}</p>

                {r.reviewImg && (
                  <img
                    src={r.reviewImg}
                    alt="review-img"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginTop: "10px",
                      border: "1px solid #eee",
                    }}
                  />
                )}

                <p style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>
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

