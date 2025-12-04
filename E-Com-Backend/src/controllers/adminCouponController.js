import Coupon from "../models/CouponModel.js";

// Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [["createdAt", "DESC"]] });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, minAmount } = req.body;

    if (!code || !discount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      minAmount: minAmount || 0,
    });

    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await coupon.destroy();
    res.json({ message: "Coupon deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
