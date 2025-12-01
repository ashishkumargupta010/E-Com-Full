import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
const API = "http://localhost:5000/api";

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);

  // Load categories from backend
  useEffect(() => {
    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data || []);
        localStorage.setItem("categories", JSON.stringify(data || []));
      })
      .catch((err) => {
        console.error("Category Load Error:", err);
        const saved = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(saved);
      });
  }, []);

  // Load products from backend
  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => {
        // backend returns product with category object (if included)
        const mapped = (data || []).map((p) => ({
          ...p,
          category: p.category?.name || p.category || "Other",
        }));
        setProducts(mapped);
        localStorage.setItem("products", JSON.stringify(mapped));
      })
      .catch((err) => {
        console.error("Product Load Error:", err);
        const saved = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(saved);
      });
  }, []);

  // Load trending + hero from local (admin sets these)
  useEffect(() => {
    setTrending(JSON.parse(localStorage.getItem("trending")) || []);
    setHeroBanners(JSON.parse(localStorage.getItem("heroBanners")) || []);
  }, []);

  const saveLocal = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  // ADMIN: add product -> backend
  const addProduct = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: item.name,
          price: Number(item.price),
          image: item.image,
          categoryId: item.categoryId,
          stock: item.stock ?? 10,
          description: item.description ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Add product failed");
      // append new product (map category)
      const newP = { ...data.product, category: data.product.category?.name || "Other" };
      const updated = [...products, newP];
      setProducts(updated);
      saveLocal("products", updated);
    } catch (err) {
      alert("Add product error: " + err.message);
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Delete failed");
      }
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveLocal("products", updated);
      setTrending((t) => t.filter((it) => it.id !== id));
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  // Categories admin (calls backend)
  const addCategory = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Add category failed");
      const updated = [...categories, data];
      setCategories(updated);
      saveLocal("categories", updated);
    } catch (err) {
      alert("Add category error: " + err.message);
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Delete category failed");
      }
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      saveLocal("categories", updated);
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  // Trending & hero remain local-managed in UI (you can sync with backend if wanted)
  const setTrendingProducts = (items) => {
    setTrending(items);
    saveLocal("trending", items);
  };

  const setHeroBannerData = (items) => {
    setHeroBanners(items);
    saveLocal("heroBanners", items);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        trending,
        heroBanners,
        addProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        setTrendingProducts,
        setHeroBannerData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataStore = () => useContext(DataContext);
