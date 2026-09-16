const User = require("../models/User");
const Submission = require("../models/Submission");
const {
  generateAdminExcel
} = require("../utils/excelGenerator");

// ==========================================
// ADMIN DASHBOARD STATS
// ==========================================

exports.getDashboardStats = async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalFaculty =
      await User.countDocuments({
        role: "faculty"
      });

    const totalHod =
      await User.countDocuments({
        role: "hod"
      });

    const totalDean =
      await User.countDocuments({
        role: "dean"
      });

    const totalSubmissions =
      await Submission.countDocuments();

    const pendingHodApproval =
      await Submission.countDocuments({
        status: "Pending HOD Approval"
      });

    const approvedByHod =
      await Submission.countDocuments({
        status: "Approved by HOD"
      });

    const pendingDeanReview =
      await Submission.countDocuments({
        status: "Pending Dean Review"
      });

    const approvedByDean =
      await Submission.countDocuments({
        status: "Approved by Dean"
      });

    const pendingAdminReview =
      await Submission.countDocuments({
        $or: [
          {
            status: "Pending Admin Review"
          },
          {
            status: "Submitted to Admin"
          }
        ]
      });

    return res.status(200).json({

      success: true,

      stats: {

        totalUsers,

        totalFaculty,

        totalHod,

        totalDean,

        totalSubmissions,

        pendingHodApproval,

        approvedByHod,

        pendingDeanReview,

        approvedByDean,

        pendingAdminReview

      }

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// GET ALL USERS
// ==========================================

exports.getAllUsers = async (req, res) => {

  try {

    const users =
  await User.find({})

      .select("-password")

      .sort({

        createdAt: -1

      });

    return res.status(200).json({

      success: true,

      count: users.length,

      users

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==========================================
// GET ALL SUBMISSIONS
// ==========================================

exports.getAllSubmissions = async (req, res) => {

  try {

    // Admin must be able to see every actual submission, regardless of
    // which stage of the approval workflow it is currently in. Drafts
    // are excluded because they have not been submitted.
    const submissions = await Submission.find({
      status: { $ne: "Draft" }
    })
      .populate(
        "submittedBy",
        "name email role school department designation employeeId gender dateOfJoining facultyPhoto employmentType dateOfAppointment dateOfRelieving scopusAuthorId vidwanId"
      )
      .sort({
        year: -1,
        quarter: 1,
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });

  } catch (error) {

    console.error("ADMIN GET ALL SUBMISSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ==========================================
// GET APPROVED SUBMISSIONS
// ==========================================
// This is intentionally separate from the general submissions endpoint.
// It always reads the current approval state from MongoDB and disables
// caching so the Admin Approved Reports page can refresh automatically.
exports.getApprovedSubmissions = async (req, res) => {

  try {

    const approvedStatuses = [
      "Approved by HOD",
      "Pending Dean Review",
      "Approved by Dean",
      "Submitted to Admin",
      "Approved by Admin"
    ];

    const submissions = await Submission.find({
      status: { $in: approvedStatuses }
    })
      .populate(
        "submittedBy",
        "name email role school department designation employeeId gender dateOfJoining facultyPhoto employmentType dateOfAppointment dateOfRelieving scopusAuthorId vidwanId"
      )
      .sort({
        updatedAt: -1,
        createdAt: -1
      });

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {

    console.error("ADMIN GET APPROVED SUBMISSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ==========================================
// GET SUBMISSION DETAILS
// ==========================================

exports.getSubmissionById = async (req, res) => {

  try {

    const submission =

      await Submission.findById(

        req.params.id

      )

      .populate(

        "submittedBy",

        "name email role school department designation employeeId gender dateOfJoining facultyPhoto employmentType dateOfAppointment dateOfRelieving scopusAuthorId vidwanId"

      );

    if (!submission) {

      return res.status(404).json({

        success: false,

        message: "Submission not found"

      });

    }

    return res.status(200).json({

      success: true,

      submission

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==========================================
// ADMIN ANALYTICS
// ==========================================

exports.getAdminAnalytics = async (req, res) => {

  try {

    const {

      role = "faculty",

      school = "All",

      department = "All",

      quarter = "Q1"

    } = req.query;

    // ======================================
    // USERS FILTER
    // ======================================

    const userFilter = {
      role
    };

    if (school !== "All") {

      userFilter.school = school;

    }

    if (department !== "All") {

      userFilter.department = department;

    }

    const users = await User.find(userFilter)
      .select(
        "name email school department role"
      );

      console.log("Users:", users.length);

    // ======================================
    // SUBMISSIONS
    // ======================================

    const submissionFilter = {
  role
};

if (school !== "All") {
  submissionFilter.school = school;
}

if (department !== "All") {
  submissionFilter.department = department;
}

const filteredSubmissions = await Submission.find(submissionFilter)
  .populate(
    "submittedBy",
    "name email school department role"
  );

console.log("Submission Filter:", submissionFilter);
console.log("Filtered Submissions:", filteredSubmissions.length);
    // ======================================
    // SUMMARY
    // ======================================

    const summary = {

      totalUsers:
        users.length,

      totalSubmissions:
        filteredSubmissions.length,

      totalApproved:

        filteredSubmissions.filter(

          item =>

            item.status?.includes("Approved")

        ).length,

      totalPending:

        filteredSubmissions.filter(

          item =>

            item.status?.includes("Pending")

        ).length,

      totalRejected:

        filteredSubmissions.filter(

          item =>

            item.status?.includes("Rejected")

        ).length

    };

    // ======================================
    // QUARTER DATA
    // ======================================

    const analytics = {

      Q1: {},

      Q2: {},

      Q3: {},

      Q4: {}

    };

    const quarters = [

      "Q1",

      "Q2",

      "Q3",

      "Q4"

    ];
        // ======================================
    // BUILD QUARTER ANALYTICS
    // ======================================

    quarters.forEach((currentQuarter) => {

      const quarterSubmissions =

        filteredSubmissions.filter(

          submission =>

            submission.quarter === currentQuarter

        );

        console.log("Quarter:", currentQuarter);
console.log("Quarter Submissions:", quarterSubmissions.length);

     const submitted =
quarterSubmissions
.filter(
submission =>
submission.status !== "Draft"
)
.map(item => ({

...item.toObject(),

remarks:

item.adminRemarks ||

item.deanRemarks ||

item.hodRemarks ||

"-"

}));

const pending = submitted.filter(

submission=>
submission.status==="Pending HOD Approval" ||
submission.status==="Pending Dean Review"
);

const approved = submitted.filter(

submission=>

submission.status==="Approved by Dean" ||

submission.status==="Submitted to Admin"

);

const rejected = submitted.filter(

submission=>

submission.status==="Rejected by HOD" ||

submission.status==="Rejected by Dean"

);

      const submittedIds = new Set(
        quarterSubmissions
          .filter((submission) => submission.status !== "Draft")
          .map((submission) => String(submission.submittedBy?._id))
      );

      const notSubmitted =

        users.filter(

          user =>

            !submittedIds.has(

              String(user._id)

            )

        );

      analytics[currentQuarter] = {

        submitted,

        pending,

        approved,

        rejected,

        notSubmitted,

        submittedCount:

          submitted.length,

        pendingCount:

          pending.length,

        approvedCount:

          approved.length,

        rejectedCount:

          rejected.length,

        notSubmittedCount:

          notSubmitted.length

      };

    });
// ======================================
// UPDATE SUMMARY
// ======================================

const selectedData =
  analytics[quarter];

summary.totalUsers =
  users.length;

summary.totalSubmissions =
  selectedData.submittedCount;

summary.totalApproved =
  selectedData.approvedCount;

summary.totalPending =
  selectedData.pendingCount;

summary.totalRejected =
  selectedData.rejectedCount;

summary.totalNotSubmitted =
  selectedData.notSubmittedCount;

    // ======================================
    // BAR CHART DATA
    // ======================================

    const chartData =

      quarters.map((q) => ({

        quarter: q,

        submitted:

          analytics[q].submittedCount,

        pending:

          analytics[q].pendingCount,

        approved:

          analytics[q].approvedCount,

        rejected:

          analytics[q].rejectedCount

      }));

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({

      success: true,

      summary,

      chartData,

      analytics,

      users,

      role,

      school,

      department,

      selectedQuarter: quarter

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ==========================================
// UPDATE USER
// ==========================================

exports.updateUser = async (req, res) => {

  try {

    const {

      name,

      email,

      school,

      department,

      designation,

      employeeId,

      dateOfJoining,

      facultyPhoto,

      employmentType,

      dateOfAppointment,

      dateOfRelieving,

      scopusAuthorId,

      vidwanId

    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {

      return res.status(404).json({

        success: false,

        message: "User not found"

      });

    }

    user.name = name ?? user.name;

    user.email = email ?? user.email;

    user.school = school ?? user.school;

    user.department = department ?? user.department;

    user.designation = designation ?? user.designation;

    user.employeeId = employeeId ?? user.employeeId;

    user.dateOfJoining = dateOfJoining ?? user.dateOfJoining;

    user.facultyPhoto = facultyPhoto ?? user.facultyPhoto;

    user.employmentType = employmentType ?? user.employmentType;

    user.dateOfAppointment = dateOfAppointment ?? user.dateOfAppointment;

    user.dateOfRelieving = dateOfRelieving ?? user.dateOfRelieving;

    user.scopusAuthorId = scopusAuthorId ?? user.scopusAuthorId;

    user.vidwanId = vidwanId ?? user.vidwanId;

    await user.save();

    return res.status(200).json({

      success: true,

      message: "User updated successfully",

      user

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// ACTIVATE / DEACTIVATE USER
// ==========================================

exports.toggleUserStatus = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {

      return res.status(404).json({

        success: false,

        message: "User not found"

      });

    }

    user.isActive = !user.isActive;

    await user.save();

    return res.status(200).json({

      success: true,

      message: user.isActive
        ? "User Activated Successfully"
        : "User Deactivated Successfully",

      user

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ==========================================
// DELETE USER (PERMANENT)
// ==========================================

exports.deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found"

      });

    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({

      success: true,

      message: "User deleted permanently."

    });

  }

  catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ==========================================
// EXCEL DOWNLOAD
// ==========================================
exports.downloadAdminExcel = async (req, res) => {

  try {

    const workbook =
      await generateAdminExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=IQAC_Admin_Report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};