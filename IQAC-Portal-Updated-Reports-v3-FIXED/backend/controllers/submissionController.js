const Submission = require("../models/Submission");

const path = require("path");

const generateFacultyPDF =
  require("../utils/exportPDF");

const generateHodPDF =
  require("../utils/exportHodPDF");

  const generateDeanPDF =
require("../utils/exportDeanPDF");

const deanQuestions =
require("../data/deanQuestions");

const facultyQuestions =
  require(
    "../data/facultyQuestions"
  );

const hodQuestions =
require("../data/hodQuestions");

const { getMissingRequiredQuestions } =
require("../utils/questionnaireValidation");

// ==============================
// SAVE DRAFT SUBMISSION
// ==============================

exports.saveSubmission = async (
  req,
  res
) => {
  try {

    const {
      role,
      school,
      department,
      quarter,
      year,

      totalQuestions,
      answeredCount,
      unansweredCount,

      answers,
      tableData,
      status
    } = req.body;

    let parsedAnswers = [];

if (answers) {

  parsedAnswers =
    typeof answers === "string"
      ? JSON.parse(answers)
      : answers;

}

if (
  req.files &&
  req.files.length > 0
) {

  req.files.forEach(
    (file) => {

      const questionNo =
        file.fieldname;

      const answerObj =
        parsedAnswers.find(
          (a) =>
            a.questionNo ===
            questionNo
        );

      if (answerObj) {

        answerObj.answer =
          `/uploads/faculty/${file.filename}`;

      }

    }
  );

}
    const submission =
      await Submission.findOneAndUpdate(

        {
          submittedBy:
            req.user._id,

          quarter,

          year
        },

         {
  submittedBy:
    req.user._id,

  role,
  submittedByName:
  req.user.name,

submittedByEmail:
  req.user.email,
  school,
  department,

  quarter,
  year,

  totalQuestions:
    totalQuestions || 0,

  answeredCount:
    answeredCount || 0,

  unansweredCount:
    unansweredCount || 0,

  answers:
  parsedAnswers,

  tableData:
    tableData || {},

  status:
    status || "Draft"
},

        {
          new: true,
          upsert: true,
          runValidators: true
        }

      );

    res.status(200).json({
      success: true,
      message:
        "Submission saved successfully",
      submission
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }
};


// ==============================
// GET MY SUBMISSIONS
// ==============================

exports.getMySubmissions =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find({
          submittedBy: req.user._id
        }).sort({
          createdAt: -1
        });

      res.status(200).json({
        success: true,
        count: submissions.length,
        submissions
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };


// ==============================
// GET SUBMISSION BY ID
// ==============================

exports.getSubmissionById =
  async (req, res) => {
    try {

      const submission =
        await Submission.findById(
          req.params.id
        ).populate(
          "submittedBy",
          "name email role school department designation employeeId"
        );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });
      }

      res.status(200).json({
        success: true,
        submission
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };


// ==============================
// SUBMIT QUESTIONNAIRE
// ==============================

exports.submitQuestionnaire =
  async (req, res) => {
    try {

      const submission =
        await Submission.findById(
          req.params.id
        );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });
      }

      const questionSet =
        submission.role === "faculty"
          ? facultyQuestions
          : submission.role === "hod"
            ? hodQuestions
            : deanQuestions;
      const missing = getMissingRequiredQuestions(
        questionSet,
        submission.answers
      );

      if (missing.length) {
        return res.status(400).json({
          success: false,
          message: "This is a mandatory field",
          missing
        });
      }

      submission.status =
        "Pending HOD Approval";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "Questionnaire submitted successfully",
        submission
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

// ==============================
// UPDATE SUBMISSION
// ==============================

exports.updateSubmission =
  async (req, res) => {

    try {

      const submission =
        await Submission.findById(
          req.params.id
        );

      if (!submission) {

        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });

      }

      let parsedAnswers = [];

if (req.body.answers) {

  parsedAnswers =
    typeof req.body.answers === "string"
      ? JSON.parse(
          req.body.answers
        )
      : req.body.answers;

}

if (
  req.files &&
  req.files.length > 0
) {

  req.files.forEach(
    (file) => {

      const answerObj =
        parsedAnswers.find(
          (a) =>
            a.questionNo ===
            file.fieldname
        );

      if (answerObj) {

        answerObj.answer =
          `/uploads/faculty/${file.filename}`;

      }

    }
  );

}

submission.answers =
  parsedAnswers;

      submission.tableData =
        req.body.tableData || {};

      submission.totalQuestions =
        req.body.totalQuestions || 0;

      submission.answeredCount =
        req.body.answeredCount || 0;

      submission.unansweredCount =
        req.body.unansweredCount || 0;

      submission.school =
        req.body.school;

      submission.department =
        req.body.department;

      submission.submittedByName =
  req.user.name;

submission.submittedByEmail =
  req.user.email;

      // Re-submit to HOD

      submission.status =
  req.body.status ||
  "Pending HOD Approval";

      // Clear old rejection reason

      submission.hodRemarks =
        "";

      await submission.save();

      res.status(200).json({

        success: true,

        message:
          "Submission updated successfully",

        submission

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };

// ==============================
// PDF EXPORT
// ==============================
  exports.downloadPDF =
async (req, res) => {

  try {

    const submission =
  await Submission.findById(
    req.params.id
  ).populate(
    "submittedBy",
    "name email"
  );

    if (!submission) {

      return res.status(404).json({
        success:false,
        message:"Submission not found"
      });

    }

    if (submission.role === "faculty") {

    return generateFacultyPDF(
        res,
        submission,
        facultyQuestions
    );

}

if (submission.role === "hod") {

    return generateHodPDF(
        res,
        submission,
        hodQuestions
    );

}

if (submission.role === "dean") {

    return generateDeanPDF(
        res,
        submission,
        deanQuestions
    );

}

return generateFacultyPDF(
    res,
    submission,
    facultyQuestions
);

  }

  catch(error) {

    console.error(error);

    if (!res.headersSent) {

      return res.status(500).json({
        success:false,
        message:error.message
      });
    }
  }
};
// ==============================
// CLEAR SUBMISSION
// ==============================

exports.clearSubmission = async (req, res) => {

  try {

    const submission =
      await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });

    }

    await submission.deleteOne();

    res.status(200).json({

      success: true,

      message: "Submission cleared successfully"

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};