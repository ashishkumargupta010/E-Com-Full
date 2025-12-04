import Coupon from "../models/CouponModel.js";

/* ============================================================
   GET ALL COUPONS  (Reusable for Admin & Public)
=============================================================== */
export const getCoupons = async (req = null, res = null) => {
  const list = await Coupon.findAll();

  if (res) return res.json(list);  // When called as an Express route

  return list; // When called internally
};

/* ============================================================
   PUBLIC: GET ONLY ACTIVE COUPONS
=============================================================== */
export const getActiveCoupons = async (req, res) => {
  try {
    const list = await Coupon.findAll({
      where: { isActive: true },
    });

    return res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Cannot load active coupons" });
  }
};

/* ============================================================
   ADMIN CREATE COUPON
=============================================================== */
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, minAmount } = req.body;

    const existing = await Coupon.findOne({
      where: { code: code.toUpperCase() }
    });

    if (existing) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      minAmount,
      isActive: true,
    });

    res.json({ message: "Coupon added", coupon });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   USER APPLY COUPON
=============================================================== */
export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({ message: "Missing coupon or amount" });
    }

    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon expired or invalid" });
    }

    if (amount < coupon.minAmount) {
      return res.status(400).json({
        message: `Minimum order ₹${coupon.minAmount} required`,
      });
    }

    const discountAmount = Math.round((amount * coupon.discount) / 100);

    res.json({
      success: true,
      discountAmount,
      discountPercent: coupon.discount,
      finalAmount: amount - discountAmount,
    });
  } catch (err) {
    console.log("Coupon Validation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   ADMIN DELETE COUPON
=============================================================== */
export const deleteCoupon = async (req, res) => {
  await Coupon.destroy({ where: { id: req.params.id } });
  res.json({ message: "Coupon deleted" });
};

/* ============================================================
   ADMIN: DEACTIVATE COUPON (Optional Future Feature)
=============================================================== */
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({ message: "Coupon updated", status: coupon.isActive });
  } catch (err) {
    res.status(500).json({ message: "Error updating coupon" });
  }
};
