const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  const { user } = req;
  if (user.role === "Admin") {
    return next();
  }
  throw new AppError(
    "This route for admins and you can't have access to it",
    401,
  );
};
