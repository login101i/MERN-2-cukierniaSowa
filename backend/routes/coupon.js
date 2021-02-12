const express = require("express");
const router = express.Router();

// middlewares
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

// controller
const { create, remove, list } = require("../controllers/coupon");

// routes
router.post("/coupon",  create);
router.get("/coupons", list);
router.delete("/coupon/:couponId", remove);

module.exports = router;
