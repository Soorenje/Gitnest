const jwt = require("jsonwebtoken");
const userModel = require("./../modules/user/user.model");
const AppError = require("../utils/AppError");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies["Access-Token"];
    if (!token) {
      throw new AppError("Token is not found", 403);
    }
    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);
    const findUser = await userModel.findOne({ email: jwtPayload.email });
    req.user = findUser;
    return next();
  } catch (error) {
    throw new AppError(`${error.message}`, 401);
  }
};
