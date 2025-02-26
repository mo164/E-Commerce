const express = require("express");
const categoryController = require("../controllers/categoryController");
const subCategoriesRoutes = require("./subCategoryRoutes");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.addCategoryImage,
    categoryController.resizeImage,
    categoryController.createCategory
  );

router.use("/:categoryId/subCategories", subCategoriesRoutes);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.addCategoryImage,
    categoryController.resizeImage,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.deleteCategory
  );

module.exports = router;
