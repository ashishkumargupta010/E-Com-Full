import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../context/CartContext";

const API = "http://localhost:5000/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [pincode, setPincode] = useState("");
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Product fetch error:", err);
        setProduct(null);
      });
  }, [id]);

  if (!product) return <h2 style={{ textAlign: "center", marginTop: 50 }}>Loading...</h2>;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to cart!");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    await addToCart({
      id: product.id,
      size: selectedSize,
      quantity: 1,
    });

    navigate("/cart");
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const discount = Math.floor(Math.random() * 40) + 10;
  const oldPrice = Math.floor(product.price + product.price * (discount / 100));
  const categoryName = product.category?.name || "Other";

  return (
    <div className="product-details-page">
      <div className="product-detail-card">
        <div className="image-section">
          <img src={product.image} alt={product.name} className="product-detail-image" />

          <button
            className={`wishlist-btn ${wishlist ? "active" : ""}`}
            onClick={() => setWishlist(!wishlist)}
          >
            ❤️ {wishlist ? "Added" : "Add to Wishlist"}
          </button>
        </div>

        <div className="product-detail-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="price-box">
            <span className="new-price">₹{product.price}</span>
            <span className="old-price">₹{oldPrice}</span>
            <span className="discount">{discount}% OFF</span>
          </div>

          <p className="details-cat">Category: {categoryName}</p>

          <div className="size-section">
            <h4>Select Size</h4>
            <div className="size-buttons">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={`size-btn ${selectedSize === s ? "active" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="variant-buttons">
            <button className="add-btn" onClick={handleAddToCart}>🛒 Add to Cart</button>
            <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
