const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    isFree: {
      type: Boolean,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "document"],
      default: "video",
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chapter: {
      type: mongoose.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const model = mongoose.model("Lesson", schema);

module.exports = model;
