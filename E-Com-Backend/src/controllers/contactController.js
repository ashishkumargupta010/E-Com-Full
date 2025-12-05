import Contact from "../models/contactModel.js";

/* ======================================================
   USER → Submit Contact Form
====================================================== */
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const saved = await Contact.create({
      name,
      email,
      message,
      status: "pending", // default
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: saved,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ======================================================
   ADMIN → Fetch All Messages
====================================================== */
export const getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ======================================================
   ADMIN → Update Status (Pending ↔ Resolved)
   (Yellow → Green / Green → Yellow)
====================================================== */
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;  
    const { status } = req.body;  

    if (!["pending", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const message = await Contact.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.status = status;
    await message.save();

    return res.json({
      success: true,
      message: "Status updated successfully",
      data: message,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
