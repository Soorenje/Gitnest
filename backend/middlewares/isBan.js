const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  const { user } = req;
  if (user.ban === true) {
    throw new AppError("Your account has banned", 402);
  }
  return next();
};
