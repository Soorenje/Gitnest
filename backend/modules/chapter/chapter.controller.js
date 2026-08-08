const chapterModel = require("./chapter.model");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");

exports.createChapter = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;

  if (!title) {
    throw new AppError("Chapter title is required", 400);
  }

  const chapterCount = await chapterModel.countDocuments({ course: courseId });
  const nextOrder = chapterCount + 1;

  const add = await chapterModel.create({
    title,
    course: courseId,
    order: nextOrder,
  });

  return res.status(201).json({
    success: true,
    message: "Chapter added successfully",
    data: add,
  });
});

exports.reorderChapters = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { list } = req.body;

  if (!list || !Array.isArray(list)) {
    throw new AppError("Invalid data format.", 400);
  }

  if (list.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No chapters to reorder.",
    });
  }

  const bulkOperations = list.map((item) => ({
    updateOne: {
      filter: { _id: item._id, course: courseId },
      update: { order: item.order },
    },
  }));

  await chapterModel.bulkWrite(bulkOperations);

  return res.status(200).json({
    success: true,
    message: "Chapters reordered successfully.",
  });
});

exports.removeChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const remove = await chapterModel.findByIdAndDelete(id);

  if (!remove) {
    throw new AppError("Chapter not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Chapter removed successfully",
  });
});
