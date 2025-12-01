import React from "react";
import "./HeroBanner.css";

const HeroBanner = () => {
  const handleScroll = () => {
    const section = document.getElementById("products-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-banner">
      <div className="hero-text">
        <h1>
          Discover Your Style with <span>Blushora</span>
        </h1>
        <p>Elegant • Trendy • Exclusive — Just for You 💖</p>
        <button onClick={handleScroll}>Shop Now</button>
      </div>
    </div>
  );
};

export default HeroBanner;

