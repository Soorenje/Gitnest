const discountModel = require("./discount.model");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");

exports.getAll = asyncHandler(async (req, res) => {
  const discounts = await discountModel.find({});
  return res.json({
    success: true,
    data: {
      discounts,
    },
  });
});

exports.createDiscount = asyncHandler(async (req, res) => {
  const { code, percent, maxUsage, expireAt } = req.body;
  const isUniqueCode = await discountModel.findOne({ code });
  if (isUniqueCode) {
    throw new AppError("This discount code is duplicate", 400);
  }
  const add = await discountModel.create({
    code,
    percent,
    maxUsage,
    expireAt,
  });

  return res.status(201).json({
    success: true,
    message: "Discount added successfully",
  });
});

exports.removeDiscount = asyncHandler(async (req, res) => {
  const { discountId } = req.params;
  const remove = await discountModel.findByIdAndDelete(discountId);
  if (!remove) {
    throw new AppError("Discount not found", 404);
  }
  return res.json({
    success: true,
    message: "Discount deleted successfully",
  });
});
