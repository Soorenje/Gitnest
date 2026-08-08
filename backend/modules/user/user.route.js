const userController = require("./user.controller");
const express = require("express");
const authMiddleware = require("./../../middlewares/auth");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isInstructorMiddleware = require("./../../middlewares/isInstructor");
const isValidIdMiddleware = require("./../../middlewares/isValidId");
const imageUploadMiddleware = require("./../../middlewares/imageUpload");

const router = express.Router();

router
  .route("/admin/users/:id/role")
  .patch(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    userController.changeRole,
  );

router
  .route("/admin/users/:id/ban")
  .patch(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    userController.banUser,
  );

router
  .route("/admin/users/:id")
  .patch(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    userController.editUser,
  )
  .delete(
    isValidIdMiddleware(),
    authMiddleware,
    isAdminMiddleware,
    userController.removeUser,
  );

router
  .route("/:id")
  .patch(isValidIdMiddleware(), authMiddleware, userController.changeInfo);

router
  .route("/admin/users")
  .get(authMiddleware, isAdminMiddleware, userController.getAll)
  .post(authMiddleware, isAdminMiddleware, userController.createUser);

router
  .route("/upload/avatar")
  .post(authMiddleware, userController.uploadAvatar);

router
  .route("/instructor/student")
  .get(
    authMiddleware,
    isInstructorMiddleware,
    userController.getInstructorStudents,
  )

module.exports = router;
