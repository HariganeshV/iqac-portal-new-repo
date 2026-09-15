const Submission = require("../models/Submission");
const { getMissingRequiredQuestions } = require("../utils/questionnaireValidation");
const hodQuestions = require("../data/hodQuestions");
const sendRejectionEmail = require("../utils/sendRejectionEmail");
const User = require("../models/User");
const {
    generateHodExcel
} = require("../utils/hodExcelGenerator");
// ==============================
// FILE PATH MAPPER
// ==============================

const mapUploadedFiles = (
  parsedAnswers,
  files
) => {

  if (!files || files.length === 0)
    return parsedAnswers;

  files.forEach((file) => {

    const parts =
      file.fieldname.split("_");

    const questionNo =
      parts[0];

    const answerObj =
      parsedAnswers.find(
        (a) =>
          String(a.questionNo) ===
          String(questionNo)
      );

    if (!answerObj)
      return;

    // --------------------------
    // SINGLE RECORD
    // Example:
    // 38_geoTagPhoto
    // --------------------------

    if (parts.length === 2) {

      const fieldKey =
        parts[1];

      if (
        typeof answerObj.answer !==
          "object" ||
        Array.isArray(
          answerObj.answer
        )
      ) {

        answerObj.answer = {};

      }

      answerObj.answer[
        fieldKey
      ] =
        `/uploads/hod/${file.filename}`;

    }

    // --------------------------
    // TABLE
    // Example:
    // 24_0_eventReport
    // --------------------------

    else if (
      parts.length >= 3
    ) {

      const rowIndex =
        Number(parts[1]);

      const fieldKey =
        parts
          .slice(2)
          .join("_");

      if (
        !Array.isArray(
          answerObj.answer
        )
      ) {

        answerObj.answer =
          [];

      }

      if (
        !answerObj.answer[
          rowIndex
        ]
      ) {

        answerObj.answer[
          rowIndex
        ] = {};

      }

      answerObj.answer[
        rowIndex
      ][fieldKey] =
        `/uploads/hod/${file.filename}`;

    }

  });

  return parsedAnswers;

};

