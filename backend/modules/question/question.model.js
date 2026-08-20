const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    points: { type: Number, default: 1 },
    order: { type: Number },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  },
  { timestamps: true },
);

const model = mongoose.model("Question", schema);

module.exports = model;
