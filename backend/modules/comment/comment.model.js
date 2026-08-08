const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate: {
      type: Number,
      default: 5,
      enum: [1, 2, 3, 4, 5],
    },
    isAccept: {
      type: Boolean,
      default: false,
    },
    isAnswer: {
      type: Boolean,
      default: false,
    },
    mainCommentID: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true },
);

schema.methods.toJson = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const model = mongoose.model("Comment", schema);

module.exports = model;
