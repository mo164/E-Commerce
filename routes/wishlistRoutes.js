const express = require("express");
const authController = require("../controllers/authController");
const wishlistController = require("../controllers/wishlistController");
const router = express.Router();
router.use(authController.protect,authController.allowedTo("user"))
router
  .route("/")
  .post( wishlistController.addProductToWishlist)
  .get( wishlistController.getLoggedUserWishlist)
router
  .route("/:productId")
  .delete( wishlistController.removeProductFromWishlist);

module.exports = router;
