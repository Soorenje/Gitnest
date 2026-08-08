const express = require("express");
const lessonController = require("./lesson.controller");
const lessonModel = require("./lesson.model")
const authMiddleware = require("./../../middlewares/auth");
const isInstructorMiddleware = require("./../../middlewares/isInstructor");
const isValidIdMiddleware = require("../../middlewares/isValidId");
const checkOwnershipMiddleware = require("../../middlewares/checkOwnership");

const router = express.Router();

router
  .route("/chapter/:chapterId")
  .post(
    isValidIdMiddleware("chapterId"),
    authMiddleware,
    isInstructorMiddleware,
    lessonController.createLesson,
  );

router
  .route("/chapter/:chapterId/reorder")
  .patch(
    isValidIdMiddleware("chapterId"),
    authMiddleware,
    isInstructorMiddleware,
    lessonController.reorderLessons,
  );

router
  .route("/:lessonId")
  .patch(
    isValidIdMiddleware("lessonId"),
    authMiddleware,
    isInstructorMiddleware,
    checkOwnershipMiddleware(lessonModel , "lessonId"),
    lessonController.updateLesson,
  )
  .delete(
    isValidIdMiddleware("lessonId"),
    authMiddleware,
    isInstructorMiddleware,
    checkOwnershipMiddleware(lessonModel , "lessonId"),
    lessonController.removeLesson,
  );

router
  .route("/upload/file")
  .post(authMiddleware, isInstructorMiddleware, lessonController.uploadFile);

module.exports = router;
