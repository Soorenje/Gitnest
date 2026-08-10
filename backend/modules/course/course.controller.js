const courseModel = require("./course.model");
const chapterModel = require("./../chapter/chapter.model");
require("./../lesson/lesson.model");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");
const imageUploadMiddleware = require("./../../middlewares/imageUpload");

exports.getAll = asyncHandler(async (req, res) => {
  const { limit, sort, category, isFree } = req.query;
  const filterQuery = { status: "Approved" };

  if (category) {
    filterQuery.category = category;
  }

  if (isFree === "true") {
    filterQuery.price = 0;
  }

  let sortQuery = {};
  switch (sort) {
    case "newest":
      sortQuery = { createdAt: -1 };
      break;
    case "updated":
      sortQuery = { updatedAt: -1 };
      break;
    case "popular":
      sortQuery = { studentsCount: -1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
      break;
  }

  const courses = await courseModel
    .find(filterQuery)
    .populate("creator", "username")
    .sort(sortQuery)
    .limit(parseInt(limit) || 0);

  return res.status(200).json({
    success: true,
    data: courses
  });
});

exports.getInstructorCourses = asyncHandler(async (req, res) => {
  const { user } = req;

  const courses = await courseModel
    .find({ creator: user._id })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: courses,
  });
});

exports.create = asyncHandler(async (req, res) => {
  const { user } = req;
  const {
    name,
    shortDescription,
    description,
    cover,
    support,
    href,
    price,
    categoryID,
  } = req.body;

  const duplicateHref = await courseModel.findOne({ href });
  if (duplicateHref) {
    throw new AppError("Href already exists", 409);
  }

  const addCourse = await courseModel.create({
    name,
    shortDescription,
    description,
    cover,
    support,
    href,
    price,
    categoryID,
    creator: user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Course added successfully",
    data: addCourse,
  });
});

exports.getOne = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await courseModel
    .findById(id)
    .populate("creator", "username")
    .populate({
      path: "chapters",
      populate: {
        path: "lessons",
      },
    });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return res.status(200).json({
    success: true,
    data: course,
  });
});

exports.getCourseCurriculum = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const curriculum = await chapterModel
    .find({ course: courseId })
    .sort({ order: 1 })
    .populate({
      path: "lessons",
      options: { sort: { order: 1 } },
    });

  return res.status(200).json({
    success: true,
    data: curriculum || [],
  });
});

exports.getAdminCourses = asyncHandler(async (req, res) => {
  const courses = await courseModel
    .find({})
    .populate("creator", "name username")
    .sort({ createdAt: -1 });
  return res.json({
    success: true,
    data: courses,  
  });
});

exports.changeCourseStatus = asyncHandler(async (req, res) => {
  const {id} = req.params
  const {status} = req.query

  const validStatuses = ["Pending", "Approved", "Rejected"]
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status provided.", 400);
  }
  const updatedCourse = await courseModel.findByIdAndUpdate(
    id,
    { status },
    { new: true } 
  );
  if (!updatedCourse) {
    throw new AppError("Course not found.", 404);
  }

  return res.status(200).json({
    success: true,
    message: `Course status successfully changed to ${status}.`,
    data: updatedCourse,
  });
});

exports.uploadCover = (req, res, next) => {
  const upload = imageUploadMiddleware.single("cover");

  upload(req, res, (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }

    if (!req.file) {
      return next(new AppError("No file provided.", 400));
    }

    const coverUrl = req.file.path;

    return res.status(200).json({
      success: true,
      message: "Cover uploaded successfully",
      coverUrl,
    });
  });
};
