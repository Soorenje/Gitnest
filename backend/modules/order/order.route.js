const express = require("express");
const orderController = require("./order.controller");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router.route("/checkout").get(authMiddleware, orderController.checkout);

router
  .route("/verifyPayment")
  .get(authMiddleware, orderController.verifyPayment);

module.exports = router;
