const lessonModel = require("./lesson.model");
const chapterModel = require("./../chapter/chapter.model");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");
const lessonUploadMiddlewares = require("../../middlewares/lessonUpload");

exports.createLesson = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;
  const { title, time, isFree, fileUrl, type } = req.body;
  const chapter = await chapterModel.findById(chapterId);
  if (!chapter) {
    throw new AppError("Chapter not found", 404);
  }
  const lessonCount = await lessonModel.countDocuments({ chapter: chapterId });
  const nextOrder = lessonCount + 1;
  const add = await lessonModel.create({
    title,
    time,
    isFree,
    fileUrl,
    type: type || "video",
    course: chapter.course,
    chapter: chapterId,
    order: nextOrder,
  });
  return res.json({
    message: "Lesson added successfully",
  });
});

exports.reorderLessons = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;
  const { list } = req.body;

  if (!list || !Array.isArray(list)) {
    throw new AppError("Invalid data format.", 400);
  }
  if (list.length === 0) {
    return res.json({
      success: true,
      message: "No lessons to reorder.",
    });
  }
  const bulkOperations = list.map((item) => ({
    updateOne: {
      filter: { _id: item._id, chapter: chapterId },
      update: { order: item.order },
    },
  }));
  await lessonModel.bulkWrite(bulkOperations);

  return res.json({
    success: true,
    message: "Lessons reordered successfully.",
  });
});

exports.updateLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const body = req.body;
  const user = req.user;
  const updateData = {};

  const lesson = await lessonModel.findById(lessonId);
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }
  if (body.title) updateData.title = body.title;
  if (body.time) updateData.time = body.time;
  if (body.isFree !== undefined) updateData.isFree = body.isFree;
  if (body.fileUrl) updateData.fileUrl = body.fileUrl;
  if (body.type) updateData.type = body.type;
  const changeInfo = await lessonModel.findByIdAndUpdate(lessonId, updateData, {
    returnDocument: "after",
  });
  return res.json({
    success: true,
    message: "Lesson updated successfully",
    data: changeInfo,
  });
});

exports.removeLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const user = req.user;

  const lesson = await lessonModel.findById(lessonId);
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }
  await lessonModel.findByIdAndDelete(lessonId);
  return res.json({
    success: true,
    message: "Lesson deleted successfully",
  });
});

exports.uploadFile = (req, res, next) => {
  const upload = lessonUploadMiddlewares.single("file");

  upload(req, res, (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }

    if (!req.file) {
      return next(new AppError("No file provided.", 400));
    }
    const folderName = req.file.mimetype.startsWith("video/")
      ? "videos"
      : "files";
    const type = req.file.mimetype.startsWith("video/") ? "video" : "document";
    const fileUrl = `http://localhost:8000/uploads/lessons/${folderName}/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
      type,
    });
  });
};
