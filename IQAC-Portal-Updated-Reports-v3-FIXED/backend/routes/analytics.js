const express = require("express");

const router = express.Router();

const {
  getOverallAnalytics,
  getDepartmentAnalytics,
  getSchoolAnalytics,
  getQuestionAnalytics,
  getQuestionSummaryAnalytics,
  getHodAnalytics
} = require("../controllers/analyticsController");

const {
  protect
} = require(
  "../middleware/auth"
);

const authorize =
  require(
    "../middleware/authorize"
  );

// ==============================
// OVERALL ANALYTICS
// ==============================

router.get(
  "/overall",
  protect,
  authorize(
    "admin",
    "dean"
  ),
  getOverallAnalytics
);

// ==============================
// DEPARTMENT ANALYTICS
// ==============================

router.get(
  "/department",
  protect,
  authorize(
    "admin",
    "dean"
  ),
  getDepartmentAnalytics
);

// ==============================
// SCHOOL ANALYTICS
// ==============================

router.get(
  "/school",
  protect,
  authorize(
    "admin",
    "dean"
  ),
  getSchoolAnalytics
);

// ==============================
// QUESTION ANALYTICS
// ==============================

router.get(
  "/question",
  protect,
  authorize(
    "admin",
    "dean"
  ),
  getQuestionAnalytics
);

// ==============================
// QUESTION SUMMARY ANALYTICS
// ==============================

router.get(
  "/question-summary",
  protect,
  authorize(
    "admin",
    "dean"
  ),
  getQuestionSummaryAnalytics
);
// ==============================
// HOD ANALYTICS
// ==============================

router.get(
  "/hod",
  protect,
  authorize("hod"),
  getHodAnalytics
);

module.exports = router;