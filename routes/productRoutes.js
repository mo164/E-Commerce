const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const reviewsRoute = require("./reviewsRoutes");
const ReviewsController = require("../controllers/reviewsController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, productController.getAllProudcts)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    productController.UploadProductImages,
    productController.resizeAll,
    productController.createProudct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    productController.deleteAllProudcts
  );

// {{URL}}/api/products/674624ec579e0e05293146f5/reviews
router
  .route("/:productId/reviews")
  .get(ReviewsController.getAllReviewsOnAProduct)
  .post( authController.protect,ReviewsController.set,ReviewsController.createReview)

router
  .route("/:id")
  .get(productController.getProudct)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    productController.updateProudct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    productController.deleteProudct
  );

module.exports = router;
