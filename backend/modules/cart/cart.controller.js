const cartModel = require("./cart.model");
const courseModel = require("./../course/course.model");
const discountModel = require("./../discount/discount.model");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");
const { json } = require("express");

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await cartModel
    .findOne({ user: req.user._id })
    .populate({
      path: "items",
      select: "name cover price discount creator",
      populate: { path: "creator", select: "username name" },
    })
    .populate("appliedDiscount");

  if (!cart) {
    return res.json({
      success: true,
      data: { items: [], totalPrice: 0, finalPrice: 0 },
    });
  }

  let totalPrice = 0;
  let finalPrice = 0;

  cart.items.forEach((course) => {
    totalPrice += course.price;
    finalPrice += course.discountedPrice;
  });

  let cartDiscountAmount = 0;

  if (cart.appliedDiscount) {
    cartDiscountAmount = Math.round(
      finalPrice * (cart.appliedDiscount.percent / 100),
    );
    finalPrice -= cartDiscountAmount;
  }
  return res.json({
    success: true,
    data: {
      cartId: cart._id,
      items: cart.items,
      totalPrice,
      cartDiscountAmount,
      finalPrice,
      appliedDiscount: cart.appliedDiscount ? cart.appliedDiscount.code : null,
    },
  });
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { user } = req;

  const course = await courseModel.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);

  if (req.user.courses.includes(courseId)) {
    throw new AppError("You have already purchased this course", 400);
  }

  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({ user: req.user._id, items: [] });
  }

  if (cart.items.includes(courseId)) {
    throw new AppError("This course is already in your cart", 400);
  }

  cart.items.push(courseId);
  await cart.save();

  return res.json({
    success: true,
    message: "Course successfully added to cart",
  });
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) throw new AppError("Cart not found.", 404);

  cart.items.pull(courseId);

  if (cart.items.length === 0) {
    cart.appliedDiscount = null;
  }
  await cart.save();

  return res.json({
    success: true,
    message: "Course successfully removed from cart",
  });
});

exports.applyDiscount = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const discount = await discountModel.findOne({ code });
  if (!discount) throw new AppError("Invalid discount code", 404);

  if (new Date(discount.expireAt) < new Date()) {
    throw new AppError("This discount code has expired", 400);
  }

  if (discount.uses >= discount.maxUsage) {
    throw new AppError("This discount code has reached its usage limit", 400);
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    throw new AppError("Your cart is empty", 400);
  }
  cart.appliedDiscount = discount._id;
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Discount code applied successfully",
  });
});

exports.removeDiscount = asyncHandler(async (req, res) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) throw new AppError("Cart not found", 404);

  cart.appliedDiscount = null;
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Discount code removed",
  });
});
