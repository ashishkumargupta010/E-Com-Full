import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
const API = "http://localhost:5000/api";

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);

  /* --------------------------------------------------
      1️⃣ LOAD CATEGORIES FROM BACKEND
  -------------------------------------------------- */
  useEffect(() => {
    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data || []);
        localStorage.setItem("categories", JSON.stringify(data || []));
      })
      .catch((err) => {
        console.error("Category Load Error:", err);
        setCategories(JSON.parse(localStorage.getItem("categories")) || []);
      });
  }, []);

  /* --------------------------------------------------
      2️⃣ LOAD PRODUCTS FROM BACKEND
  -------------------------------------------------- */
  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data || []).map((p) => ({
          ...p,
          category: p.category?.name || p.category || "Other",
        }));

        setProducts(mapped);
        localStorage.setItem("products", JSON.stringify(mapped));
      })
      .catch((err) => {
        console.error("Product Load Error:", err);
        setProducts(JSON.parse(localStorage.getItem("products")) || []);
      });
  }, []);

  /* --------------------------------------------------
      3️⃣ LOAD HERO BANNERS FROM BACKEND (MAIN FIX!)
  -------------------------------------------------- */
  const fetchHeroBanners = async () => {
    try {
      const res = await fetch(`${API}/hero`);
      const data = await res.json();
      setHeroBanners(data || []);
      localStorage.setItem("heroBanners", JSON.stringify(data || []));
    } catch (err) {
      console.error("Hero Load Error:", err);
      setHeroBanners(JSON.parse(localStorage.getItem("heroBanners")) || []);
    }
  };

  /* --------------------------------------------------
      4️⃣ LOAD TRENDING (LOCAL ONLY) + HERO FETCH CALL
  -------------------------------------------------- */
  useEffect(() => {
    setTrending(JSON.parse(localStorage.getItem("trending")) || []);
    fetchHeroBanners(); // ⭐ FIX → backend se load karo
  }, []);

  /* --------------------------------------------------
      Helper to save in localStorage
  -------------------------------------------------- */
  const saveLocal = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

  /* --------------------------------------------------
      ➕ ADD PRODUCT (ADMIN)
  -------------------------------------------------- */
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

      const newP = {
        ...data.product,
        category: data.product.category?.name || "Other",
      };

      const updated = [...products, newP];
      setProducts(updated);
      saveLocal("products", updated);
    } catch (err) {
      alert("Add product error: " + err.message);
    }
  };

  /* --------------------------------------------------
      ❌ DELETE PRODUCT
  -------------------------------------------------- */
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

  /* --------------------------------------------------
      ➕ ADD CATEGORY
  -------------------------------------------------- */
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
      if (!res.ok) throw new Error(data.message);

      const updated = [...categories, data];
      setCategories(updated);
      saveLocal("categories", updated);
    } catch (err) {
      alert("Add category error: " + err.message);
    }
  };

  /* --------------------------------------------------
      ❌ DELETE CATEGORY
  -------------------------------------------------- */
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

  /* --------------------------------------------------
      ⭐ TRENDING & HERO Managed in UI
  -------------------------------------------------- */
  const setTrendingProducts = (items) => {
    setTrending(items);
    saveLocal("trending", items);
  };

  const setHeroBannerData = (items) => {
    setHeroBanners(items);
    saveLocal("heroBanners", items);
  };

  /* --------------------------------------------------
      PROVIDE VALUES
  -------------------------------------------------- */
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
