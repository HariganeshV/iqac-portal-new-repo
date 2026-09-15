const express = require("express");

const router = express.Router();

const {
  saveDeanSubmission,
  updateDeanSubmission,
  getMyDeanSubmissions,
  submitDeanSubmission,

  getFacultySubmissions,
  getFacultySubmissionById,

  getHodSubmissions,
  getHodSubmissionById,

  approveSubmission,
  rejectSubmission,
  clearDeanSubmission,

  getDeanAnalytics,

  getDeanDepartments,
  downloadDeanExcel

} = require("../controllers/deanController");

const {
  protect
} = require(
  "../middleware/auth"
);
const upload = require("../middleware/upload");
// ==============================
// DEAN QUESTIONNAIRE
// ==============================

// Save Draft

router.post(
    "/save",
    protect,
    upload.any(),
    saveDeanSubmission
);

router.put(
"/update/:id",
protect,
upload.any(),
updateDeanSubmission
);

// View Own Dean Submissions

router.get(
  "/my",
  protect,
  getMyDeanSubmissions
);

// Submit Dean Questionnaire

router.put(
  "/submit/:id",
  protect,
  submitDeanSubmission
);

// ==============================
// FACULTY REVIEW
// ==============================

router.get(
  "/faculty-submissions",
  protect,
  getFacultySubmissions
);

// ==============================
// HOD REVIEW
// ==============================

router.get(
  "/hod-submissions",
  protect,
  getHodSubmissions
);

// ==============================
// VIEW SINGLE HOD SUBMISSION
// ==============================

router.get(
  "/hod-submission/:id",
  protect,
  getHodSubmissionById
);
// Approve Submission

router.put(
  "/approve/:id",
  protect,
  approveSubmission
);

// Reject Submission

router.put(
  "/reject/:id",
  protect,
  rejectSubmission
);

router.get(
  "/faculty-submission/:id",
  protect,
  getFacultySubmissionById
);

router.delete(

  "/clear/:id",

  protect,

  clearDeanSubmission

);

router.get(
  "/analytics",
  protect,
  getDeanAnalytics
);
// ==============================
// DEAN DEPARTMENTS
// ==============================

router.get(
  "/departments",
  protect,
  getDeanDepartments
);

// ==============================
// DEAN EXCEL
// ==============================

router.get(
  "/export-excel",
  protect,
  downloadDeanExcel
);
module.exports = router;
