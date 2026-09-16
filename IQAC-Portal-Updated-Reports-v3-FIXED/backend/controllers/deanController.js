const Submission = require("../models/Submission");
const User = require("../models/User");
const { getMissingRequiredQuestions } = require("../utils/questionnaireValidation");
const { getChangedQuestionNos } = require("../utils/submissionChanges");
const deanQuestions = require("../data/deanQuestions");
const hodQuestions = require("../data/hodQuestions");
const facultyQuestions = require("../data/facultyQuestions");
const sendRejectionEmail = require("../utils/sendRejectionEmail");
const {
    generateDeanExcel
} = require("../utils/deanExcelGenerator");

// ==============================
// SAVE DEAN QUESTIONNAIRE
// ==============================

exports.saveDeanSubmission =
  async (req, res) => {
    try {
      const {

school,

department,

quarter,

year,

tableData

} = req.body;

let answers = [];

if(req.body.answers){

answers =

typeof req.body.answers==="string"

? JSON.parse(req.body.answers)

: req.body.answers;

}
 const files = req.files || [];

 const replaceFiles = (answer, questionNo) => {

  if (Array.isArray(answer)) {

    answer.forEach((row, rowIndex) => {

      Object.keys(row).forEach((key) => {

        const file = files.find(

          f =>

            f.fieldname === `${questionNo}_${rowIndex}_${key}`

        );

        if (file) {

          row[key] = "/" + file.path.replace(/\\/g, "/");

        }

      });

    });

  }

  else if (answer && typeof answer === "object") {

    Object.keys(answer).forEach((key) => {

      const file = files.find(

        f =>

          f.fieldname === `${questionNo}_${key}`

      );

      if (file) {

        answer[key] = "/" + file.path.replace(/\\/g, "/");

      }

    });

  }

};

answers.forEach((item) => {

  replaceFiles(

    item.answer,

    item.questionNo

  );

});

      const requestedStatus = req.body.status || "Draft";
      if (requestedStatus !== "Draft") {
        const missing = getMissingRequiredQuestions(deanQuestions, answers);
        if (missing.length) {
          return res.status(400).json({
            success: false,
            message: "This is a mandatory field",
            missing
          });
        }
      }

      const submission =
  await Submission.create({

    submittedBy:
      req.user._id,

    submittedByName:
      req.user.name,

    submittedByEmail:
      req.user.email,

    role:
      "dean",

    school,

    department,

    quarter,

    year,

    totalQuestions:
req.body.totalQuestions,

answeredCount:
req.body.answeredCount,

unansweredCount:
req.body.unansweredCount,

    answers,

    tableData,

    status: requestedStatus

  });

      res.status(201).json({
        success: true,
        submission
      });
    } catch (error) {

  console.log("========== SAVE ERROR ==========");
  console.log(error);
  console.log(error.stack);

  res.status(500).json({
    success: false,
    message: error.message
  });

}
  };

// ==============================
// UPDATE DEAN SUBMISSION
// ==============================

