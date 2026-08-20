const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./modules/auth/auth.route");
const userRouter = require("./modules/user/user.route");
const courseRouter = require("./modules/course/course.route");
const chapterRouter = require("./modules/chapter/chapter.route");
const lessonRouter = require("./modules/lesson/lesson.route");
const categoryRouter = require("./modules/category/category.route");
const cartRouter = require("./modules/cart/cart.route");
const orderRouter = require("./modules/order/order.route");
const discountRouter = require("./modules/discount/discount.route");
const commentRouter = require("./modules/comment/comment.route");
const newsletterRouter = require("./modules/newsletter/newsletter.route");
const examRouter = require("./modules/exam/exam.router");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://gitnest-eight.vercel.app"
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/course", courseRouter);
app.use("/v1/chapter", chapterRouter);
app.use("/v1/lesson", lessonRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/cart", cartRouter);
app.use("/v1/order", orderRouter);
app.use("/v1/discount", discountRouter);
app.use("/v1/comment", commentRouter);
app.use("/v1/newsletter", newsletterRouter);
app.use("/v1/exam", examRouter);

app.use((err, req, res, next) => {
  statusCode = err.statusCode || 500;
  message = err.message || "Internal server error occurred.";

  console.log(`[Error] ${statusCode} - ${message}`);

  return res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;
