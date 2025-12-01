import React from "react";
import "./PageStyle.css";

function FAQ() {
  return (
    <div className="page-container">
      <h2>Frequently Asked Questions (FAQ)</h2>

      <div className="faq-item">
        <h4>How long does delivery take?</h4>
        <p>Usually 3–5 business days depending on your location.</p>
      </div>

      <div className="faq-item">
        <h4>Can I return an item?</h4>
        <p>Yes, within 14 days of delivery. Please read our Return Policy.</p>
      </div>

      <div className="faq-item">
        <h4>How can I contact support?</h4>
        <p>You can reach us at support@pinkaura.com or use our Contact page.</p>
      </div>
    </div>
  );
}

export default FAQ;
