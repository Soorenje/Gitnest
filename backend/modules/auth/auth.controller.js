const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./../user/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./../../utils/token");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");

const ONE_DAY = 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

exports.register = asyncHandler(async (req, res) => {
  const { name, username, phone, email, password } = req.body;

  const repeatedUser = await userModel
    .findOne({
      $or: [{ email }, { phone }],
    })
    .lean();

  if (repeatedUser) {
    throw new AppError("Email or phone number already exists", 409);
  }

  const usernameExist = await userModel.findOne({ username }).lean();
  if (usernameExist) {
    throw new AppError("Username is already taken", 409);
  }

  const userCount = await userModel.countDocuments();
  const create = await userModel.create({
    name,
    username,
    phone,
    email,
    role: userCount > 0 ? "User" : "Admin",
    password,
  });

  return res.status(201).json({
    success: true,
    message: "User added successfully",
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const isUserExists = await userModel
    .findOne({ $or: [{ email: identifier }, { phone: identifier }] })
    .select("+password");

  if (!isUserExists) {
    throw new AppError("User not found", 404);
  }

  if (isUserExists.ban === true) {
    throw new AppError("Your account has been banned", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExists.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }

  const accessToken = generateAccessToken(isUserExists.email);
  const refreshToken = generateRefreshToken(isUserExists.email);

  await userModel.findByIdAndUpdate(isUserExists._id, {
    refreshToken,
  });

  res.cookie("Access-Token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: ONE_DAY,
  });
  res.cookie("Refresh-Token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: SEVEN_DAYS,
  });

  return res.status(200).json({
    success: true,
    message: "Login successfully",
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("courses");

  return res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      courses: user.courses,
      role: user.role,
      avatar: user.avatar,
      instructorInfo: user.instructorInfo,
    },
  });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies["Refresh-Token"];

  if (!refreshToken) {
    throw new AppError("Refresh token not found", 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const findUser = await userModel.findOne({ refreshToken });

    if (!findUser) {
      throw new AppError("User not found", 401);
    }

    if (findUser.ban === true) {
      throw new AppError("Your account has been banned", 403);
    }

    const newAccessToken = generateAccessToken(findUser.email);
    res.cookie("Access-Token", newAccessToken, { httpOnly: true });

    return res.status(200).json({
      success: true,
      message: "AccessToken added successfully",
    });
  } catch (error) {
    throw new AppError("Refresh token is expired or invalid", 401);
  }
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("Access-Token");
  res.clearCookie("Refresh-Token");

  await userModel.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: "" },
  });

  return res.json({
    success: true,
    message: "Logout successfully",
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;
  const { user } = req;

  const findUser = await userModel.findById(user._id);

  const isPasswordValid = await bcrypt.compare(password, findUser.password);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }

  const newPasswordHashed = await bcrypt.hash(newPassword, 12);
  const updateUser = await userModel.findByIdAndUpdate(user._id, {
    password: newPasswordHashed,
  });
  if (!updateUser) {
    throw new AppError("User not found", 404);
  }
  return res.json({
    success: true,
    message: "Password changed successfully",
  });
});
