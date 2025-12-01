import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";
import Product from "../models/productModel.js";
import sequelize from "../config/db.js";

// =====================================================
// PLACE ORDER
// =====================================================
export const placeOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { items, address, paymentMethod, paymentResult, total } = req.body;

    if (!items || !items.length)
      return res.status(400).json({ message: "Cart empty" });

    // CREATE ORDER
    const order = await Order.create(
      {
        userId,
        address,
        paymentMethod,
        paymentResult: paymentResult || null,
        total,
        status: paymentMethod === "COD" ? "Pending" : "Paid",
        placedAt: new Date(),
      },
      { transaction: t }
    );

    // ORDER ITEMS LOOP
    for (const it of items) {
      const product = await Product.findByPk(it.productId, {
        transaction: t,
      });

      if (!product) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: `Product ${it.productId} not found` });
      }

      if (product.stock < it.quantity) {
        await t.rollback();
        return res.status(400).json({
          message: `Insufficient stock: ${product.name}`,
        });
      }

      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: it.quantity,
          size: it.size || null,
        },
        { transaction: t }
      );

      // DECREASE STOCK
      product.stock -= it.quantity;
      await product.save({ transaction: t });
    }

    await t.commit();

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
      order,
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

// =====================================================
// USER: GET MY ORDERS
// =====================================================

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem }],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// GET ORDER BY ID
// =====================================================

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem }],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// CANCEL ORDER
// =====================================================

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending")
      return res.status(400).json({ message: "Cannot cancel now" });

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// RETURN REQUEST
// =====================================================

export const requestReturn = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Return Requested";
    await order.save();

    res.json({ message: "Return Requested" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// REVIEW SUBMIT
// =====================================================

export const submitItemReview = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.itemId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.review = {
      rating: req.body.rating,
      text: req.body.text,
      date: new Date(),
    };

    await item.save();

    res.json({ message: "Review added", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// ADMIN ROUTES
// =====================================================

export const adminListOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [OrderItem],
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
};

export const adminUpdateStatus = async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  order.status = req.body.status;
  await order.save();

  res.json({ message: "Status Updated" });
};
