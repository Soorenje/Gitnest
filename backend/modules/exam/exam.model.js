const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    description: { type: String },
    timeLimit: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

schema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "exam",
});

schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

const model = mongoose.model("Exam", schema);

module.exports = model;
