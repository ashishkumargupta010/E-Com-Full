import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <h1>About Blushora</h1>
      <p>
        Welcome to <strong>Blushora</strong> — your one-stop online destination
        for trendy, high-quality products made exclusively for women who love
        fashion, confidence, and comfort.
      </p>

      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Founded with passion and creativity, PinkAura was born to bring 
          modern style, elegance, and uniqueness into every girl’s wardrobe.
          From daily essentials to glamorous collections, we believe every 
          woman deserves to feel confident and beautiful.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To empower every woman through fashion that speaks comfort,
          confidence, and sustainability — without compromising style.
        </p>
      </section>

      <section className="about-section">
        <h2>Why Choose Blushora?</h2>
        <ul>
          <li>✨ 100% quality-checked and verified products</li>
          <li>🚚 Fast and secure delivery</li>
          <li>💖 Fashion inspired by modern women</li>
          <li>♻️ Sustainable and eco-friendly packaging</li>
        </ul>
      </section>
    </div>
  );
}

export default About;
