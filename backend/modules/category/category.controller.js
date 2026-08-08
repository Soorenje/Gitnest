const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");
const categoryModel = require("./category.model");

exports.createCategory = asyncHandler(async (req, res) => {
  const { title, slug } = req.body;

  const add = await categoryModel.create({
    title,
    slug,
  });

  return res.status(201).json({
    success: true,
    message: "Category added successfully",
    data: add,
  });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel
    .find({})
    .populate("courses")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: categories,
  });
});

exports.changeInfo = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { title, slug } = req.body;

  const edit = await categoryModel.findByIdAndUpdate(
    categoryId,
    {
      title,
      slug,
    },
    { new: true },
  );

  if (!edit) {
    throw new AppError("Category not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: edit,
  });
});

exports.removeCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const remove = await categoryModel.findByIdAndDelete(categoryId);

  if (!remove) {
    throw new AppError("Category not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
