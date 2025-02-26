const express = require("express");
const reviewsController = require("../controllers/reviewsController");
const authController = require("../controllers/authController");
const router = express.Router({mergeParams:true});

router
  .route("/")
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.allowedTo("user"),
    reviewsController.createReview
  )
  .delete(
    authController.protect,
    authController.allowedTo("user", "admin"),
    reviewsController.deleteAllReviews
  );

router
  .route("/:id")

  .get(reviewsController.getReview)
  .patch(
    authController.protect,
    authController.allowedTo("user"),
    reviewsController.updateReview
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin", "user"),
    reviewsController.deleteReview
  );

module.exports = router;
