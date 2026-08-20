const express = require("express");
const examController = require("./exam.controller");
const authMiddleware = require("./../../middlewares/auth");
const isInstructorMiddleware = require("./../../middlewares/isInstructor");
const isValidIdMiddleware = require("../../middlewares/isValidId");
const checkOwnershipMiddleware = require("../../middlewares/checkOwnership");

const router = express.Router();

router
  .route("/")
  .get(examController.getExams) 
  .post(authMiddleware, isInstructorMiddleware, examController.createExam);

router
  .route("/course/:courseId")
  .get(
    isValidIdMiddleware("courseId"),
    authMiddleware,
    isInstructorMiddleware,
    examController.getCourseExams,
  );

router
  .route("/start/:examId")
  .get(
    isValidIdMiddleware("examId"),
    authMiddleware,
    examController.getExamForStudent,
  );

router
  .route("/:examId")
  .get(
    isValidIdMiddleware("examId"),
    authMiddleware,
    examController.getExamWithQuestions,
  )
  .patch(
    isValidIdMiddleware("examId"),
    authMiddleware,
    isInstructorMiddleware,
    examController.updateExam,
  )
  .delete(
    isValidIdMiddleware("examId"),
    authMiddleware,
    isInstructorMiddleware,
    examController.deleteExam,
  );

router
  .route("/:examId/questions")
  .post(
    isValidIdMiddleware("examId"),
    authMiddleware,
    isInstructorMiddleware,
    examController.addQuestionToExam,
  );

module.exports = router;
