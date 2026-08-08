const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

module.exports = (Model, paramName) => {
  return asyncHandler(async (req, res, next) => {
    const id = req.params[paramName];
    const user = req.user;

    const document = await Model.findById(id).populate("course");

    if (!document) {
      throw new AppError(`${Model.modelName} not found`, 404);
    }
    const isOwner = document.course.creator.toString() === user._id.toString();
    if (!isOwner && user.role !== "Instructor") {
      throw new AppError(
        "You don't have permission to perform this action",
        403,
      );
    }
    next();
  });
};
