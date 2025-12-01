import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { Op } from "sequelize";

// ⭐ GET ALL PRODUCTS + Search + Filter
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (category) {
      const cat = await Category.findOne({ where: { name: category } });
      if (cat) where.categoryId = cat.id;
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category }],
      order: [["createdAt", "DESC"]],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ GET ONE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Not Found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ CREATE PRODUCT (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, price, image, description, stock, categoryId } = req.body;

    if (!name || !price || !categoryId)
      return res.status(400).json({ message: "Required fields missing" });

    const product = await Product.create({
      name,
      price,
      image,
      description,
      stock,
      categoryId,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ===============================================
// ⭐ GET TRENDING PRODUCTS
// ===============================================

export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isTrending: true },  // add column in model
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================================
// ⭐ TOGGLE TRENDING STATUS (ADMIN ONLY)
// ===============================================

export const toggleTrending = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isTrending = !product.isTrending; // flip true/false
    await product.save();

    res.json({
      message: `Trending set to ${product.isTrending}`,
      product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ⭐ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });

    await p.update(req.body);
    res.json({ message: "Updated", product: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });

    await p.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
