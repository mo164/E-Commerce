const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
const router = express.Router();

router
  .route("/:cartId")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    orderController.createCashOrder
  );

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("user", "admin"),
    orderController.getAllOrders
  );

router
  .route("/:id")
  .get(authController.protect, orderController.getSpecificOrder);

router
  .route("/:id/pay")
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    orderController.updateOrderToPaid
  );
router.get(
  "/checkout-session/:cartId",
  authController.protect,
  authController.allowedTo("user"),
  orderController.checkoutSession
);

router
  .route("/:id/deliver")
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    orderController.updateOrderToDelivered
  );

module.exports = router;
