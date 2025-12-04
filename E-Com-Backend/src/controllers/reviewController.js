import Review from "../models/reviewModel.js";
import OrderItem from "../models/orderItemModel.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, imageUrl } = req.body;

    // User must have purchased product (Flipkart rule)
    const purchased = await OrderItem.findOne({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (!purchased) {
      return res.status(403).json({ message: "Buy product before reviewing." });
    }

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      comment,
      imageUrl,
    });

    res.json(review);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: Product, as: "product" }, { model: User, as: "user" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [{ model: User, as: "user" }, { model: Product, as: "product" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReviewAdmin = async (req, res) => {
  try {
    await Review.destroy({ where: { id: req.params.id } });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
