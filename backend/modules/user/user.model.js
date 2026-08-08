const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "User",
      enum: ["Admin", "User", "Instructor"],
    },
    ban: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    refreshToken: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    instructorInfo: {
      specialty: { type: String, default: "" },
      bio: { type: String, default: "" },
      iban: { type: String, default: "" },
      bankName: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

schema.pre("save", async function () {
  const hashedPaswword = await bcrypt.hash(this.password, 12);
  this.password = hashedPaswword;
});

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const model = mongoose.model("User", schema);

module.exports = model;
