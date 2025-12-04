import express from "express";
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/CouponController.js";

const router = express.Router();

/*
----------------------------------------
 PUBLIC ROUTE → USERS CAN VIEW ACTIVE COUPONS
----------------------------------------
*/
router.get("/all", async (req, res) => {
  try {
    const list = await getCoupons();  // returns array
    return res.json(list);            // send JSON
  } catch (err) {
    return res.status(500).json({ message: "Cannot load coupons" });
  }
});

/*
----------------------------------------
 ADMIN ROUTES (Require Admin Token)
----------------------------------------
*/
router.get("/", getCoupons);        
router.post("/", createCoupon);     
router.delete("/:id", deleteCoupon);

/*
----------------------------------------
 USER APPLY COUPON
----------------------------------------
*/
router.post("/apply", validateCoupon);

export default router;
