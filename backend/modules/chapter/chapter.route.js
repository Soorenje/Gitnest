const express = require("express");
const chapterController = require("./chapter.controller");
const authMiddleware = require("./../../middlewares/auth");
const isInstructorMiddleware = require("./../../middlewares/isInstructor");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router
  .route("/course/:courseId")
  .post(
    isValidIdMiddleware("courseId"),
    authMiddleware,
    isInstructorMiddleware,
    chapterController.createChapter,
  );

router
  .route("/course/:courseId/reorder")
  .patch(
    isValidIdMiddleware("courseId"),
    authMiddleware,
    isInstructorMiddleware,
    chapterController.reorderChapters,
  );

router
  .route("/:id")
  .delete(
    isValidIdMiddleware(),
    authMiddleware,
    isInstructorMiddleware,
    chapterController.removeChapter,
  );

module.exports = router;
