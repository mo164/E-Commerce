const express = require("express");
const authController = require("./../controllers/authController");
const cartController = require("./../controllers/cartController");
const router = express.Router();

router
  .route("/")
  .post(authController.protect, cartController.addProductToCart)
  .get(authController.protect, cartController.getLoggedUserCart)
  .delete(authController.protect, cartController.clearCart);
router
  .route("/:removeitem")
  .delete(authController.protect, cartController.deleteSpecificCartItem);

router
  .route("/applycoupon")
  .patch(authController.protect, cartController.apllyCoupon);

router
  .route("/:itemId")
  .patch(authController.protect, cartController.upadateCartItemQuantity);

// router
// .route("/:productId")
// .patch(authController.protect, cartController.decreaseQuantity)
module.exports = router;
