import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";
import User from "../models/userModel.js";

export const getAllReviews = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
        },
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "phone"],
        },
      ],
    });

    const reviews = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.review) {
          reviews.push({
            id: order.id,
            product: item.name,
            image: item.image || "",
            rating: item.review.rating,
            text: item.review.text,
            date: item.review.date,
            reviewImg: item.review.image || null,
            user: order.user?.name || "Unknown User",
            userPhone: order.user?.phone || "",
          });
        }
      });
    });

    res.json(reviews);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
