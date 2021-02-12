const express = require("express");

const router = express.Router();

// middlewares

// controllers
const { userCart, getUserCart, emptyCart, saveAddress, applyCouponToUserCart, createOrder, orders, addToWishlist, wishlist, removeFromWishlist, createCashOrder } = require("../controllers/user");

router.post("/user/cart", userCart); // save cart
router.get("/user/cart", getUserCart); // get cart
router.delete("/user/cart", emptyCart); // empty cart
router.post("/user/address", saveAddress);
router.post("/user/cart/coupon", applyCouponToUserCart);
router.post("/user/order", createOrder);

router.get("/user/orders", orders);


router.post("/user/wishlist", addToWishlist);
router.get("/user/wishlist", wishlist);
router.put("/user/wishlist/:productId", removeFromWishlist);

router.post("/user/cash-order", createCashOrder)








// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;
