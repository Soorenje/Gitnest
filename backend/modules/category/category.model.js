const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
  },
  { timestamps: true },
);

schema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "categoryID",
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

const model = mongoose.model("Category", schema);

module.exports = model;
