import React, { useEffect, useState } from "react";
import "./AdminProducts.css";

const API = "http://localhost:5000/api";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("products");

  // core data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // product form (add)
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    image: "",
    categoryId: "",
    stock: 10,
    description: "",
  });

  // edit modal
  const [editing, setEditing] = useState(null); // product object or null
  const [editForm, setEditForm] = useState(null);

  // selection for bulk actions
  const [selected, setSelected] = useState(new Set());
  const [selectAllPage, setSelectAllPage] = useState(false);

  // filters / search / pagination
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // hero form
  const [heroForm, setHeroForm] = useState({
    type: "image",
    src: "",
    title: "",
    buttonText: "",
    link: "",
  });

  const token = localStorage.getItem("adminToken");

  // ---------- Loaders ----------
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    await Promise.allSettled([
      loadProducts(),
      loadCategories(),
      loadTrending(),
      loadHero(),
    ]);
    setLoading(false);
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTrending = async () => {
    try {
      const res = await fetch(`${API}/products/trending`);
      const data = await res.json();
      setTrending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHero = async () => {
    try {
      const res = await fetch(`${API}/hero`);
      const data = await res.json();
      setHeroBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Helpers ----------
  const resetAddForm = () =>
    setProductForm({ name: "", price: "", image: "", categoryId: "", stock: 10, description: "" });

  // ---------- Add Product ----------
  const handleProductChange = (e) =>
    setProductForm({ ...productForm, [e.target.name]: e.target.value });

  const submitProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.image || !productForm.categoryId) {
      return alert("Please fill Name, Price, Image URL and Category.");
    }
    try {
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
          stock: Number(productForm.stock) || 0,
          description: productForm.description || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Add product failed");
        return;
      }

      alert("Product added");
      resetAddForm();
      await loadProducts();
      await loadTrending();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ---------- Delete ----------
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadProducts();
      await loadTrending();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // bulk delete
  const bulkDelete = async () => {
    if (selected.size === 0) return alert("Select products first");
    if (!window.confirm(`Delete ${selected.size} products? This is permanent.`)) return;
    try {
      for (const id of Array.from(selected)) {
        // best-effort loop
        await fetch(`${API}/products/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSelected(new Set());
      await loadProducts();
      await loadTrending();
      alert("Bulk delete complete");
    } catch (err) {
      console.error(err);
      alert("Bulk delete encountered errors");
    }
  };

  // ---------- Trending Toggle ----------
  const toggleTrending = async (productId) => {
    try {
      await fetch(`${API}/products/${productId}/trending`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      await loadTrending();
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("Toggle trending failed");
    }
  };

  // ---------- Edit ----------
  const openEdit = (product) => {
    setEditing(product);
    setEditForm({
      name: product.name || "",
      price: product.price || "",
      image: product.image || "",
      categoryId: product.categoryId || "",
      stock: product.stock || 0,
      description: product.description || "",
    });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const submitEdit = async () => {
    if (!editing || !editForm) return;
    try {
      const res = await fetch(`${API}/products/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          price: Number(editForm.price),
          image: editForm.image,
          categoryId: Number(editForm.categoryId),
          stock: Number(editForm.stock),
          description: editForm.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }
      setEditing(null);
      setEditForm(null);
      await loadProducts();
      await loadTrending();
      alert("Product updated");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ---------- Categories ----------
  const [newCategory, setNewCategory] = useState("");
  const addNewCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await fetch(`${API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });
      setNewCategory("");
      await loadCategories();
    } catch (err) {
      console.error(err);
      alert("Add category failed");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await fetch(`${API}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadCategories();
    } catch (err) {
      console.error(err);
      alert("Delete category failed");
    }
  };

  // ---------- Hero ----------
  const handleHeroChange = (e) =>
    setHeroForm({ ...heroForm, [e.target.name]: e.target.value });

  const addHeroBanner = async () => {
    try {
      await fetch(`${API}/hero`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(heroForm),
      });
      setHeroForm({ type: "image", src: "", title: "", buttonText: "", link: "" });
      await loadHero();
    } catch (err) {
      console.error(err);
      alert("Add hero failed");
    }
  };

  const deleteHero = async (id) => {
    if (!window.confirm("Delete hero?")) return;
    try {
      await fetch(`${API}/hero/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadHero();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Selection helpers ----------
  const toggleSelect = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
    setSelectAllPage(false);
  };

  // ---------- Filtering / Sorting / Pagination UI ----------
  const filtered = products
    .filter((p) => (categoryFilter ? p.categoryId === Number(categoryFilter) : true))
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        String(p.id).includes(q)
      );
    });

  const sorted = filtered.slice().sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "priceAsc") return a.price - b.price;
    if (sortBy === "priceDesc") return b.price - a.price;
    if (sortBy === "stockAsc") return (a.stock || 0) - (b.stock || 0);
    if (sortBy === "stockDesc") return (b.stock || 0) - (a.stock || 0);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = sorted.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  // select all in current page
  useEffect(() => {
    if (!selectAllPage) return;
    const s = new Set(selected);
    pageItems.forEach((p) => s.add(p.id));
    setSelected(s);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAllPage, pageItems]);

  // ---------- Render ----------
  return (
    <div className="admin-products-page">
      <h2 className="ap-title">Products Management</h2>

      {/* Tabs */}
      <div className="admin-tabs">
        {["products", "categories", "trending", "hero"].map((t) => (
          <button
            key={t}
            className={activeTab === t ? "active" : ""}
            onClick={() => {
              setActiveTab(t);
              setError("");
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <div className="ap-loading">Loading...</div>}
      {error && <div className="ap-error">{error}</div>}

      {/* ========== PRODUCTS TAB ========== */}
      {activeTab === "products" && (
        <>
          <div className="ap-controls">
            <div className="ap-left-controls">
              <input
                placeholder="Search by name, id or description..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ap-search"
              />

              <select
                className="ap-filter"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className="ap-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="priceAsc">Price ↑</option>
                <option value="priceDesc">Price ↓</option>
                <option value="stockDesc">Stock ↓</option>
                <option value="stockAsc">Stock ↑</option>
              </select>
            </div>

            <div className="ap-right-controls">
              <button className="ap-btn danger" onClick={bulkDelete}>
                Delete Selected ({selected.size})
              </button>
            </div>
          </div>

          {/* Add product form */}
          <form className="admin-form" onSubmit={submitProduct}>
            <div className="form-row">
              <input name="name" placeholder="Product Name" value={productForm.name} onChange={handleProductChange} />
              <input name="price" placeholder="Price" value={productForm.price} onChange={handleProductChange} />
            </div>

            <div className="form-row">
              <input name="image" placeholder="Image URL" value={productForm.image} onChange={handleProductChange} />
              <select name="categoryId" value={productForm.categoryId} onChange={handleProductChange}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-row">
              <input name="stock" placeholder="Stock" value={productForm.stock} onChange={handleProductChange} />
              <input name="description" placeholder="Short Description" value={productForm.description} onChange={handleProductChange} />
              <button type="submit" className="add-btn">+ Add Product</button>
            </div>

            {productForm.image && (
              <div className="image-preview">
                <img src={productForm.image} alt="preview" onError={(e)=> e.currentTarget.style.display='none'} />
              </div>
            )}
          </form>

          {/* table */}
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={pageItems.every(p=>selected.has(p.id)) && pageItems.length>0} onChange={(e)=> {
                    if (e.target.checked) {
                      const s = new Set(selected);
                      pageItems.forEach(p=>s.add(p.id));
                      setSelected(s);
                    } else {
                      const s = new Set(selected);
                      pageItems.forEach(p=>s.delete(p.id));
                      setSelected(s);
                    }
                  }} /></th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Trending</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td className="td-img">
                      <img src={p.image} alt={p.name} onError={(e)=> e.currentTarget.src='/no-image.png'} />
                    </td>
                    <td className="td-name">
                      <div className="name-wrap">
                        <strong>{p.name}</strong>
                        <div className="muted">ID: {p.id}</div>
                        {p.description && <div className="muted desc">{p.description}</div>}
                      </div>
                    </td>
                    <td>{categories.find(c=>c.id===p.categoryId)?.name || "-"}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <span className={`stock-badge ${ (p.stock||0) <= 0 ? 'out' : (p.stock||0) < 5 ? 'low' : 'ok'}`}>
                        {p.stock || 0}
                      </span>
                    </td>
                    <td>
                      <button className={`trend-toggle ${trending.find(t=>t.id===p.id) ? 'active' : ''}`} onClick={() => toggleTrending(p.id)}>
                        {trending.find(t=>t.id===p.id) ? '★' : '☆'}
                      </button>
                    </td>
                    <td className="td-actions">
                      <button className="small" onClick={() => openEdit(p)}>Edit</button>
                      <button className="small danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={8} style={{textAlign:"center", padding:"18px"}}>No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="ap-pagination">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
          </div>

          {/* Edit Modal */}
          {editing && editForm && (
            <div className="ap-modal">
              <div className="ap-modal-card">
                <h3>Edit Product — ID {editing.id}</h3>
                <div className="form-row">
                  <input name="name" value={editForm.name} onChange={handleEditChange} />
                  <input name="price" value={editForm.price} onChange={handleEditChange} />
                </div>
                <div className="form-row">
                  <input name="image" value={editForm.image} onChange={handleEditChange} />
                  <select name="categoryId" value={editForm.categoryId} onChange={handleEditChange}>
                    <option value="">Select Category</option>
                    {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <input name="stock" value={editForm.stock} onChange={handleEditChange} />
                  <input name="description" value={editForm.description} onChange={handleEditChange} />
                </div>

                {editForm.image && <div className="image-preview small"><img src={editForm.image} alt="preview" onError={(e)=> e.currentTarget.style.display='none'} /></div>}

                <div className="modal-actions">
                  <button className="ap-btn" onClick={submitEdit}>Save</button>
                  <button className="ap-btn" onClick={() => { setEditing(null); setEditForm(null); }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========== CATEGORIES TAB ========== */}
      {activeTab === "categories" && (
        <div className="category-section">
          <div className="category-row">
            <input value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="New category name" />
            <button onClick={addNewCategory}>+ Add</button>
          </div>

          <ul className="category-list">
            {categories.map(c => (
              <li key={c.id}>
                <span>{c.name}</span>
                <div>
                  <button onClick={() => { if(window.confirm("Delete category?")) deleteCategory(c.id); }}>Delete</button>
                </div>
              </li>
            ))}
            {categories.length === 0 && <li className="muted">No categories</li>}
          </ul>
        </div>
      )}

      {/* ========== TRENDING (quick cards) ========== */}
      {activeTab === "trending" && (
        <div className="trending-grid">
          {products.map((p) => (
            <div key={p.id} className={`trend-card ${trending.find(t=>t.id===p.id) ? 'active' : ''}`}>
              <img src={p.image} alt={p.name} onError={(e)=> e.currentTarget.src='/no-image.png'} />
              <div className="trend-info">
                <h4>{p.name}</h4>
                <div className="muted">₹{p.price}</div>
                <button onClick={() => toggleTrending(p.id)}>
                  {trending.find(t=>t.id===p.id) ? 'Remove' : 'Make Trending'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========== HERO TAB ========== */}
      {activeTab === "hero" && (
        <div className="hero-section">
          <div className="hero-form">
            <select name="type" value={heroForm.type} onChange={handleHeroChange}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <input name="src" value={heroForm.src} onChange={handleHeroChange} placeholder="URL" />
            <input name="title" value={heroForm.title} onChange={handleHeroChange} placeholder="Title" />
            <input name="buttonText" value={heroForm.buttonText} onChange={handleHeroChange} placeholder="Button Text" />
            <input name="link" value={heroForm.link} onChange={handleHeroChange} placeholder="Link" />
            <button onClick={addHeroBanner}>+ Add Banner</button>
          </div>

          <div className="hero-list">
            {heroBanners.map(b => (
              <div key={b.id} className="hero-card">
                {b.type === "image" ? <img src={b.src} alt={b.title} /> : <video src={b.src} controls />}
                <div className="hero-meta">
                  <div><strong>{b.title}</strong></div>
                  <div className="muted">{b.buttonText} → {b.link}</div>
                  <button onClick={() => deleteHero(b.id)}>Delete</button>
                </div>
              </div>
            ))}
            {heroBanners.length === 0 && <div className="muted">No hero banners yet</div>}
          </div>
        </div>
      )}
    </div>
  );
}
