const express = require("express");

const router = express.Router();

const {
  downloadSubmissionReport
} = require(
  "../controllers/reportController"
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

router.get(
  "/submission/:id",
  protect,
  authorize("admin"),
  downloadSubmissionReport
);

module.exports = router;