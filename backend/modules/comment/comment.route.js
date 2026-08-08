const express = require("express");
const commentController = require("./comment.controller");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router
  .route("/admin/comments")
  .get(
    authMiddleware,
    isAdminMiddleware,
    commentController.getAllAdminComments,
  );

router
  .route("/:id/accept")
  .patch(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    commentController.accept,
  );

router
  .route("/:id/answer")
  .post(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    commentController.answer,
  );

router
  .route("/course/:courseId")
  .get(isValidIdMiddleware("courseId"), commentController.getCourseComments);

router
  .route("/:id")
  .delete(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    commentController.remove,
  );

router.route("/").post(authMiddleware, commentController.create);

module.exports = router;
