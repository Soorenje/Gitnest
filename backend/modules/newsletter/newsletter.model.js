const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    audience: {
      type: String,
      enum: ["students", "instructors", "all"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "sent", "failed"],
      default: "draft",
    },
    recipientsCount: {
      type: Number,
      default: 0,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

schema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
schema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Newsletter", schema);
