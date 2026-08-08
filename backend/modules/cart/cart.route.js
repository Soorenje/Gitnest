const express = require("express");
const cartController = require("./cart.controller");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router
  .route("/discount")
  .post(authMiddleware, cartController.applyDiscount)
  .delete(authMiddleware, cartController.removeDiscount);

router.route("/").get(authMiddleware, cartController.getCart);

router
  .route("/:courseId")
  .post(
    isValidIdMiddleware("courseId"),
    authMiddleware,
    cartController.addToCart,
  )
  .delete(
    isValidIdMiddleware("courseId"),
    authMiddleware,
    cartController.removeFromCart,
  );

module.exports = router;
