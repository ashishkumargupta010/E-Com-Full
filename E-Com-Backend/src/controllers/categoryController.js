import Category from "../models/categoryModel.js";

export const getCategories = async (req, res) => {
  const data = await Category.findAll();
  res.json(data);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });

  const exists = await Category.findOne({ where: { name }});
  if (exists) return res.status(400).json({ message: "Category exists" });

  const item = await Category.create({ name });
  res.json({ message: "Category Added", item });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const c = await Category.findByPk(id);
  if (!c) return res.status(404).json({ message: "Not Found" });

  await c.destroy();
  res.json({ message: "Category deleted" });
};
