import { useEffect, useState } from "react";
import "./SelectAddress.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SelectAddress() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);

  const [menuIndex, setMenuIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    pincode: "",
  });

  /* ---------------------------
     LOAD ADDRESSES
  ----------------------------*/
  const loadAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setAddresses(
        Array.isArray(data)
          ? data.map((a) => ({
              id: a.id,
              name: a.fullName,
              phone: a.phone,
              line1: a.house,
              city: a.city,
              pincode: a.pincode,
            }))
          : []
      );
    } catch {
      setAddresses([]);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  /* ---------------------------
     ADD / UPDATE ADDRESS
  ----------------------------*/
  const saveNewAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.line1) {
      return alert("Please fill all fields");
    }

    const payload = {
      fullName: newAddress.name,
      house: newAddress.line1,
      city: newAddress.city,
      pincode: newAddress.pincode,
      phone: newAddress.phone,
    };

    try {
      if (editIndex !== null) {
        await fetch(`http://localhost:5000/api/address/${addresses[editIndex].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:5000/api/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      setShowForm(false);
      setEditIndex(null);
      setNewAddress({
        name: "",
        phone: "",
        line1: "",
        city: "",
        pincode: "",
      });

      loadAddresses();
    } catch {
      alert("Failed to save address");
    }
  };

  /* ---------------------------
        DELETE ADDRESS
  ----------------------------*/
  const deleteAddress = async (id) => {
    if (!confirm("Delete this address?")) return;

    await fetch(`http://localhost:5000/api/address/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadAddresses();
  };

  /* ---------------------------
        PROCEED
  ----------------------------*/
  const proceed = () => {
    if (selected === null) {
      alert("Please select an address");
      return;
    }

    localStorage.setItem("checkoutAddress", JSON.stringify(addresses[selected]));
    navigate("/review");
  };

  return (
    <div className="address-wrapper">

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Select Delivery Address
      </motion.h2>

      {!showForm && (
        <motion.button
          className="primary-btn"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => setShowForm(true)}
        >
          + Add New Address
        </motion.button>
      )}

      {/* ADDRESS LIST */}
      <div className="address-list">
        {addresses.map((addr, idx) => (
          <motion.div
            key={addr.id}
            className={`address-card ${selected === idx ? "selected" : ""}`}
            whileHover={{ scale: 1.01 }}
          >
            {/* 3 DOT MENU */}
            <div
              className="address-menu"
              onClick={() => setMenuIndex(menuIndex === idx ? null : idx)}
            >
              ⋮
            </div>

            <AnimatePresence>
              {menuIndex === idx && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <p
                    onClick={() => {
                      setNewAddress({
                        name: addr.name,
                        phone: addr.phone,
                        line1: addr.line1,
                        city: addr.city,
                        pincode: addr.pincode,
                      });
                      setEditIndex(idx);
                      setShowForm(true);
                    }}
                  >
                    ✏ Edit
                  </p>

                  <p onClick={() => deleteAddress(addr.id)}>🗑 Delete</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SELECT ADDRESS */}
            <div onClick={() => setSelected(idx)}>
              <h4>{addr.name}</h4>
              <p>{addr.phone}</p>
              <p>{addr.line1}</p>
              <p>
                {addr.city} - {addr.pincode}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ADDRESS FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="address-form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <input
              placeholder="Full Name"
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            />
            <input
              placeholder="Phone"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            />
            <input
              placeholder="Address"
              value={newAddress.line1}
              onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
            />
            <input
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
            />

            <button className="primary-btn" onClick={saveNewAddress}>
              {editIndex !== null ? "Update Address" : "Save Address"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROCEED BUTTON */}
      {addresses.length > 0 && (
        <motion.button
          className="primary-btn deliver-btn"
          whileHover={{ scale: 1.03 }}
          onClick={proceed}
        >
          Deliver to this Address
        </motion.button>
      )}
    </div>
  );
}
