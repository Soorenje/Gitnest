const userModel = require("./user.model");
const courseModel = require("./../course/course.model");
const imageUploadMiddleware = require("./../../middlewares/imageUpload");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");

exports.getAll = asyncHandler(async (req, res) => {
  const { role } = req.query;
  let query = {};

  if (role && role !== "all") {
    query.role = role;
  }

  const users = await userModel.find(query);
  return res.status(200).json({
    success: true,
    data: users,
  });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { name, username, phone, email, role, password } = req.body;

  const doesUserExist = await userModel.findOne({
    $or: [{ phone }, { email }],
  });
  if (doesUserExist) {
    throw new AppError("This email or phone is already registered", 409);
  }

  const isUsernameTaken = await userModel.findOne({ username });
  if (isUsernameTaken) {
    throw new AppError("This username is already taken", 409);
  }

  const addUser = await userModel.create({
    name,
    username,
    phone,
    email,
    role,
    password,
  });

  return res.status(201).json({
    success: true,
    message: `${role || "User"} added successfully`,
  });
});

exports.editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, username, role } = req.body;

  const changeInfo = await userModel.findByIdAndUpdate(
    id,
    { name, username, role },
    { returnDocument: "after", runValidators: true },
  );

  if (!changeInfo) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});

exports.removeUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const remove = await userModel.findByIdAndDelete(id);

  if (!remove) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "User removed successfully",
  });
});

exports.changeRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.query;

  if (!role) {
    throw new AppError("Please provide a role in query", 400);
  }

  const changeUser = await userModel.findByIdAndUpdate(
    id,
    { role },
    { returnDocument: "after" },
  );

  if (!changeUser) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "User role changed successfully",
  });
});

exports.banUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userBanned = await userModel.findByIdAndUpdate(
    id,
    { ban: true },
    { returnDocument: "after" },
  );

  if (!userBanned) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "User banned successfully",
  });
});

exports.changeInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const body = req.body;

  const updateData = {};

  if (body.username) updateData.username = body.username;
  if (body.avatar) updateData.avatar = body.avatar;

  if (user.role === "Admin" || user.role === "User") {
    if (body.phone) updateData.phone = body.phone;
  }

  if (user.role === "Instructor") {
    if (body.specialty !== undefined) {
      updateData["instructorInfo.specialty"] = body.specialty;
    }
    if (body.bio !== undefined) {
      updateData["instructorInfo.bio"] = body.bio;
    }
  }

  const updateInfo = await userModel.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
  });

  if (!updateInfo) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "User info updated successfully",
  });
});

exports.getInstructorStudents = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const instructorCourses = await courseModel.find(
    { creator: instructorId },
    "_id",
  );
  const courseIds = instructorCourses.map((course) => course._id);

  if (courseIds.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  }

  const students = await userModel
    .find({
      courses: { $in: courseIds },
    })
    .select("name username email phone avatar courses createdAt")
    .populate({
      path: "courses",
      select: "name cover price discountedPrice",
      match: { _id: { $in: courseIds } },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

exports.uploadAvatar = (req, res, next) => {
  const upload = imageUploadMiddleware.single("avatar");

  upload(req, res, (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }

    if (!req.file) {
      return next(new AppError("No file provided.", 400));
    }

    const avatarUrl = req.file.path;

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl,
    });
  });
};
