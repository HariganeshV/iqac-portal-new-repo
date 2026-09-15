const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getAllSubmissions,
  getApprovedSubmissions,
  getSubmissionById,
  getAdminAnalytics,

  // User Management
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser

} = require(
  "../controllers/adminController"
);

const {
  downloadAdminExcel,
  downloadApprovedReportsExcel
} = require("../controllers/excelController");

const {
  downloadApprovedReportsPDF
} = require("../controllers/approvedReportsPdfController");

const {
  protect
} = require(
  "../middleware/auth"
);

const authorize =
  require(
    "../middleware/authorize"
  );


// Dashboard

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);


// Users

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

// ==========================================
// USER MANAGEMENT
// ==========================================


// Update User
router.put(
  "/users/:id",
  protect,
  authorize("admin"),
  updateUser
);

// Activate / Deactivate User
router.put(
  "/users/:id/status",
  protect,
  authorize("admin"),
  toggleUserStatus
);

// Soft Delete User
router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);

// Submissions

router.get(
  "/submissions",
  protect,
  authorize("admin"),
  getAllSubmissions
);

router.get(
  "/approved-submissions",
  protect,
  authorize("admin"),
  getApprovedSubmissions
);

router.get(
  "/submissions/:id",
  protect,
  authorize("admin"),
  getSubmissionById
);

// Analytics

router.get(
  "/analytics",
  protect,
  authorize("admin"),
  getAdminAnalytics
);

router.get(
  "/download-excel",
  protect,
  authorize("admin"),
  downloadAdminExcel
);

router.get(
  "/download-approved-reports-excel",
  protect,
  authorize("admin"),
  downloadApprovedReportsExcel
);

router.get(
  "/download-approved-reports-pdf",
  protect,
  authorize("admin"),
  downloadApprovedReportsPDF
);
module.exports = router;