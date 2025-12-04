import React, { useState, useEffect } from "react";
import "./AdminProducts.css";

const API = "http://localhost:5000/api";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);

  // ⭐ ADMIN TOKEN (Correct one)
  const token = localStorage.getItem("adminToken");

  // Fetch on load
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadTrending();
    loadHero();
  }, []);

  // =============================
  // Load All Products
  // =============================
  const loadProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const loadCategories = async () => {
    const res = await fetch(`${API}/categories`);
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const loadTrending = async () => {
    const res = await fetch(`${API}/products/trending`);
    const data = await res.json();
    setTrending(Array.isArray(data) ? data : []);
  };

  const loadHero = async () => {
    const res = await fetch(`${API}/hero`);
    const data = await res.json();
    setHeroBanners(Array.isArray(data) ? data : []);
  };

  // =============================
  // Add Product
  // =============================
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    image: "",
    categoryId: "",
  });

  const handleProductChange = (e) =>
    setProductForm({ ...productForm, [e.target.name]: e.target.value });

  const submitProduct = async (e) => {
    e.preventDefault();

    if (
      !productForm.name ||
      !productForm.price ||
      !productForm.image ||
      !productForm.categoryId
    ) {
      alert("All fields are required!");
      return;
    }

    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: productForm.name,
        price: Number(productForm.price),
        image: productForm.image,
        categoryId: Number(productForm.categoryId),
        stock: 10,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to add product");
      return;
    }

    alert("Product Added Successfully!");
    setProductForm({ name: "", price: "", image: "", categoryId: "" });
    loadProducts();
  };

  // =============================
  // Delete Product
  // =============================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadProducts();
    loadTrending();
  };

  // =============================
  // Categories
  // =============================
  const [newCategory, setNewCategory] = useState("");

  const addNewCategory = async () => {
    if (!newCategory.trim()) return;

    await fetch(`${API}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });

    setNewCategory("");
    loadCategories();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadCategories();
  };

  // =============================
  // Trending Toggle
  // =============================
  const toggleTrending = async (productId) => {
    await fetch(`${API}/products/${productId}/trending`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    loadTrending();
    loadProducts();
  };

  // =============================
  // HERO Banner
  // =============================
  const [heroForm, setHeroForm] = useState({
    type: "image",
    src: "",
    title: "",
    buttonText: "",
    link: "",
  });

  const handleHeroChange = (e) =>
    setHeroForm({ ...heroForm, [e.target.name]: e.target.value });

  const addHeroBanner = async () => {
    await fetch(`${API}/hero`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(heroForm),
    });

    setHeroForm({ type: "image", src: "", title: "", buttonText: "", link: "" });
    loadHero();
  };

  const deleteHero = async (id) => {
    if (!window.confirm("Delete hero banner?")) return;

    await fetch(`${API}/hero/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadHero();
  };

  // =============================
  // RENDER UI
  // =============================
  return (
    <div className="admin-products-page">
      <h2>Admin Product Control Panel</h2>

      <div className="admin-tabs">
        {["products", "categories", "trending", "hero"].map((t) => (
          <button
            key={t}
            className={activeTab === t ? "active" : ""}
            onClick={() => setActiveTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ====================== PRODUCTS ====================== */}
      {activeTab === "products" && (
        <>
          <form className="admin-form" onSubmit={submitProduct}>
            <input
              name="name"
              placeholder="Product Name"
              value={productForm.name}
              onChange={handleProductChange}
            />
            <input
              name="price"
              placeholder="Price"
              value={productForm.price}
              onChange={handleProductChange}
            />
            <input
              name="image"
              placeholder="Image URL"
              value={productForm.image}
              onChange={handleProductChange}
            />
            <select
              name="categoryId"
              value={productForm.categoryId}
              onChange={handleProductChange}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button type="submit" className="add-btn">
              + Add Product
            </button>
          </form>

          <div className="admin-product-list">
            {products.map((p) => (
              <div key={p.id} className="admin-product-card">
                <img src={p.image} alt={p.name} />
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ====================== CATEGORIES ====================== */}
      {activeTab === "categories" && (
        <div className="category-section">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category Name"
          />
          <button onClick={addNewCategory}>+ Add Category</button>

          <ul className="category-list">
            {categories.map((c) => (
              <li key={c.id}>
                {c.name}
                <button onClick={() => deleteCategory(c.id)}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ====================== TRENDING ====================== */}
      {activeTab === "trending" && (
        <div className="trending-grid">
          {products.map((p) => (
            <div
              key={p.id}
              className={`trend-card ${
                trending.find((t) => t.id === p.id) ? "active" : ""
              }`}
            >
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <button onClick={() => toggleTrending(p.id)}>
                {trending.find((t) => t.id === p.id)
                  ? "Remove"
                  : "Make Trending"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ====================== HERO BANNER ====================== */}
      {activeTab === "hero" && (
        <div className="hero-section">
          <select
            name="type"
            value={heroForm.type}
            onChange={handleHeroChange}
          >
            <option value="image">Image Banner</option>
            <option value="video">Video Banner</option>
          </select>

          <input
            name="src"
            placeholder="Image / Video URL"
            value={heroForm.src}
            onChange={handleHeroChange}
          />
          <input
            name="title"
            placeholder="Title"
            value={heroForm.title}
            onChange={handleHeroChange}
          />
          <input
            name="buttonText"
            placeholder="Button Text"
            value={heroForm.buttonText}
            onChange={handleHeroChange}
          />
          <input
            name="link"
            placeholder="Redirect Link"
            value={heroForm.link}
            onChange={handleHeroChange}
          />

          <button onClick={addHeroBanner}>+ Add Banner</button>

          <div className="hero-list">
            {heroBanners.map((b) => (
              <div key={b.id} className="hero-card">
                {b.type === "image" ? (
                  <img src={b.src} alt="banner" />
                ) : (
                  <video src={b.src} controls />
                )}
                <button onClick={() => deleteHero(b.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
