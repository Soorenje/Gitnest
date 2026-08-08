const express = require("express");
const authController = require("./auth.controller");
const authMiddlewares = require("./../../middlewares/auth");
const isBanMiddlewares = require("./../../middlewares/isBan");

const router = express.Router();

router.route("/register").post(authController.register);

router.route("/login").post(authController.login);

router
  .route("/me")
  .get(authMiddlewares, isBanMiddlewares, authController.getMe);

router.route("/refresh-token").post(authController.refreshToken);

router.route("/logout").post(authMiddlewares, authController.logout);

router
  .route("/changePassword")
  .post(authMiddlewares, authController.changePassword);

module.exports = router;
