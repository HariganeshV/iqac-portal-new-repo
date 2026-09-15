const express = require("express");

const router = express.Router();

const {
  downloadOverallExcelReport,
  downloadSchoolExcelReport,
  downloadDepartmentExcelReport
} = require(
  "../controllers/excelController"
);

const {
  protect
} = require(
  "../middleware/auth"
);

const authorize =
  require(
    "../middleware/authorize"
  );

// Overall IQAC Report

router.get(
  "/report",
  protect,
  authorize("admin"),
  downloadOverallExcelReport
);

// School Wise Report

router.get(
  "/school/:school",
  protect,
  authorize("admin"),
  downloadSchoolExcelReport
);

// Department Wise Report

router.get(
  "/department/:department",
  protect,
  authorize("admin"),
  downloadDepartmentExcelReport
);

module.exports = router;