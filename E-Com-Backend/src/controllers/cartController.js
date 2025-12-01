import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// ADD TO CART
export const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, size = null } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId required" });

    const existing = await Cart.findOne({
      where: { userId, productId, size },
    });

    if (existing) {
      existing.quantity += parseInt(quantity);
      await existing.save();
      return res.json({ message: "Cart updated", item: existing });
    }

    const item = await Cart.create({ userId, productId, quantity, size });
    res.status(201).json({ message: "Added to cart", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER CART
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "image"],
        },
      ],
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CART ITEM
export const updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity, size } = req.body;

    const item = await Cart.findByPk(id);

    if (!item) return res.status(404).json({ message: "Cart item not found" });
    if (item.userId !== userId)
      return res.status(403).json({ message: "Not authorized" });

    if (quantity !== undefined) item.quantity = parseInt(quantity);
    if (size !== undefined) item.size = size;

    await item.save();
    res.json({ message: "Cart item updated", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE ITEM
export const deleteItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const item = await Cart.findByPk(id);

    if (!item) return res.status(404).json({ message: "Cart item not found" });
    if (item.userId !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await item.destroy();
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CLEAR WHOLE CART AFTER ORDER SUCCESS
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({
      where: { userId },
    });

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
