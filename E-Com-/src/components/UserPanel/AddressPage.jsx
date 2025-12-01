import { useState, useEffect } from "react";
import "./address.css";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddressPage() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    line1: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  const token = localStorage.getItem("token");

  /* ---------------- LOAD ADDRESSES FROM BACKEND ---------------- */
  const loadAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAddresses(
          data.map((a) => ({
            id: a.id,
            name: a.fullName,
            line1: a.house,
            city: a.city,
            pincode: a.pincode,
            phone: a.phone,
          }))
        );
      } else {
        setAddresses([]);
      }
    } catch {
      setAddresses([]);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  /* ---------------- SAVE NEW ADDRESS TO BACKEND ---------------- */
  const saveAddress = async () => {
    if (!form.name || !form.line1 || !form.city || !form.pincode || !form.phone) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.name,
          house: form.line1,
          city: form.city,
          pincode: form.pincode,
          phone: form.phone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.address) {
        alert("Address Saved!");
        setForm({ name: "", line1: "", city: "", pincode: "", phone: "" });
        loadAddresses();
      } else {
        alert(data.message || "Failed to save address");
      }
    } catch {
      alert("Server error");
    }
  };

  /* ---------------- DELETE ADDRESS (BACKEND) ---------------- */
  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await fetch(`http://localhost:5000/api/address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAddresses();
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------------- SAVE EDITED ADDRESS (BACKEND) ---------------- */
  const saveEditedAddress = async () => {
    if (editIndex === null) return;

    const id = addresses[editIndex].id;

    if (!form.name || !form.line1 || !form.city || !form.pincode || !form.phone) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/address/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.name,
          house: form.line1,
          city: form.city,
          pincode: form.pincode,
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Address updated");
        setEditIndex(null);
        setForm({ name: "", line1: "", city: "", pincode: "", phone: "" });
        loadAddresses();
      } else {
        alert(data.message || "Update failed");
      }
    } catch {
      alert("Server error");
    }
  };

  /* ---------------- DELIVER HERE (SEND TO PAYMENT) ---------------- */
  const deliverHere = (addr) => {
    localStorage.setItem("checkoutAddress", JSON.stringify(addr));
    navigate("/payment");
  };

  return (
    <div className="address-wrapper">
      <h2>Manage Addresses</h2>

      {/* ADD ADDRESS FORM */}
      <div className="add-address-box">
        <h4>Add a New Address</h4>

        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Address Line"
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })}
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <input
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9]/g, "");
            if (val.length > 6) val = val.slice(0, 6);
            setForm({ ...form, pincode: val });
          }}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9]/g, "");
            if (val.length > 10) val = val.slice(0, 10);
            setForm({ ...form, phone: val });
          }}
        />

        <button onClick={saveAddress}>Save Address</button>
      </div>

      {/* ADDRESS LIST */}
      <div className="address-grid">
        {addresses.map((addr, i) => (
          <div key={i} className="address-card">
            <div
              className="card-menu"
              onClick={() => setMenuIndex(menuIndex === i ? null : i)}
            >
              <FiMoreVertical size={18} />
            </div>

            {menuIndex === i && (
              <div className="menu-options">
                <button
                  onClick={() => {
                    setEditIndex(i);
                    setForm(addr);
                    setMenuIndex(null);
                  }}
                >
                  Edit
                </button>

                <button onClick={() => deleteAddress(addr.id)}>Delete</button>
              </div>
            )}

            <h4>{addr.name}</h4>
            <p>{addr.line1}</p>
            <p>{addr.city}</p>
            <p><b>{addr.pincode}</b></p>
            <p>📞 {addr.phone}</p>

            <button className="deliver-here-btn" onClick={() => deliverHere(addr)}>
              Deliver Here
            </button>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editIndex !== null && (
        <div className="edit-modal">
          <div className="edit-modal-box">
            <h3>Edit Address</h3>

            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Address Line"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
            />

            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9]/g, "");
                if (val.length > 6) val = val.slice(0, 6);
                setForm({ ...form, pincode: val });
              }}
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9]/g, "");
                if (val.length > 10) val = val.slice(0, 10);
                setForm({ ...form, phone: val });
              }}
            />

            <button className="save-edit-btn" onClick={saveEditedAddress}>
              Save Changes
            </button>

            <button
              className="cancel-edit-btn"
              onClick={() => {
                setEditIndex(null);
                setForm({ name: "", line1: "", city: "", pincode: "", phone: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
