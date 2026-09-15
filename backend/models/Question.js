const mongoose = require("mongoose");

const questionSchema =
  new mongoose.Schema({

    role: {
      type: String,
      required: true
    },

    sectionNo: {
      type: Number,
      required: true
    },

    sectionTitle: {
      type: String,
      required: true
    },

    questionNo: {
      type: Number,
      required: true
    },

    question: {
      type: String,
      required: true
    },

    answerFormat: {
      type: String,
      required: true
    },

    repeatable: {
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Question",
    questionSchema
  );