import React from "react";
import "./PageStyle.css";

function ReturnPolicy() {
  return (
    <div className="page-container">
      <h2>Return Policy</h2>
      <p>
        We accept returns within <strong>14 days</strong> of receiving your
        order. Please ensure items are unused, unwashed, and in their original
        packaging.
      </p>
      <p>
        Refunds will be processed once the returned items are inspected. For
        damaged or incorrect items, please contact us immediately.
      </p>
    </div>
  );
}

export default ReturnPolicy;
