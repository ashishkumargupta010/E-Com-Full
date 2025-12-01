import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* --- Brand Info --- */}
        <div className="footer-section about">
          <h2 className="footer-logo">Blushora</h2>
          <p>
            Blushora is your go-to e-commerce platform for trendy, high-quality
            products with a touch of elegance. Discover your unique style today!
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        {/* --- Customer Support --- */}
        <div className="footer-section support">
          <h3>Support</h3>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/returns">Return Policy</a></li>
          </ul>
        </div>

        {/* --- Social Media --- */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Blushora. All Rights Reserved.</p>
        <p>Designed with 💖 by <strong>Ashish Kumar Gupta</strong></p>
      </div>
    </footer>
  );
}

export default Footer;
