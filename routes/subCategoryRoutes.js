const express = require("express");
const subCategoryController = require("../controllers/subCategoryControllers");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(subCategoryController.getAllCategories)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    subCategoryController.createSubCategory
  );

router
  .route("/:id")
  .get(subCategoryController.getSubCategory)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    subCategoryController.updateSubCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    subCategoryController.deleteSubCategory
  );
module.exports = router;
