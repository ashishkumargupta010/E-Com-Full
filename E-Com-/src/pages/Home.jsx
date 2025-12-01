import React, { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeroBanner from "../components/HeroBanner";
import { useDataStore } from "../context/DataStore";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { products = [], categories = [], trending = [], heroBanners = [] } = useDataStore();

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 3000,
  };

  const filteredProducts = products.filter((p) => {
    if (!p?.name || !p?.category) return false;
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="home-page">
      

      {heroBanners.length > 0 ? (
        <HeroBanner />
      ) : (
        <h2 className="fallback-text">Discover Your Style with Blushora 💖</h2>
      )}

      {heroBanners.length > 0 && (
        <Slider {...sliderSettings} className="home-slider">
          {heroBanners.map((item, i) => (
            <div key={i}>
              {item.type === "image" ? <img src={item.src} alt={`hero-${i}`} /> : <video src={item.src} autoPlay muted loop />}
            </div>
          ))}
        </Slider>
      )}

      {searchTerm.trim() !== "" && (
        <section className="category-section">
          <h2>Search Results</h2>
          <div className="category-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                </div>
              ))
            ) : (
              <p className="no-results">No products found ❌</p>
            )}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="category-section">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="product-card" onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}>
                {cat.image && <img src={cat.image} alt={cat.name} />}
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="category-section">
          <h2>Trending Now</h2>
          <div className="category-grid">
            {trending.map((product) => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
