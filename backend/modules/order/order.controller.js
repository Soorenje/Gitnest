const orderModel = require("./order.model");
const cartModel = require("./../cart/cart.model");
const userModel = require("./../user/user.model");
const courseModel = require("./../course/course.model");
const discountModel = require("./../discount/discount.model");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");
const crypto = require("crypto");

exports.checkout = asyncHandler(async (req, res) => {
  const cart = await cartModel
    .findOne({ user: req.user._id })
    .populate("items")
    .populate("appliedDiscount");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Your cart is empty", 400);
  }
  let totalPrice = 0;
  let finalPrice = 0;

  cart.items.forEach((course) => {
    totalPrice += course.price;
    finalPrice += course.discountedPrice;
  });

  let totalDiscount = 0;

  if (cart.appliedDiscount) {
    totalDiscount = Math.round(
      finalPrice * (cart.appliedDiscount.percent / 100),
    );
    finalPrice -= totalDiscount;
  }

  const authority = crypto.randomBytes(16).toString("hex");
  const order = await orderModel.create({
    user: req.user._id,
    courses: cart.items.map((course) => course._id),
    totalPrice,
    totalDiscount,
    finalPrice,
    authority,
    paymentStatus: "Pending",
  });

  const mockPaymentUrl = `http://localhost:3000/mock-payment?authority=${authority}&amount=${finalPrice}`;

  return res.json({
    success: true,
    message: "Order created successfully. Redirecting to payment...",
    data: {
      orderId: order._id,
      paymentUrl: mockPaymentUrl,
    },
  });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { authority, status } = req.query;

  const order = await orderModel.findOne({ authority });
  if (!order)
    throw new AppError("Order not found or invalid transaction ID", 404);

  if (order.paymentStatus === "Success") {
    return res.json({
      success: true,
      message: "Payment successful! Courses have already been added.",
      data: {
        trackingCode: order.trackingCode,
      },
    });
  }

  if (status !== "success") {
    order.paymentStatus = "Failed";
    await order.save();
    throw new AppError("Payment failed or canceled by user", 400);
  }

  const updatedOrder = await orderModel.findOneAndUpdate(
    { authority, paymentStatus: "Pending" },
    {
      $set: {
        paymentStatus: "Success",
        trackingCode: Math.floor(100000 + Math.random() * 900000).toString(),
      },
    },
    { new: true },
  );

  if (!updatedOrder) {
    const recheckedOrder = await orderModel.findOne({ authority });
    return res.json({
      success: true,
      message: "Payment processed concurrently.",
      data: { trackingCode: recheckedOrder?.trackingCode || "ثبت‌شده" },
    });
  }

  await userModel.findByIdAndUpdate(req.user._id, {
    $addToSet: { courses: { $each: updatedOrder.courses } },
  });

  await Promise.all(
  order.courses.map(async (course) => {
    await courseModel.findByIdAndUpdate(course._id, {
      $inc: { studentsCount: 1 }
    });
  })
);

  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], appliedDiscount: null } },
  );

  if (cart && cart.appliedDiscount) {
    await discountModel.findByIdAndUpdate(cart.appliedDiscount, {
      $inc: { uses: 1 },
    });
  }

  return res.json({
    success: true,
    message: "Payment successful! Courses have been added to your account.",
    data: {
      trackingCode: updatedOrder.trackingCode,
    },
  });
});