exports.updateDeanSubmission =
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

    if (submission.status === "Rejected by Dean") {
      submission.changedAfterRejection = true;
    }

    const {

      school,

      department,

      totalQuestions,

      answeredCount,

      unansweredCount,

      tableData,

      status

    } = req.body;

    let parsedAnswers = [];

    if (req.body.answers) {

      parsedAnswers =

        typeof req.body.answers === "string"

          ? JSON.parse(req.body.answers)

          : req.body.answers;

    }
    const files = req.files || [];

    const replaceFiles = (answer, questionNo) => {

  if (Array.isArray(answer)) {

    answer.forEach((row, rowIndex) => {

      Object.keys(row).forEach((key) => {

        const file = files.find(

          f =>

            f.fieldname === `${questionNo}_${rowIndex}_${key}`

        );

        if (file) {

          row[key] = "/" + file.path.replace(/\\/g, "/");

        }

      });

    });

  }

  else if (answer && typeof answer === "object") {

    Object.keys(answer).forEach((key) => {

      const file = files.find(

        f =>

          f.fieldname === `${questionNo}_${key}`

      );

      if (file) {

        answer[key] = "/" + file.path.replace(/\\/g, "/");

      }

    });

  }

};


    // ==========================
    // KEEP OLD FILES
    // ==========================

    parsedAnswers.forEach((newAnswer) => {

      const oldAnswer =
        submission.answers.find(

          (a) =>

            String(a.questionNo) ===
            String(newAnswer.questionNo)

        );

      if (!oldAnswer)
        return;

      if (!newAnswer.answer) {

        newAnswer.answer = {};

      }

      // SINGLE RECORD

      if (

        typeof newAnswer.answer === "object" &&

        !Array.isArray(newAnswer.answer)

      ) {

        Object.keys(

          oldAnswer.answer || {}

        ).forEach((key) => {

          if (

            !newAnswer.answer[key] &&

            typeof oldAnswer.answer[key] === "string"

          ) {

            newAnswer.answer[key] =
              oldAnswer.answer[key];

          }

        });

      }

      // TABLE

      if (

        Array.isArray(newAnswer.answer)

      ) {

        newAnswer.answer.forEach(

          (row, rowIndex) => {

            if (

              !oldAnswer.answer?.[rowIndex]

            )
              return;

            Object.keys(

              oldAnswer.answer[rowIndex]

            ).forEach((key) => {

              if (

                !row[key] &&

                typeof oldAnswer.answer[rowIndex][key] ===
                "string"

              ) {

                row[key] =
                  oldAnswer.answer[rowIndex][key];

              }

            });

          }

        );

      }

    });
    parsedAnswers.forEach((item) => {

  replaceFiles(

    item.answer,

    item.questionNo

  );

});

    if (submission.status === "Rejected by Dean" && submission.rejectedAnswerSnapshot) {
      submission.changedAfterRejection = true;
      submission.review = submission.review.filter((item) => item.reviewerRole !== "dean");
      submission.changedQuestionNos = getChangedQuestionNos(
        submission.rejectedAnswerSnapshot,
        parsedAnswers
      );
    }

    submission.answers =
      parsedAnswers;

    submission.tableData =
      tableData || {};

    submission.school =
      school;

    submission.department =
      department;

    submission.totalQuestions =
      totalQuestions || 0;

    submission.answeredCount =
      answeredCount || 0;

    submission.unansweredCount =
      unansweredCount || 0;

    submission.status =
      status || "Draft";

    await submission.save();

    res.status(200).json({

      success: true,

      message:
        "Dean Submission Updated Successfully",

      submission

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ==============================
// VIEW OWN DEAN SUBMISSIONS
// ==============================

exports.getMyDeanSubmissions =
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          submittedBy: req.user._id,
          role: "dean"
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
// SUBMIT DEAN QUESTIONNAIRE
// ==============================

exports.submitDeanSubmission =
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

      const missing = getMissingRequiredQuestions(deanQuestions, submission.answers);
      if (missing.length) {
        return res.status(400).json({
          success: false,
          message: "This is a mandatory field",
          missing
        });
      }

      submission.status =
"Submitted to Admin";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "Dean Questionnaire Submitted Successfully",
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
// VIEW HOD SUBMISSIONS
// ==============================

exports.getHodSubmissions = async (req, res) => {

  try {

    console.log("Dean User :", req.user);

    const status = req.query.status || "";
    const department = String(req.query.department || "").trim();
    const school = String(req.user.school || "").trim();

    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const baseFilter = {
      role: "hod"
    };

    if (school) {
      baseFilter.school = {
        $regex: `^${escapeRegex(school)}$`,
        $options: "i"
      };
    }

    if (status) {
      baseFilter.status = status;
    }

    let filter = { ...baseFilter };

    if (department) {
      filter.department = {
        $regex: `^${escapeRegex(department)}$`,
        $options: "i"
      };
    }

    let submissions = await Submission.find(filter)
      .populate(
        "submittedBy",
        "name email school department designation employeeId"
      )
      .sort({
        department: 1,
        createdAt: -1
      });

    // If an old HOD record contains a slightly different department name,
    // don't hide a valid submission from the Dean. Fall back to the Dean's
    // school while retaining the requested status.
    if (submissions.length === 0 && department) {
      submissions = await Submission.find(baseFilter)
        .populate(
          "submittedBy",
          "name email school department designation employeeId"
        )
        .sort({
          department: 1,
          createdAt: -1
        });
    }

    console.log("Dean School:", school);
    console.log("Dean Department Filter:", department);
    console.log("Dean Status Filter:", status);
    console.log("HOD submissions shown to Dean:", submissions.length);

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });

  }
  catch (error) {

    console.error("GET HOD SUBMISSIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ==============================
// FACULTY REVIEW
// ==============================

exports.getFacultySubmissions =
  async (req, res) => {

    try {
      console.log("Dean User:", req.user);

console.log("Dean School:", req.user.school);

      const filter = {

role:"faculty",

school:req.user.school

};

const submissions =
await Submission.find(filter)

        .populate(
          "submittedBy",
          "name email school department"
        )

        .sort({
          department: 1,
          createdAt: -1
        });
        console.log(submissions); 

      res.status(200).json({

        success: true,

        count: submissions.length,

        submissions

      });

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });

    }

  };

// ==============================
// APPROVE HOD SUBMISSION
// ==============================

exports.approveSubmission =
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

      submission.status =
        "Approved by Dean";

      submission.deanRemarks = "";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "HOD Submission Approved Successfully",
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
// REJECT HOD SUBMISSION
// ==============================

exports.rejectSubmission =
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

      const missing = getMissingRequiredQuestions(deanQuestions, submission.answers);
      if (missing.length) {
        return res.status(400).json({
          success: false,
          message: "This is a mandatory field",
          missing
        });
      }

      submission.status =
        "Rejected by Dean";

      submission.rejectedAnswerSnapshot = submission.answers.map((answer) => answer.toObject ? answer.toObject() : answer);

      submission.deanRemarks =
        req.body.remarks ||
        "Rejected by Dean";

      await submission.save();
      await sendRejectionEmail(
        submission,
        "Dean",
        submission.deanRemarks
      );

      res.status(200).json({
        success: true,
        message:
          "HOD Submission Rejected Successfully",
        submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

exports.reviewQuestion = async (req, res) => {
  try {
    const { questionNo, rejected, remarks = "" } = req.body;
    if (!questionNo || typeof rejected !== "boolean") {
      return res.status(400).json({ success: false, message: "questionNo and rejected are required" });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

    submission.review = submission.review.filter(
      (item) => !(String(item.questionNo) === String(questionNo) && item.reviewerRole === "dean")
    );
    submission.review.push({
      questionNo: String(questionNo),
      rejected,
      remarks,
      reviewerRole: "dean",
      reviewedBy: String(req.user._id),
      reviewedAt: new Date()
    });
    const expectedQuestionNos = submission.role === "faculty"
      ? facultyQuestions.flatMap((section) =>
          section.questions?.length
            ? section.questions.map((_, index) => `${section.sectionNo}_${index}`)
            : [String(section.sectionNo)]
        )
      : hodQuestions.map((section) => String(section.sectionNo));
    const reviewedQuestionNos = new Set(
      submission.review
        .filter((item) => item.reviewerRole === "dean")
        .map((item) => String(item.questionNo))
    );
    if (rejected) {
      submission.status = "Rejected by Dean";
      submission.rejectedAnswerSnapshot = submission.answers.map((answer) => answer.toObject ? answer.toObject() : answer);
      submission.deanRemarks = remarks || `Question ${questionNo} rejected`;
    } else if (expectedQuestionNos.every((questionId) => reviewedQuestionNos.has(questionId))) {
      submission.status = "Approved by Dean";
      submission.deanRemarks = "";
    }
    await submission.save();
    return res.status(200).json({ success: true, review: submission.review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// ==============================
// GET FACULTY SUBMISSION BY ID
// ==============================

  exports.getFacultySubmissionById = async (req, res) => {

  try {

    const submission =
      await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({
        success:false,
        message:"Submission not found"
      });

    }

    res.json({
      success:true,
      submission
    });

  }

  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

// ==============================
// GET HOD SUBMISSION BY ID
// ==============================

exports.getHodSubmissionById = async (req, res) => {

  try {

    const submission = await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({

        success: false,

        message: "Submission not found"

      });

    }

    res.status(200).json({

      success: true,

      submission

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ==============================
// DEAN ANALYTICS
// ==============================

exports.getDeanAnalytics = async (req, res) => {

  try {

    const role =
      req.query.role || "faculty";

    const department =
      req.query.department || "";

    const filter = {

      role,

      school: req.user.school

    };

    const userFilter = {

  role,

  school: req.user.school

};

if (department) {

  userFilter.department = department;

}

const users = await User.find(userFilter);

    if (department) {

      filter.department = department;

    }

    const submissions =
      await Submission.find(filter)
        .populate(
          "submittedBy",
          "name email department"
        );

    const quarterNames = [

      "Q1",

      "Q2",

      "Q3",

      "Q4"

    ];

    const analytics = {};

    quarterNames.forEach((quarter) => {

      const quarterSubmissions =
        submissions.filter(

          s => s.quarter === quarter

        );
        

     let submitted = [];
let pending = [];
let approved = [];
let rejected = [];
let draft = [];
let notSubmitted = [];

      quarterSubmissions.forEach((item) => {

    const submission = {

        ...item.toObject(),

        remarks:

            item.adminRemarks ||

            item.deanRemarks ||

            item.hodRemarks ||

            "-"

    };

    if (role === "faculty") {

        if (item.status === "Draft") {

            draft.push(submission);

        }

        else if (

            item.status === "Pending HOD Approval" ||

            item.status === "Pending Dean Review"

        ) {

            pending.push(submission);

            submitted.push(submission);

        }

        else if (item.status === "Approved by Dean") {

            approved.push(submission);

            submitted.push(submission);

        }

        else if (

            item.status === "Rejected by HOD" ||

            item.status === "Rejected by Dean"

        ) {

            rejected.push(submission);

            submitted.push(submission);

        }

    }

    else {

        if (item.status === "Draft") {

            draft.push(submission);

        }

        else if (item.status === "Pending Dean Review") {

            pending.push(submission);

            submitted.push(submission);

        }

        else if (item.status === "Approved by Dean") {

            approved.push(submission);

            submitted.push(submission);

        }

        else if (item.status === "Rejected by Dean") {

            rejected.push(submission);

            submitted.push(submission);

        }

    }

});

     const submittedIds = quarterSubmissions

.filter(item => {

    if (role === "faculty") {
       return [

    "Pending HOD Approval",

    "Pending Dean Review",

    "Approved by Dean",

    "Rejected by HOD",

    "Rejected by Dean"

].includes(item.status);

    }

    return [

        "Pending Dean Review",

        "Approved by Dean",

        "Rejected by Dean"

    ].includes(item.status);

})

.map(item => {

    if (
        item.submittedBy &&
        item.submittedBy._id
    ) {

        return String(item.submittedBy._id);

    }

    return String(item.submittedBy);

});

notSubmitted = users.filter(

    user =>

        !submittedIds.includes(

            String(user._id)

        )

);

      analytics[quarter] = {

    submitted,

    pending,

    approved,

    rejected,

    draft,

    notSubmitted,

    submittedCount:
        submitted.length,

    pendingCount:
        pending.length,

    approvedCount:
        approved.length,

    rejectedCount:
        rejected.length,

    draftCount:
        draft.length,

    notSubmittedCount:
        notSubmitted.length

};

    });

    const chartData = quarterNames.map(

    quarter => ({

        quarter,

        submitted:
            analytics[quarter].submittedCount,

        pending:
            analytics[quarter].pendingCount,

        approved:
            analytics[quarter].approvedCount,

        rejected:
            analytics[quarter].rejectedCount,

        notSubmitted:
            analytics[quarter].notSubmittedCount

    })

);


    res.status(200).json({

      success: true,

      summary: {

    role,

    totalUsers: users.length,

    totalSubmitted:

        analytics.Q1.submittedCount,

    totalPending:

        analytics.Q1.pendingCount,

    totalApproved:

        analytics.Q1.approvedCount,

    totalRejected:

        analytics.Q1.rejectedCount,

    totalNotSubmitted:

        analytics.Q1.notSubmittedCount

},

      analytics,

      chartData,

      userList:

users,

      role,

      department

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==============================
// GET DEAN DEPARTMENTS
// ==============================

exports.getDeanDepartments = async (req, res) => {

  try {

    const departments = await User.distinct(

      "department",

      {

        role: {

          $in: [

            "faculty",

            "hod"

          ]

        },

        school: req.user.school,

        department: {

          $ne: ""

        }

      }

    );

    departments.sort();

    res.status(200).json({

      success: true,

      departments

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==============================
// DOWNLOAD DEAN EXCEL
// ==============================

exports.downloadDeanExcel = async (req, res) => {

    try {

        const school = req.user.school;

        let department = req.query.department;

        if (

            !department ||

            department === "All"

        ) {

            department = "";

        }

        console.log("Dean Excel Download");

        console.log("School :", school);

        console.log("Department :", department);

        const workbook = await generateDeanExcel(
    school,
    department
);

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            'attachment; filename="IQAC_Dean_Report.xlsx"'

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==============================
// CLEAR DEAN SUBMISSION
// ==============================

exports.clearDeanSubmission = async (req, res) => {

  try {

    const submission =
      await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({

        success: false,

        message: "Submission not found"

      });

    }

    await Submission.findByIdAndDelete(
      req.params.id
    );

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