import { useEffect, useState } from "react";
import "./SelectAddress.css";
import { useNavigate } from "react-router-dom";

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
     LOAD ADDRESSES FROM BACKEND
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
    } catch (err) {
      console.log("Address load error:", err);
      setAddresses([]);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  /* ---------------------------
      SAVE OR UPDATE ADDRESS
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
        // update
        const id = addresses[editIndex].id;

        await fetch(`http://localhost:5000/api/address/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // add new
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
    } catch (err) {
      alert("Failed to save address");
    }
  };

  /* ---------------------------
        DELETE ADDRESS
  ----------------------------*/
  const deleteAddress = async (id) => {
    if (!confirm("Delete this address?")) return;

    try {
      await fetch(`http://localhost:5000/api/address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      loadAddresses();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ---------------------------
      PROCEED WITH SELECTED ADDRESS
  ----------------------------*/
  const proceed = () => {
    if (selected === null) {
      alert("Please select an address");
      return;
    }

    localStorage.setItem("checkoutAddress", JSON.stringify(addresses[selected]));

    navigate("/payment", { replace: true });
  };

  return (
    <div className="address-wrapper">

      <h2>Select Delivery Address</h2>

      {/* ADD ADDRESS BUTTON */}
      {!showForm && (
        <button className="primary-btn" onClick={() => setShowForm(true)}>
          + Add New Address
        </button>
      )}

      {/* ADDRESS LIST */}
      <div className="address-list">
        {addresses.map((addr, idx) => (
          <div
            key={addr.id}
            className={`address-card ${selected === idx ? "selected" : ""}`}
          >
            {/* THREE DOT MENU */}
            <div
              className="address-menu"
              onClick={() => setMenuIndex(menuIndex === idx ? null : idx)}
            >
              ⋮
            </div>

            {menuIndex === idx && (
              <div className="dropdown-menu">
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
              </div>
            )}

            {/* ADDRESS DETAILS */}
            <div onClick={() => setSelected(idx)}>
              <h4>{addr.name}</h4>
              <p>{addr.phone}</p>
              <p>{addr.line1}</p>
              <p>
                {addr.city} - {addr.pincode}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ADDRESS FORM */}
      {showForm && (
        <div className="address-form">
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
            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
          />

          <button className="primary-btn" onClick={saveNewAddress}>
            {editIndex !== null ? "Update Address" : "Save Address"}
          </button>
        </div>
      )}

      {/* PROCEED BUTTON */}
      {addresses.length > 0 && (
        <button className="primary-btn deliver-btn" onClick={proceed}>
          Deliver to this Address
        </button>
      )}
    </div>
  );
}
