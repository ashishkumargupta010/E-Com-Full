import { useState, useEffect } from "react";
import "./address.css";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddressPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [addresses, setAddresses] = useState([]);
  const [menuIndex, setMenuIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    line1: "",
    city: "",
    pincode: "",
    phone: "",
  });

  /* CLOSE MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const closeMenu = () => setMenuIndex(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  /* LOAD FROM BACKEND */
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

  /* VALIDATION */
  const isValid = () => {
    if (!form.name || !form.line1 || !form.city || !form.pincode || !form.phone) {
      alert("All fields required");
      return false;
    }
    if (form.pincode.length !== 6) return alert("Pincode must be 6 digits");
    if (form.phone.length !== 10) return alert("Phone must be 10 digits");
    return true;
  };

  /* SAVE NEW ADDRESS */
  const saveAddress = async () => {
    if (!isValid()) return;

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

      if (res.ok) {
        alert("Address added!");
        setShowAddModal(false);
        setForm({ name: "", line1: "", city: "", pincode: "", phone: "" });
        loadAddresses();
      }
    } catch {
      alert("Server Error");
    }
  };

  /* DELETE */
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

  /* UPDATE */
  const saveEditedAddress = async () => {
    if (editIndex === null || !isValid()) return;

    const id = addresses[editIndex].id;

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

      if (res.ok) {
        alert("Address updated!");
        setEditIndex(null);
        setForm({ name: "", line1: "", city: "", pincode: "", phone: "" });
        loadAddresses();
      }
    } catch {
      alert("Server error");
    }
  };

  /* CHECKOUT ADDRESS */
  const deliverHere = (addr) => {
    localStorage.setItem("checkoutAddress", JSON.stringify(addr));
    navigate("/payment");
  };

  return (
    <div className="address-wrapper">
      <h2>Your Saved Addresses</h2>

      {/* ADD NEW ADDRESS BAR */}
      <div className="add-address-box" onClick={() => setShowAddModal(true)}>
        <h4>+ Add a New Address</h4>
      </div>

      {/* ADDRESS LIST */}
      <div className="address-list">
        {addresses.map((addr, index) => (
          <div key={index} className="address-card">

            {/* LEFT SIDE */}
            <div className="address-left">
              <h4>{addr.name}</h4>
              <p>{addr.line1}</p>
              <p>{addr.city}</p>
              <p><b>{addr.pincode}</b></p>
              <p>📞 {addr.phone}</p>
            </div>

            {/* RIGHT SIDE SECTION (3-dot + Deliver button) */}
            <div className="address-actions">

              {/* 3 DOTS */}
              <div
                className="card-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuIndex(menuIndex === index ? null : index);
                }}
              >
                <FiMoreVertical size={20} />
              </div>

              {/* DROPDOWN */}
              {menuIndex === index && (
                <div className="menu-options">
                  <button
                    onClick={() => {
                      setEditIndex(index);
                      setForm(addr);
                      setMenuIndex(null);
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => deleteAddress(addr.id)}>Delete</button>
                </div>
              )}

              {/* DELIVER BUTTON ONLY ON CHECKOUT PAGE */}
              {window.location.pathname.includes("checkout") && (
                <button
                  className="deliver-here-btn"
                  onClick={() => deliverHere(addr)}
                >
                  Deliver Here
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW ADDRESS POPUP */}
      {showAddModal && (
        <div className="edit-modal">
          <div className="edit-modal-box">
            <h3>Add New Address</h3>

            {["name", "line1", "city", "pincode", "phone"].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={form[field]}
                onChange={(e) => {
                  let val = e.target.value;
                  if (field === "pincode") val = val.replace(/\D/g, "").slice(0, 6);
                  if (field === "phone") val = val.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, [field]: val });
                }}
              />
            ))}

            <button className="save-edit-btn" onClick={saveAddress}>Save Address</button>
            <button
              className="cancel-edit-btn"
              onClick={() => {
                setShowAddModal(false);
                setForm({ name: "", line1: "", city: "", pincode: "", phone: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EDIT ADDRESS POPUP */}
      {editIndex !== null && (
        <div className="edit-modal">
          <div className="edit-modal-box">
            <h3>Edit Address</h3>

            {["name", "line1", "city", "pincode", "phone"].map((field) => (
              <input
                key={field}
                value={form[field]}
                onChange={(e) => {
                  let val = e.target.value;
                  if (field === "pincode") val = val.replace(/\D/g, "").slice(0, 6);
                  if (field === "phone") val = val.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, [field]: val });
                }}
              />
            ))}

            <button className="save-edit-btn" onClick={saveEditedAddress}>Save Changes</button>
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
