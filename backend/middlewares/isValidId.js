const { isValidObjectId } = require("mongoose");
const AppError = require("../utils/AppError");

module.exports = (paramName = "id") => {
  return (req, res, next) => {
    if (!isValidObjectId(req.params[paramName])) {
      throw new AppError(`Invalid ID format fot ${paramName}`, 400);
    }
    return next();
  };
};
