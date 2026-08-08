const express = require("express");
const newsletterController = require("./newsletter.controller");
const authMiddleware = require("./../../middlewares/auth");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router.route("/history").get(authMiddleware, newsletterController.getHistory);

router.route("/draft").post(authMiddleware, newsletterController.saveDraft);

router.route("/send").post(authMiddleware, newsletterController.sendNewsletter);

module.exports = router;
