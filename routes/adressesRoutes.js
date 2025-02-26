const express = require("express");
const authController = require("../controllers/authController");
const adressesController = require("../controllers/adressesController");
const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));

router
  .route("/")
  .post(adressesController.addAddress)
  .get(adressesController.getLoggedUserAddresses);

router.route("/:addressId")
.delete(adressesController.removeAddress);

module.exports = router;
