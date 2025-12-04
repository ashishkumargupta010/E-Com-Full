import React from "react";
import "./HeroBanner.css";

const HeroBanner = ({ banners = [] }) => {
  const handleScroll = () => {
    const section = document.getElementById("products-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --------------------------------------------------------
  // ❗ 1. NO HERO BANNERS → Show default Hero UI
  // --------------------------------------------------------
  if (!banners || banners.length === 0) {
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
  }

  // --------------------------------------------------------
  // 🎀 2. HERO BANNERS EXIST → Use FIRST banner's title/button
  // (Image/video slider already shown separately in Home.jsx)
  // --------------------------------------------------------
  const banner = banners[0];

  return (
    <div className="hero-banner">
      <div className="hero-text">

        <h1>
          {banner?.title ? (
            banner.title
          ) : (
            <>
              Discover Your Style with <span>Blushora</span>
            </>
          )}
        </h1>

        <p>Elegant • Trendy • Exclusive — Just for You 💖</p>

        <button onClick={handleScroll}>
          {banner?.buttonText || "Shop Now"}
        </button>

      </div>
    </div>
  );
};

export default HeroBanner;
