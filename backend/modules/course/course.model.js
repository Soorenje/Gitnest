const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    support: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    courseState: {
      type: String,
      enum: ["Presale", "Ongoing", "Completed"],
      default: "Ongoing",
    },
    discount: {
      type: Number,
      default: 0,
    },
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

schema.virtual("chapters", {
  ref: "Chapter",
  localField: "_id",
  foreignField: "course",
});

schema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "course",
});

schema.virtual("discountedPrice").get(function () {
  if (this.discount && this.discount > 0) {
    if ((this.discount === 100)) return 0;
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

schema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
schema.set("toObject", { virtuals: true });

const model = mongoose.model("Course", schema);

module.exports = model;
