import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";
import { useDataStore } from "../context/DataStore";

import homeIcon from "/icons/home.svg";
import productIcon from "/icons/product.svg";
import cartIcon from "/icons/cart.svg";
import userIcon from "/icons/user.svg";
import { FiMoreHorizontal } from "react-icons/fi";

function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const { products = [] } = useDataStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const dropdownRef = useRef(null);

  const hideSearchOn = [
    "/cart",
    "/checkout",
    "/payment",
    "/order-success",
    "/select-address",
    "/userpanel",
  ];

  const shouldHideSearch = hideSearchOn.some((path) =>
    location.pathname.startsWith(path)
  );

  // Load user
  useEffect(() => {
    const saved = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");

    if (saved && token) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // Hide dropdown outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setShowUserDropdown(false);
    navigate("/");
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products
      .filter((p) => p.name.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    setSuggestions([]);
    setSearchTerm("");
  };

  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => navigate("/")}>
        Blushora
      </h2>

      {/* 🔍 SEARCH BAR */}
      {!shouldHideSearch && (
        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for dresses, kurtis, tops..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>

          {suggestions.length > 0 && (
            <div className="suggest-box">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="suggest-item"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setSuggestions([]);
                    setSearchTerm("");
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </form>
      )}

      {/* DESKTOP NAV */}
      <div className="nav-links">
        <div className="nav-main-icons">
          <Link to="/">
            <img src={homeIcon} className="nav-icon" alt="home" />
          </Link>
          <Link to="/products">
            <img src={productIcon} className="nav-icon" alt="products" />
          </Link>

          <Link to="/cart" className="cart-link">
            <img src={cartIcon} className="nav-icon" alt="cart" />
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </Link>
        </div>

        {/* USER LOGGED IN */}
        {user ? (
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button
              className="user-toggle-btn"
              onClick={() => setShowUserDropdown((s) => !s)}
            >
              <span className="hello-user">Hi, {user.name.split(" ")[0]}</span>
              <img src={userIcon} className="user-icon" alt="user" />
            </button>

            {showUserDropdown && (
              <div className="user-dropdown">

                {/* ⭐ NEW PREMIUM HEADING */}
                <p className="ud-name">{user.name}</p>
                {user.phone && <p className="ud-phone">📞 {user.phone}</p>}

                {/* ⭐ NEW BUTTON STYLE */}
                <button
                  className="ud-btn"
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate("/userpanel/profile");
                  }}
                >
                  My Profile
                </button>

                <button
                  className="ud-btn"
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate("/userpanel/orders");
                  }}
                >
                  My Orders
                </button>

                <button
                  className="ud-btn"
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate("/userpanel/address");
                  }}
                >
                  Saved Addresses
                </button>

                {user.role === "admin" && (
                  <button
                    className="ud-btn"
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate("/admin/products");
                    }}
                  >
                    Admin Dashboard
                  </button>
                )}

                <button className="ud-btn logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="sign-btn" onClick={() => setShowAuthModal(true)}>
            <img src={userIcon} className="user-icon" alt="user" /> Sign In / Sign Up
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      <div className="mobile-more-menu">
        <button className="more-btn" onClick={() => setShowMoreMenu(!showMoreMenu)}>
          <FiMoreHorizontal size={22} />
        </button>

        {showMoreMenu && (
          <div className="more-dropdown">
            <Link to="/" onClick={() => setShowMoreMenu(false)}>
              <img src={homeIcon} alt="home" /> Home
            </Link>
            <Link to="/products" onClick={() => setShowMoreMenu(false)}>
              <img src={productIcon} alt="prod" /> Categories
            </Link>
            <Link to="/cart" onClick={() => setShowMoreMenu(false)}>
              <img src={cartIcon} alt="cart" /> Cart
            </Link>

            {!user && (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setShowMoreMenu(false);
                }}
              >
                <img src={userIcon} alt="acc" /> Account
              </button>
            )}

            {user && (
              <>
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    navigate("/userpanel");
                  }}
                >
                  Dashboard
                </button>

                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      navigate("/admin/products");
                    }}
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={(u) => {
            setUser(u);
            setShowAuthModal(false);
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;
