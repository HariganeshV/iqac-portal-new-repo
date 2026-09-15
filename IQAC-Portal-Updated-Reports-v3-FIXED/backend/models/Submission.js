const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
   questionNo: {
  type: String,
  required: true
},

    question: {
      type: String,
      required: true
    },

    answer: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    _id: false
  }
);

const submissionSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

  submittedByName: {
  type: String,
  required: true
},

submittedByEmail: {
  type: String,
  required: true
},

    role: {
      type: String,
      enum: ["faculty", "hod", "dean"],
      required: true
    },

    school: {
      type: String,
      required: true
    },

    department: {
  type: String,

  required: function () {

    return (
      this.role === "faculty" ||
      this.role === "hod"
    );

  },

  default: ""
},

    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    totalQuestions: {
      type: Number,
      default: 0
    },

    answeredCount: {
      type: Number,
      default: 0
    },

    unansweredCount: {
      type: Number,
      default: 0
    },

    answers: {
      type: [answerSchema],
      default: []
    },

    review: {
      type: [{
        questionNo: String,
        rejected: Boolean,
        remarks: String,
        reviewedBy: String,
        reviewedAt: Date
      }],
      default: []
    },

    changedAfterRejection: {
      type: Boolean,
      default: false
    },

    rejectedAnswerSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    tableData: {
      type: Object,
      default: {}
    },

    uploadedFiles: {
      type: Array,
      default: []
    },

    status: {
      type: String,
      enum:[

"Draft",
// Faculty Workflow
"Pending HOD Approval",

"Pending Dean Review",

"Rejected by HOD",
// HOD Workflow
"Approved by Dean",
"Rejected by Dean",
// Dean Workflow
"Pending Admin Review",
"Submitted to Admin"

],
      default: "Draft"
    },

    hodRemarks: {
      type: String,
      default: ""
    },

    deanRemarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate submissions
submissionSchema.index(
  {
    submittedBy: 1,
    quarter: 1,
    year: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);
