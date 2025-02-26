const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(userController.getAllUsers)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.resizeImage,
    userController.createUser
  );
router.route("/forgotPassword").post(authController.forgotPassword);

router
  .route("/verifyPasswordResetCode")
  .post(authController.verifyPasswordResetCode);

router.route("/resetPassword").patch(authController.resetPassword);

router
  .route("/getMe")
  .get(
    authController.protect,
    userController.getLogeduser,
    userController.getUser
  );
router
  .route("/updateMyPassword")
  .patch(authController.protect, userController.ensureActiveUser,userController.updateLoggedUserPassword);

router
  .route("/updateLoggedUserData")
  .patch(authController.protect, userController.updateLoggedUserData);

router
.route("/deleteLoggedUserData")
.delete(authController.protect, userController.deleteLoggedUserData);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.resizeImage,
    userController.updateUserData
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    userController.deleteUser
  );

router.route("/updateUserPassword/:id").patch(userController.updatePassword);
module.exports = router;
