const express = require("express");

const router = express.Router();

const upload =
  require("../middleware/upload");

const {

  saveHodSubmission,
  getMyHodSubmissions,
  submitHodSubmission,
  getFacultySubmissions,
  approveSubmission,
  rejectSubmission,
  updateHodSubmission,
  getHodAnalytics,
  clearHodSubmission,
  getFacultyReviewStats,

  getHodDepartmentInfo,
downloadHodExcel

} = require("../controllers/hodController");

const {
  protect
} = require(
  "../middleware/auth"
);


// ==============================
// HOD QUESTIONNAIRE
// ==============================

// Save Draft

router.post(
  "/save",
  protect,
  upload.any(),
  saveHodSubmission
);

// View Own HOD Submissions

router.get(
  "/my",
  protect,
  getMyHodSubmissions
);

// Submit HOD Questionnaire

router.put(
  "/submit/:id",
  protect,
  submitHodSubmission
);

router.put(
  "/update/:id",
  protect,
  upload.any(),
  updateHodSubmission
);

// ==============================
// FACULTY REVIEW
// ==============================

// View Faculty Submissions

router.get(
  "/faculty-submissions",
  protect,
  getFacultySubmissions
);

// Approve Faculty Submission

router.put(
  "/approve/:id",
  protect,
  approveSubmission
);

// Reject Faculty Submission

router.put(
  "/reject/:id",
  protect,
  rejectSubmission
);

router.get(
  "/analytics",
  protect,
  getHodAnalytics
);

router.delete(

"/clear/:id",

protect,

clearHodSubmission

);

router.get(
  "/faculty-review-stats",
  protect,
  getFacultyReviewStats
);
// ==============================
// HOD DEPARTMENT INFO
// ==============================

router.get(

    "/department-info",

    protect,

    getHodDepartmentInfo

);

// ==============================
// HOD EXCEL
// ==============================

router.get(

    "/export-excel",

    protect,

    downloadHodExcel

);

module.exports = router;