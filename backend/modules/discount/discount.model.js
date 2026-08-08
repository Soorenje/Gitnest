const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true 
    },
    percent: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 100 
    },
    maxUsage: { 
      type: Number, 
      required: true 
    },
    uses: { 
      type: Number, 
      default: 0 
    },
    expireAt: { 
      type: Date, 
      required: true 
    }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", schema);