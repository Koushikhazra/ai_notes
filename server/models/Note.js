const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    originalText: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
    simpleExplanation: {
      type: String,
      default: "",
    },
    quiz: {
      type: Array,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
