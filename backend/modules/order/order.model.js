const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    authority: {
      type: String,
    },
    trackingCode: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", schema);