// ==============================
// HOD SAVE QUESTIONNAIRE DRAFT
// ==============================
exports.saveHodSubmission = async (
  req,
  res
) => {

  console.log(req.body);

  try {

    const {
      school,
      department,
      quarter,
      year,
      answers,
      tableData,
      status,
      totalQuestions,
      answeredCount,
      unansweredCount
    } = req.body;

    let parsedAnswers = [];

    if (answers) {

      parsedAnswers =
        typeof answers === "string"
          ? JSON.parse(answers)
          : answers;

    }
    parsedAnswers =
  mapUploadedFiles(
    parsedAnswers,
    req.files
  );

    if (submission.status === "Rejected by HOD") {
      submission.changedAfterRejection = true;
    }

    // ==========================
    // SAVE TO DATABASE
    // ==========================

    const submission =
      await Submission.findOneAndUpdate(

        {
          submittedBy:
            req.user._id,

          quarter,

          year,

          role: "hod"

        },

        {

          submittedBy:
            req.user._id,

          role: "hod",

          submittedByName:
            req.user.name,

          submittedByEmail:
            req.user.email,

          school,

          department,

          quarter,

          year,

          answers:
            parsedAnswers,

          tableData,

          totalQuestions:
            totalQuestions || 0,

          answeredCount:
            answeredCount || 0,

          unansweredCount:
            unansweredCount || 0,

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

      submission

    });

  }

  catch (error) {

    console.log(
      "HOD SAVE ERROR"
    );

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ==============================
// HOD VIEW OWN SUBMISSIONS
// ==============================

exports.getMyHodSubmissions =
  async (req, res) => {
    try {
      const submissions =
        await Submission.find({
          submittedBy: req.user._id,
          role: "hod"
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
// HOD SUBMIT QUESTIONNAIRE
// ==============================

exports.submitHodSubmission =
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

      const missing = getMissingRequiredQuestions(hodQuestions, submission.answers);
      if (missing.length) {
        return res.status(400).json({
          success: false,
          message: "This is a mandatory field",
          missing
        });
      }

      submission.status =
        "Pending Dean Review";

      await submission.save();

      res.status(200).json({
        success: true,
        message:
          "HOD Questionnaire Submitted Successfully",
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
// VIEW FACULTY SUBMISSIONS
// ==============================

exports.getFacultySubmissions =
  async (req, res) => {

    try {

      const hodSchool = String(req.user.school || "").trim();
      const hodDepartment = String(req.user.department || "").trim();

      const escapeRegex = (value) =>
        value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const statusFilter = {
        $in: [
          "Pending HOD Approval",
          "Pending Dean Review",
          "Approved by Dean",
          "Rejected by HOD",
          "Rejected by Dean"
        ]
      };

      const baseQuery = {
        role: "faculty",
        status: statusFilter
      };

      if (hodSchool) {
        baseQuery.school = {
          $regex: `^${escapeRegex(hodSchool)}$`,
          $options: "i"
        };
      }

      // First try the correct School + Department match.
      let submissions = [];

      if (hodDepartment) {
        submissions = await Submission.find({
          ...baseQuery,
          department: {
            $regex: `^${escapeRegex(hodDepartment)}$`,
            $options: "i"
          }
        })
          .populate("submittedBy", "name email department school")
          .sort({ createdAt: -1 });
      } else {
        submissions = await Submission.find(baseQuery)
          .populate("submittedBy", "name email department school")
          .sort({ createdAt: -1 });
      }

      // If the HOD account has an older/different department spelling and
      // the exact match returns nothing, fall back to the HOD's school.
      // This prevents valid faculty submissions from disappearing from the
      // HOD approval page because of a department-name mismatch.
      if (submissions.length === 0 && hodSchool) {
        submissions = await Submission.find(baseQuery)
          .populate("submittedBy", "name email department school")
          .sort({ createdAt: -1 });
      }

      console.log("HOD School:", hodSchool);
      console.log("HOD Department:", hodDepartment);
      console.log("Faculty submissions shown to HOD:", submissions.length);

      res.status(200).json({
        success: true,
        count: submissions.length,
        submissions
      });

    } catch (error) {

      console.error("GET FACULTY SUBMISSIONS ERROR:", error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };

// ==============================
// APPROVE FACULTY SUBMISSION
// ==============================

exports.approveSubmission = async (req, res) => {

  try {

    console.log("Approve ID:", req.params.id);

    const submission =
      await Submission.findById(
        req.params.id
      );

    console.log("Submission:", submission);

    if (!submission) {

      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });

    }

    submission.status =
"Pending Dean Review";

submission.hodRemarks = "";

await submission.save();

    res.status(200).json({
      success: true,
      message:
        "Faculty Submission Approved Successfully",
      submission
    });

  } catch (error) {

    console.log(
      "APPROVE ERROR:"
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ==============================
// REJECT FACULTY SUBMISSION
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

      submission.status =
        "Rejected by HOD";

      submission.rejectedAnswerSnapshot = submission.answers;

      submission.hodRemarks =
        req.body.remarks ||
        "Rejected by HOD";

      await submission.save();
      await sendRejectionEmail(
        submission,
        "HOD",
        submission.hodRemarks
      );

      res.status(200).json({
        success: true,
        message:
          "Faculty Submission Rejected Successfully",
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
// UPDATE HOD SUBMISSION
// ==============================

exports.updateHodSubmission =
async (req, res) => {

  try {

    const submission =
      await Submission.findById(
        req.params.id
      );

    if (!submission) {

      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });

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

      // ----------------------
      // SINGLE RECORD
      // ----------------------
      if(!newAnswer.answer){

newAnswer.answer={};

}
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

      // ----------------------
      // TABLE
      // ----------------------

      if (
        Array.isArray(
          newAnswer.answer
        )
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

    // ==========================
    // NEW FILE UPLOAD
    // ==========================

    parsedAnswers =
  mapUploadedFiles(
    parsedAnswers,
    req.files
  );

    // ==========================
    // SAVE
    // ==========================

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
        "HOD Submission Updated Successfully",

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

exports.getHodAnalytics = async (req, res) => {

    try {

        const hod = req.user;

        const school = hod.school;

        const department = hod.department;

        // =====================================
        // GET ALL FACULTY OF THIS DEPARTMENT
        // =====================================

        const facultyList = await User.find({

            role: "faculty",

            school,

            department

        }).select("name email");

        // =====================================
        // GET ALL SUBMISSIONS
        // =====================================

        const submissions = await Submission.find({

    role: "faculty",

    school,

    department

})
.select(`
submittedBy
submittedByName
submittedByEmail
school
department
quarter
status
answeredCount
totalQuestions
createdAt
answers
tableData
uploadedFiles
hodRemarks
deanRemarks
`);

        // =====================================
        // SUMMARY
        // =====================================

        const summary = {

            totalFaculty: facultyList.length,

            totalSubmitted: 0,

            totalPending: 0,

            totalApproved: 0,

            totalRejected: 0,

            totalNotSubmitted: 0

        };

        const analytics = {};
        // =====================================
// QUARTER LOOP
// =====================================

const quarters = [

    "Q1",

    "Q2",

    "Q3",

    "Q4"

];

for (const quarter of quarters) {

    const submitted = submissions
.filter(
    (item) => item.quarter === quarter
)
.map((item) => ({
    ...item.toObject(),

    answers: item.answers || [],

    tableData: item.tableData || {},

    uploadedFiles: item.uploadedFiles || [],

    totalQuestions: item.totalQuestions || 0,

    hodRemarks: item.hodRemarks || "",

    deanRemarks: item.deanRemarks || "",

    remarks:
      item.deanRemarks ||
      item.hodRemarks ||
      "-"
}));

    const submittedIds =

        submitted.map(

            (item) =>

                String(item.submittedBy)

        );

    const notSubmitted =

        facultyList.filter(

            (faculty) =>

                !submittedIds.includes(

                    String(faculty._id)

                )

        );

    const pending =

submitted.filter(

(item)=>

item.status==="Pending HOD Approval" ||

item.status==="Pending Dean Review"

);

    const approved =

submitted.filter(

(item)=>

item.status===

"Approved by Dean"

);

    const rejected =

submitted.filter(

(item)=>

item.status==="Rejected by HOD" ||

item.status==="Rejected by Dean"

);

    analytics[quarter] = {

        submittedCount:

            submitted.length,

        pendingCount:

            pending.length,

        approvedCount:

            approved.length,

        rejectedCount:

            rejected.length,

        notSubmittedCount:

            notSubmitted.length,

        submitted,

        pending,

        approved,

        rejected,

        notSubmitted

    };

    // Summary should represent CURRENT quarter only
// Change currentQuarter based on your requirement

const currentQuarter = "Q1";

if (quarter === currentQuarter) {

    summary.totalSubmitted =
        submitted.length;

    summary.totalPending =
        pending.length;

    summary.totalApproved =
        approved.length;

    summary.totalRejected =
        rejected.length;

    summary.totalNotSubmitted =
        notSubmitted.length;

}

}
// =====================================
// BAR CHART DATA
// =====================================

const chartData = quarters.map((quarter) => ({

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

}));

// =====================================
// RESPONSE
// =====================================

return res.status(200).json({

    success: true,

    school,

    department,

    summary,

    facultyList,

    analytics,

    chartData

});

}

catch(error){

    console.error(error);

    return res.status(500).json({

        success:false,

        message:error.message

    });

}

};
// ==============================
// HOD DEPARTMENT INFO
// ==============================

exports.getHodDepartmentInfo = async (req, res) => {

    res.json({

        school: req.user.school,

        department: req.user.department

    });

};

// ==============================
// DOWNLOAD HOD EXCEL
// ==============================

exports.downloadHodExcel = async (req, res) => {

    try {

        const workbook =
            await generateHodExcel(

                req.user.school,

                req.user.department

            );

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            'attachment; filename="IQAC_HOD_Report.xlsx"'

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
// CLEAR HOD SUBMISSION
// ==============================

exports.clearHodSubmission = async (req, res) => {

  try {

    const submission =
      await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({

        success:false,

        message:"Submission not found"

      });

    }

    await submission.deleteOne();

    res.status(200).json({

      success:true,

      message:"HOD Submission Cleared Successfully"

    });

  }

  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.getFacultyReviewStats = async (req, res) => {

  try {

    const hodSchool = String(req.user.school || "").trim();
    const hodDepartment = String(req.user.department || "").trim();

    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = { role: "faculty" };

    if (hodSchool) {
      query.school = {
        $regex: `^${escapeRegex(hodSchool)}$`,
        $options: "i"
      };
    }

    if (hodDepartment) {
      query.department = {
        $regex: `^${escapeRegex(hodDepartment)}$`,
        $options: "i"
      };
    }

    const submissions = await Submission.find(query);

    res.status(200).json({

      success: true,

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