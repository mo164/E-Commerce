const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/signUp").post(authController.signUp);

router.route("/login").get(authController.login);
// router
//   .route("/:id")
//   .get(userController.getUser)
//   .patch(
//     userController.uploadUserImage,
//     userController.resizeImage,
//     userController.updateUserData
//   )
//   .delete(userController.deleteUser);

// router.route("/updateUserPassword/:id").patch(userController.updatePassword);
module.exports = router;
