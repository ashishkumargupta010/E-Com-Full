import React, { useState, useEffect } from "react";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let saved = JSON.parse(localStorage.getItem("adminOrders")) || [];

    // 🔥 Sort: Newest FIRST
    saved.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(saved);
  }, []);

  /* -----------------------------------------------------------
      SAVE to both adminOrders + userOrders
  ------------------------------------------------------------ */
  const syncOrders = (updated) => {
    updated.sort((a, b) => new Date(b.date) - new Date(a.date));

    setOrders(updated);
    localStorage.setItem("adminOrders", JSON.stringify(updated));
    localStorage.setItem("userOrders", JSON.stringify(updated));
  };

  /* -----------------------------------------------------------
      UPDATE STATUS
  ------------------------------------------------------------ */
  const updateStatus = (id, status) => {
    const updated = orders.map((o) => {
      if (o.id !== id) return o;

      let deliveredDate = o.deliveredDate;
      let returnDeadline = o.returnDeadline;

      if (status === "Delivered" && !o.deliveredDate) {
        deliveredDate = new Date().toISOString();

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        returnDeadline = deadline.toISOString();
      }

      return { ...o, status, deliveredDate, returnDeadline };
    });

    syncOrders(updated);
  };

  /* -----------------------------------------------------------
      CANCEL ORDER
  ------------------------------------------------------------ */
  const cancelOrder = (id) => {
    if (!window.confirm("Cancel this order?")) return;
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled", cancelReason: reason } : o
    );

    syncOrders(updated);
  };

  /* -----------------------------------------------------------
       RETURN ACTIONS
  ------------------------------------------------------------ */
  const approveReturn = (id) => {
    if (!window.confirm("Approve return request?")) return;

    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Return Approved" } : o
    );

    syncOrders(updated);
  };

  const rejectReturn = (id) => {
    if (!window.confirm("Reject this return?")) return;

    const reason = prompt("Reason for rejection?");
    if (!reason) return;

    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Return Rejected", rejectReason: reason } : o
    );

    syncOrders(updated);
  };

  const completeRefund = (id) => {
    if (!window.confirm("Mark refund completed?")) return;

    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Refund Completed" } : o
    );

    syncOrders(updated);
  };

  /* -----------------------------------------------------------
       DELETE ORDER
  ------------------------------------------------------------ */
  const removeOrder = (id) => {
    if (!window.confirm("Delete permanently?")) return;

    const updated = orders.filter((o) => o.id !== id);
    syncOrders(updated);
  };

  return (
    <div className="admin-orders-container">
      <h1>📦 All Orders</h1>

      {orders.length === 0 && <h3>No Orders Found</h3>}

      {orders.map((o) => (
        <div key={o.id} className="admin-order-box">

          {/* Action Buttons */}
          <div className="order-actions">
            {o.status === "Pending" && (
              <button className="cancel-btn" onClick={() => cancelOrder(o.id)}>
                Cancel
              </button>
            )}
            <button className="remove-btn" onClick={() => removeOrder(o.id)}>
              Remove
            </button>
          </div>

          <h3>Order #{o.id}</h3>

          <p><b>Order Time:</b> {o.date}</p>
          <p><b>User:</b> {o.user}</p>

          <p>
            <b>Address:</b> {o.address?.address}, {o.address?.city} - {o.address?.pincode}
          </p>

          <p><b>Phone:</b> {o.address?.phone}</p>
          <p><b>Payment:</b> {o.paymentMethod}</p>

          <p><b>Status:</b> {o.status}</p>

          <h4>Items:</h4>
          <ul>
            {o.items?.map((item) => (
              <li key={item.id}>
                {item.name} (₹{item.price} × {item.quantity})
                = <b>₹{item.price * item.quantity}</b>
              </li>
            ))}
          </ul>

          {/* ⭐ PRICE BREAKDOWN ⭐ */}
          <div className="price-details-admin">
            {o.subtotal !== undefined && (
              <p><b>Subtotal:</b> ₹{o.subtotal}</p>
            )}

            {o.discount > 0 && (
              <p style={{ color: "green" }}>
                <b>Discount:</b> -₹{o.discount}
              </p>
            )}

            {o.coupon && (
              <p><b>Coupon Applied:</b> {o.coupon}</p>
            )}

            <p><b>Final Amount:</b> ₹{o.total}</p>
          </div>

          {o.returnReason && (
            <p style={{ color: "orange" }}>
              <b>Return Reason:</b> {o.returnReason}
            </p>
          )}

          {o.returnImages?.length > 0 && (
            <>
              <b>Images:</b>
              <div className="return-images">
                {o.returnImages.map((img, i) => (
                  <img key={i} src={img} className="return-img" />
                ))}
              </div>
            </>
          )}

          {o.cancelReason && (
            <p style={{ color: "red" }}>
              <b>Cancelled:</b> {o.cancelReason}
            </p>
          )}

          {o.rejectReason && (
            <p style={{ color: "red" }}>
              <b>Return Rejected:</b> {o.rejectReason}
            </p>
          )}

          {/* STATUS UPDATE */}
          <div className="status-update">
            <label>Update Status:</label>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Return Requested">Return Requested</option>
              <option value="Return Approved">Return Approved</option>
              <option value="Refund Completed">Refund Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {o.status === "Return Requested" && (
            <div className="return-actions">
              <button className="approve-btn" onClick={() => approveReturn(o.id)}>
                Approve Return
              </button>
              <button className="reject-btn" onClick={() => rejectReturn(o.id)}>
                Reject
              </button>
              <button className="refund-btn" onClick={() => completeRefund(o.id)}>
                Refund Completed
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default AdminOrders;


