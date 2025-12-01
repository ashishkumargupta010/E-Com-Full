import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// Get all users
export const adminGetUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] }
  });
  res.json(users);
};

// Add product
export const adminAddProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
export const adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    await product.update(req.body);
    res.json({ message: "Product updated", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
export const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    await product.destroy();
    res.json({ message: "Product deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
