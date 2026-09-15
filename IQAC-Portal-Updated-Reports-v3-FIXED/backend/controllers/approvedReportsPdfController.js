const Submission = require("../models/Submission");
const generateApprovedReportsPdf = require("../utils/approvedReportsPdf");

const APPROVED_STATUSES = [
  "Approved by HOD",
  "Pending Dean Review",
  "Approved by Dean",
  "Submitted to Admin",
  "Approved by Admin",
];

const clean = (value) => String(value || "").trim();

exports.downloadApprovedReportsPDF = async (req, res) => {
  try {
    const {
      school = "All",
      department = "All",
      category = "All",
      quarter = "All",
      search = "",
      section = "All",
    } = req.query;

    const filter = {
      status: { $in: APPROVED_STATUSES },
    };

    if (clean(school) && school !== "All") filter.school = school;
    if (clean(department) && department !== "All") filter.department = department;
    if (clean(category) && category !== "All") filter.role = category.toLowerCase();
    if (clean(quarter) && quarter !== "All") filter.quarter = quarter;

    const searchValue = clean(search);
    if (searchValue) {
      const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { submittedByName: regex },
        { submittedByEmail: regex },
        { school: regex },
        { department: regex },
      ];
    }

    const submissions = await Submission.find(filter)
      .populate("submittedBy", "name email role school department designation employeeId gender dateOfJoining facultyPhoto employmentType dateOfAppointment dateOfRelieving scopusAuthorId vidwanId")
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    return generateApprovedReportsPdf(res, submissions, section);
  } catch (error) {
    console.error("APPROVED REPORTS PDF ERROR:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
