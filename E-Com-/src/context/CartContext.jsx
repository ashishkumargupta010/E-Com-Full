import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const API = "http://localhost:5000/api";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart([]);
      return;
    }

    try {
      const res = await fetch(`${API}/cart/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setCart([...data]); // 🔥 FORCE UPDATE
      } else {
        setCart([]);
      }
    } catch (err) {
      console.log("Fetch cart error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async ({ id, size, quantity }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login!");
      return;
    }

    try {
      const res = await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          size,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchCart(); // refresh
    } catch (err) {
      alert("Add to cart failed: " + err.message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    const token = localStorage.getItem("token");

    await fetch(`${API}/cart/${cartItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    const token = localStorage.getItem("token");

    await fetch(`${API}/cart/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart: fetchCart, // 🔥 Allow external refresh
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
