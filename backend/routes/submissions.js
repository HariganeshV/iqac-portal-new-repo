const express = require("express");

const router = express.Router();

const upload =
  require("../middleware/upload");

const {
  saveSubmission,
  getMySubmissions,
  getSubmissionById,
  submitQuestionnaire,
  updateSubmission,
  downloadPDF,
  clearSubmission
} = require(
  "../controllers/submissionController"
);

const {
  protect
} = require(
  "../middleware/auth"
);

// Save Draft

router.post(
  "/save",
  protect,
  upload.any(),
  saveSubmission
);

// Get My Submissions

router.get(
  "/my",
  protect,
  getMySubmissions
);

// PDF Download Route

router.get(
  "/download/:id",
  protect,
  downloadPDF
);

// Get Submission By ID

router.get(
  "/:id",
  protect,
  getSubmissionById
);

// Submit Questionnaire

router.put(
  "/submit/:id",
  protect,
  submitQuestionnaire
);

router.put(
  "/update/:id",
  protect,
  upload.any(),
  updateSubmission
);

router.delete(
  "/clear/:id",
  protect,
  clearSubmission
);

module.exports = router;