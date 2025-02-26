const express = require("express");
const couponController = require("../controllers/coupoonController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("admin","user"));
router
  .route("/")
  .get(couponController.getAllcoupons)
  .post(couponController.createcoupon);

router
  .route("/:id")
  .get(couponController.getcoupon)
  .patch(couponController.updatebcoupon)
  .delete(couponController.deletebcoupon);

module.exports = router;
