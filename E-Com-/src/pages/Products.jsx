import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Products.css";

const API = "http://localhost:5000/api";

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ⭐ Load backend products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(data);
  };

  // ⭐ Read ?category=Ethnic Wear from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  // ⭐ Navigate to product details
  const handleProductClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  // ⭐ Create category list from backend product.category.name
  const categoryList = [
    ...new Set(products.map((p) => p.category?.name || "Others")),
  ];

  // ⭐ Filter products by backend category
  const filtered = selectedCategory
    ? products.filter((p) => p.category?.name === selectedCategory)
    : products;

  return (
    <div className="products-page">
      
      {/* If category selected → show its products */}
      {selectedCategory ? (
        <>
          <h2 className="category-title">{selectedCategory}</h2>

          <div className="category-grid">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                </div>
              ))
            ) : (
              <p className="empty-msg">No products found 🚫</p>
            )}
          </div>
        </>
      ) : (
        /* ALL CATEGORY SECTIONS */
        categoryList.map((cat) => (
          <div key={cat} className="category-section">
            <h2 className="category-title">{cat}</h2>

            <div className="category-grid">
              {products
                .filter((p) => p.category?.name === cat)
                .map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                  >
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>₹{product.price}</p>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
