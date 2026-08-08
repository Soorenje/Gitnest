const express = require("express");
const categoryController = require("./category.controller");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router
  .route("/:categoryId")
  .patch(
    isValidIdMiddleware("categoryId"),
    authMiddleware,
    isAdminMiddleware,
    categoryController.changeInfo,
  )
  .delete(
    isValidIdMiddleware("categoryId"),
    authMiddleware,
    isAdminMiddleware,
    categoryController.removeCategory,
  );

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(authMiddleware, isAdminMiddleware, categoryController.createCategory);

module.exports = router;
