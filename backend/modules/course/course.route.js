const express = require("express");
const courseController = require("./course.controller");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isInstructorMiddleware = require("./../../middlewares/isInstructor");
const isValidIdMiddleware = require("../../middlewares/isValidId");

const router = express.Router();

router
  .route("/admin/courses")
  .get(authMiddleware, isAdminMiddleware, courseController.getAdminCourses);

router
  .route("/admin/courses/:id/status")
  .patch(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    courseController.changeCourseStatus,
  );

router
  .route("/:courseId/curriculum")
  .get(
    isValidIdMiddleware("courseId"),
    authMiddleware,
    isInstructorMiddleware,
    courseController.getCourseCurriculum,
  );

router.route("/:id").get(isValidIdMiddleware(), courseController.getOne);
router
  .route("/instructor/courses")
  .get(
    authMiddleware,
    isInstructorMiddleware,
    courseController.getInstructorCourses,
  )
  .post(authMiddleware, isInstructorMiddleware, courseController.create);

router.route("/").get(courseController.getAll);

router
  .route("/upload/cover")
  .post(authMiddleware, isInstructorMiddleware, courseController.uploadCover);

module.exports = router;
