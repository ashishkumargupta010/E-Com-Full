import React, { useEffect, useState } from "react";
import "./AdminContacts.css";

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = () => {
    fetch("http://localhost:5000/api/contact", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages(); // first load

    // 🔥 REAL-TIME AUTO PULLING EVERY 5 SECONDS
    const interval = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="contact-admin-wrapper">
      <h2 className="contact-title">Customer Contact Messages</h2>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="no-data">No contact messages yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email / Phone</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td className="msg-text">{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminContacts;
