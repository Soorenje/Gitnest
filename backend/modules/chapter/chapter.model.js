const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

schema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "chapter",
});

schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

schema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v; 
    return ret;
  }
});
schema.set("toObject", { virtuals: true });

const model = mongoose.model("Chapter", schema);

module.exports = model;
