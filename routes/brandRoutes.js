const express = require("express");
const brandController = require("../controllers/brandController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(brandController.getAllBrands)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    brandController.createBrand
  );

router
  .route("/:id")
  .get(brandController.getBrand)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    brandController.updatebBrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    brandController.deletebBrand
  );

module.exports = router;
