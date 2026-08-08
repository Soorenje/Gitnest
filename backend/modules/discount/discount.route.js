const express = require("express");
const discountController = require("./discount.controller");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isAdminMiddleware, discountController.getAll)
  .post(authMiddleware, isAdminMiddleware, discountController.createDiscount);

router
  .route("/:discountId")
  .delete(
    isValidIdMiddleware("discountId"),
    authMiddleware,
    isAdminMiddleware,
    discountController.removeDiscount,
  );

module.exports = router;
