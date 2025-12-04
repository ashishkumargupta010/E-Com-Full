import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";
import Product from "../models/productModel.js";
import sequelize from "../config/db.js";
import User from "../models/userModel.js";


/* =====================================================
   PLACE ORDER
===================================================== */
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

    // LOOP THROUGH ITEMS
    for (const it of items) {
      const product = await Product.findByPk(it.productId, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(400).json({
          message: `Product ${it.productId} not found`,
        });
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

      // REDUCE STOCK
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
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/* =====================================================
   USER: GET MY ORDERS  ⭐ FIXED PRODUCT INCLUDE
===================================================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "image"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET ORDER BY ID (also include product)
===================================================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   CANCEL ORDER
===================================================== */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending")
      return res.status(400).json({ message: "Cannot cancel now" });

    order.status = "Cancelled";
    order.cancelReason = req.body.reason || null;

    await order.save();

    res.json({ message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   RETURN REQUEST
===================================================== */
export const requestReturn = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Return Requested";
    order.returnReason = req.body.reason || null;
    await order.save();

    res.json({ message: "Return Requested" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   SUBMIT ITEM REVIEW
===================================================== */
export const submitItemReview = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.itemId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.review = {
      rating: req.body.rating,
      text: req.body.text,
      image: req.body.image || null,
      date: new Date(),
    };

    await item.save();

    res.json({ message: "Review added", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADMIN: LIST ALL ORDERS (WITH USER + PRODUCT)
===================================================== */
export const adminListOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "image"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("adminListOrders Error:", err);
    res.status(500).json({ message: err.message });
  }
};


/* =====================================================
   ADMIN UPDATE STATUS
===================================================== */
export const adminUpdateStatus = async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  order.status = req.body.status;
  await order.save();

  res.json({ message: "Status Updated" });
};
