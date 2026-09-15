const ExcelJS = require("exceljs");

const Submission = require("../models/Submission");
const {
    generateAdminExcel
} = require("../utils/excelGenerator");
// ======================================
// HELPER FUNCTION
// ======================================

const addSubmissionSheet = (
  workbook,
  sheetName,
  submissions
) => {
  const sheet =
    workbook.addWorksheet(
      sheetName
    );

  sheet.columns = [
    {
      header: "Name",
      key: "name",
      width: 30
    },
    {
      header: "Email",
      key: "email",
      width: 35
    },
    {
      header: "Employee ID",
      key: "employeeId",
      width: 20
    },
    {
      header: "Role",
      key: "role",
      width: 15
    },
    {
      header: "School",
      key: "school",
      width: 30
    },
    {
      header: "Department",
      key: "department",
      width: 40
    },
    {
      header: "Quarter",
      key: "quarter",
      width: 12
    },
    {
      header: "Year",
      key: "year",
      width: 12
    },
    {
      header: "Status",
      key: "status",
      width: 25
    },
    {
      header: "Answered",
      key: "answeredCount",
      width: 15
    },
    {
      header: "Unanswered",
      key: "unansweredCount",
      width: 15
    }
  ];

  submissions.forEach(
    (submission) => {
      sheet.addRow({
        name:
          submission
            .submittedBy?.name ||
          "",

        email:
          submission
            .submittedBy?.email ||
          "",

        employeeId:
          submission
            .submittedBy
            ?.employeeId || "",

        role:
          submission.role,

        school:
          submission.school,

        department:
          submission.department,

        quarter:
          submission.quarter,

        year:
          submission.year,

        status:
          submission.status,

        answeredCount:
          submission.answeredCount,

        unansweredCount:
          submission.unansweredCount
      });
    }
  );
};

// ======================================
// OVERALL REPORT
// ======================================

exports.downloadOverallExcelReport =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find()
          .populate(
            "submittedBy",
            "name email employeeId"
          );

      const workbook =
        new ExcelJS.Workbook();

      const faculty =
        submissions.filter(
          (item) =>
            item.role ===
            "faculty"
        );

      const hod =
        submissions.filter(
          (item) =>
            item.role ===
            "hod"
        );

      const dean =
        submissions.filter(
          (item) =>
            item.role ===
            "dean"
        );

      addSubmissionSheet(
        workbook,
        "Faculty Submissions",
        faculty
      );

      addSubmissionSheet(
        workbook,
        "HOD Submissions",
        hod
      );

      addSubmissionSheet(
        workbook,
        "Dean Submissions",
        dean
      );

      const analytics =
        workbook.addWorksheet(
          "Analytics Summary"
        );

      const totalQuestions =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.totalQuestions ||
              0),
          0
        );

      const totalAnswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.answeredCount ||
              0),
          0
        );

      const totalUnanswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.unansweredCount ||
              0),
          0
        );

      analytics.addRow([
        "Total Submissions",
        submissions.length
      ]);

      analytics.addRow([
        "Total Questions",
        totalQuestions
      ]);

      analytics.addRow([
        "Answered Questions",
        totalAnswered
      ]);

      analytics.addRow([
        "Unanswered Questions",
        totalUnanswered
      ]);

      analytics.addRow([
        "Completion %",
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0
      ]);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=IQAC_Report.xlsx"
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

// ======================================
// SCHOOL WISE REPORT
// ======================================

exports.downloadSchoolExcelReport =
  async (req, res) => {
    try {

      const schoolName =
        req.params.school;

      const submissions =
        await Submission.find({
          school: schoolName
        }).populate(
          "submittedBy",
          "name email employeeId"
        );

      const workbook =
        new ExcelJS.Workbook();

      const faculty =
        submissions.filter(
          (item) =>
            item.role ===
            "faculty"
        );

      const hod =
        submissions.filter(
          (item) =>
            item.role ===
            "hod"
        );

      const dean =
        submissions.filter(
          (item) =>
            item.role ===
            "dean"
        );

      addSubmissionSheet(
        workbook,
        "Faculty Submissions",
        faculty
      );

      addSubmissionSheet(
        workbook,
        "HOD Submissions",
        hod
      );

      addSubmissionSheet(
        workbook,
        "Dean Submissions",
        dean
      );

      const analytics =
        workbook.addWorksheet(
          "School Analytics"
        );

      const totalQuestions =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.totalQuestions ||
              0),
          0
        );

      const totalAnswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.answeredCount ||
              0),
          0
        );

      const totalUnanswered =
        submissions.reduce(
          (sum, item) =>
            sum +
            (item.unansweredCount ||
              0),
          0
        );

      const completion =
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0;

      analytics.addRow([
        "School",
        schoolName
      ]);

      analytics.addRow([
        "Total Submissions",
        submissions.length
      ]);

      analytics.addRow([
        "Faculty Submissions",
        faculty.length
      ]);

      analytics.addRow([
        "HOD Submissions",
        hod.length
      ]);

      analytics.addRow([
        "Dean Submissions",
        dean.length
      ]);

      analytics.addRow([
        "Total Questions",
        totalQuestions
      ]);

      analytics.addRow([
        "Answered Questions",
        totalAnswered
      ]);

      analytics.addRow([
        "Unanswered Questions",
        totalUnanswered
      ]);

      analytics.addRow([
        "Completion %",
        completion
      ]);

      const fileName =
        schoolName.replace(
          /\s+/g,
          "_"
        ) +
        "_Report.xlsx";

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}`
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

// ======================================
// DEPARTMENT WISE REPORT
// ======================================

exports.downloadDepartmentExcelReport =
  async (req, res) => {
    try {

      const departmentName =
        req.params.department;

      const departmentSubmissions =
        await Submission.find({
          department:
            departmentName
        }).populate(
          "submittedBy",
          "name email employeeId"
        );

      if (
        departmentSubmissions.length ===
        0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "No submissions found for this department"
        });
      }

      const schoolName =
        departmentSubmissions[0]
          .school;

      const deanSubmissions =
        await Submission.find({
          school: schoolName,
          role: "dean"
        }).populate(
          "submittedBy",
          "name email employeeId"
        );

      const workbook =
        new ExcelJS.Workbook();

      const faculty =
        departmentSubmissions.filter(
          (item) =>
            item.role ===
            "faculty"
        );

      const hod =
        departmentSubmissions.filter(
          (item) =>
            item.role ===
            "hod"
        );

      addSubmissionSheet(
        workbook,
        "Faculty Submissions",
        faculty
      );

      addSubmissionSheet(
        workbook,
        "HOD Submissions",
        hod
      );

      addSubmissionSheet(
        workbook,
        "School Dean Submission",
        deanSubmissions
      );

      const analytics =
        workbook.addWorksheet(
          "Department Analytics"
        );

      const allSubmissions = [
        ...departmentSubmissions,
        ...deanSubmissions
      ];

      const totalQuestions =
        allSubmissions.reduce(
          (sum, item) =>
            sum +
            (item.totalQuestions ||
              0),
          0
        );

      const totalAnswered =
        allSubmissions.reduce(
          (sum, item) =>
            sum +
            (item.answeredCount ||
              0),
          0
        );

      const totalUnanswered =
        allSubmissions.reduce(
          (sum, item) =>
            sum +
            (item.unansweredCount ||
              0),
          0
        );

      const completion =
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0;

      analytics.addRow([
        "Department Name",
        departmentName
      ]);

      analytics.addRow([
        "School Name",
        schoolName
      ]);

      analytics.addRow([
        "Faculty Submissions",
        faculty.length
      ]);

      analytics.addRow([
        "HOD Submissions",
        hod.length
      ]);

      analytics.addRow([
        "Dean Submissions",
        deanSubmissions.length
      ]);

      analytics.addRow([
        "Total Questions",
        totalQuestions
      ]);

      analytics.addRow([
        "Answered Questions",
        totalAnswered
      ]);

      analytics.addRow([
        "Unanswered Questions",
        totalUnanswered
      ]);

      analytics.addRow([
        "Completion %",
        completion
      ]);

      const fileName =
        departmentName.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        ) +
        "_Report.xlsx";

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}`
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };

exports.downloadAdminExcel = async (req, res) => {

    try {

        console.log("Download Request Received");

        const { school, department } = req.query;

        const workbook =
            await generateAdminExcel(
                school,
                department
            );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="IQAC_Admin_Report.xlsx"'
        );

        await workbook.xlsx.write(res);

        res.end();

        console.log("Excel Sent Successfully");

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// ======================================
// APPROVED REPORTS - DATA CAPTURE STYLE EXCEL
// ======================================

// IMPORTANT:
// - Layout follows the uploaded Data Capture Template style: one sheet, question-by-question,
//   title row -> answer-format row -> header row -> data rows.
// - Question titles, sub-question labels and formats come ONLY from the portal question files.
// - No colour coding is used.
// - If a whole question was not attempted: "No reports".
// - If a question was attempted but an individual field is empty: "Nil".
// - No answer is guessed or shifted into another field.

const approvedReportStatuses = [
  "Approved by HOD",
  "Pending Dean Review",
  "Approved by Dean",
  "Submitted to Admin",
  "Approved by Admin"
];

const questionSetsForExport = {
  faculty: require("../data/facultyQuestions"),
  hod: require("../data/hodQuestions"),
  dean: require("../data/deanQuestions")
};

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const isMeaningful = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some(isMeaningful);
  if (typeof value === "object") return Object.values(value).some(isMeaningful);
  return true;
};

const cellValue = (value) => {
  if (!isMeaningful(value)) return "Nil";

  if (Array.isArray(value)) {
    const values = value.filter(isMeaningful).map(cellValue);
    return values.length ? values.join(", ") : "Nil";
  }

  if (typeof value === "object") {
    // Do not invent labels for a stored object. When an object is genuinely the field value,
    // preserve its stored content in a readable form.
    if (isMeaningful(value.url)) return String(value.url);
    if (isMeaningful(value.path)) return String(value.path);
    if (isMeaningful(value.filename)) return String(value.filename);

    const values = Object.values(value).filter(isMeaningful).map(cellValue);
    return values.length ? values.join(" | ") : "Nil";
  }

  return String(value);
};

const sectionFields = (section, role) => {
  if (role === "faculty") {
    return (section.questions || []).map((item, index) => ({
      key: String(index),
      label: item.question || `Field ${index + 1}`,
      format: item.answerFormat || item.type || ""
    }));
  }

  const source = section.tableColumns || section.fields || section.questions || [];
  return source.map((item, index) => ({
    key: item.key ?? String(index),
    label: item.label || item.question || item.key || `Field ${index + 1}`,
    format: item.answerFormat || item.type || ""
  }));
};

const sectionOwnerMap = (() => {
  const map = new Map();
  Object.entries(questionSetsForExport).forEach(([role, sections]) => {
    (sections || []).forEach((section) => {
      map.set(String(section.sectionNo), { role, section });
    });
  });
  return map;
})();

const allWebsiteSections = Array.from(sectionOwnerMap.entries())
  .map(([sectionNo, value]) => ({
    sectionNo: Number(sectionNo),
    role: value.role,
    section: value.section
  }))
  .sort((a, b) => a.sectionNo - b.sectionNo);

const findSectionAnswerItem = (submission, sectionNo) => {
  const answers = Array.isArray(submission.answers) ? submission.answers : [];
  return answers.find((item) => String(item.questionNo) === String(sectionNo));
};

const readStructuredSectionValue = (submission, sectionNo) => {
  // Portal HOD/Dean questionnaires save one answer item per section number.
  // Always prefer that exact stored answer over tableData.
  const item = findSectionAnswerItem(submission, sectionNo);
  if (item && isMeaningful(item.answer)) return item.answer;

  const tableData = submission.tableData || {};
  const fallback = tableData[String(sectionNo)] ?? tableData[sectionNo];
  return isMeaningful(fallback) ? fallback : undefined;
};

const facultyRecord = (submission, section) => {
  const answers = Array.isArray(submission.answers) ? submission.answers : [];
  const fields = sectionFields(section, "faculty");

  const matched = fields.map((field, index) => {
    const exactKey = `${section.sectionNo}_${index}`;

    let item = answers.find((answer) => String(answer.questionNo) === exactKey);

    // Safe fallback for older faculty records: match the website question text exactly
    // after normalization. Never use positional guessing.
    if (!item) {
      const target = normalizeText(field.label);
      item = answers.find((answer) => normalizeText(answer.question) === target);
    }

    return item ? item.answer : undefined;
  });

  return matched.some(isMeaningful) ? matched : null;
};

const structuredRecords = (submission, section, role) => {
  const raw = readStructuredSectionValue(submission, section.sectionNo);
  if (!isMeaningful(raw)) return [];

  const fields = sectionFields(section, role);

  if (section.type === "table") {
    const rows = Array.isArray(raw) ? raw : [raw];

    return rows
      .filter((row) => isMeaningful(row))
      .map((row) => {
        if (row && typeof row === "object" && !Array.isArray(row)) {
          return fields.map((field) => row[field.key]);
        }

        // A scalar is only valid when the website section has exactly one field.
        return fields.length === 1 ? [row] : fields.map(() => undefined);
      })
      .filter((row) => row.some(isMeaningful));
  }

  // singleRecord
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const row = fields.map((field) => raw[field.key]);
    return row.some(isMeaningful) ? [row] : [];
  }

  if (fields.length === 1 && isMeaningful(raw)) return [[raw]];
  return [];
};

const submissionIdentity = (submission) => {
  const populatedId = submission.submittedBy?._id;
  const rawId = submission.submittedBy && typeof submission.submittedBy !== "object"
    ? submission.submittedBy
    : null;

  return String(
    populatedId ||
    rawId ||
    submission.submittedByEmail ||
    `${submission.submittedByName || ""}|${submission.school || ""}|${submission.department || ""}`
  );
};

const rowsForWebsiteSection = (submissions, role, section) => {
  const relevant = submissions.filter((submission) => String(submission.role).toLowerCase() === role);
  const rows = [];

  if (role === "faculty") {
    // Section 3 is faculty master data. Show one row per faculty even when multiple quarters exist.
    const seenFaculty = new Set();

    relevant.forEach((submission) => {
      const record = facultyRecord(submission, section);
      if (!record) return;

      if (Number(section.sectionNo) === 3) {
        const identity = submissionIdentity(submission);
        if (seenFaculty.has(identity)) return;
        seenFaculty.add(identity);
      }

      rows.push(record);
    });

    return rows;
  }

  relevant.forEach((submission) => {
    structuredRecords(submission, section, role).forEach((record) => rows.push(record));
  });

  return rows;
};

const approvedFilterFromQuery = (req) => {
  const { school, department, category, quarter, search } = req.query;
  const filter = { status: { $in: approvedReportStatuses } };

  if (school && school !== "All") filter.school = school;
  if (department && department !== "All") filter.department = department;
  if (category && category !== "All") filter.role = String(category).toLowerCase();
  if (quarter && quarter !== "All") filter.quarter = quarter;

  const searchValue = String(search || "").trim();
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

  return filter;
};

const thinBlackBorder = {
  top: { style: "thin", color: { argb: "FF000000" } },
  left: { style: "thin", color: { argb: "FF000000" } },
  bottom: { style: "thin", color: { argb: "FF000000" } },
  right: { style: "thin", color: { argb: "FF000000" } }
};

const styleCell = (cell, options = {}) => {
  cell.font = {
    name: "Arial",
    size: options.size || 10,
    bold: Boolean(options.bold),
    color: { argb: "FF000000" }
  };
  cell.alignment = {
    vertical: "middle",
    horizontal: options.horizontal || "left",
    wrapText: true
  };
  if (options.border !== false) cell.border = thinBlackBorder;
  // Intentionally no fill: user requested no colours.
};

const addMergedRow = (worksheet, text, rowNumber, lastColumn, options = {}) => {
  worksheet.mergeCells(rowNumber, 1, rowNumber, lastColumn);
  const cell = worksheet.getCell(rowNumber, 1);
  cell.value = text;
  styleCell(cell, {
    bold: options.bold,
    size: options.size,
    horizontal: options.horizontal,
    border: options.border
  });
  worksheet.getRow(rowNumber).height = options.height || 24;
};

const appendWebsiteSection = (worksheet, sectionInfo, submissions, maxColumns) => {
  const { role, section } = sectionInfo;
  const fields = sectionFields(section, role);
  const usedColumns = Math.max(1, fields.length + 1); // + S.No
  const records = rowsForWebsiteSection(submissions, role, section);

  // Do not display/export a main question when none of its fields was attempted.
  if (!records.length) return;

  // Question title comes directly from the website question definition.
  const titleRow = worksheet.rowCount + 1;
  addMergedRow(
    worksheet,
    `${section.sectionNo}. ${section.sectionTitle}`,
    titleRow,
    maxColumns,
    { bold: true, size: 11, height: 28 }
  );

  // For one-field single-record questions (website Q1/Q2 style), keep the compact
  // Data Capture layout: question followed directly by its value / No reports.
  if (section.type === "singleRecord" && fields.length === 1) {
    records.forEach((record) => {
      const rowNo = worksheet.rowCount + 1;
      addMergedRow(worksheet, cellValue(record[0]), rowNo, maxColumns, { height: 22 });
    });
    worksheet.addRow([]).height = 8;
    return;
  }

  // Answer-format row, as in the original Data Capture spreadsheet,
  // but the formats are taken from the website definitions.
  const formatRow = worksheet.addRow(["", ...fields.map((field) => field.format || "")]);
  formatRow.height = 22;
  for (let col = 1; col <= usedColumns; col += 1) {
    styleCell(formatRow.getCell(col), { size: 9 });
  }

  // Header row uses website sub-question labels exactly.
  const headerRow = worksheet.addRow(["S.No", ...fields.map((field) => field.label)]);
  headerRow.height = 42;
  for (let col = 1; col <= usedColumns; col += 1) {
    styleCell(headerRow.getCell(col), { bold: true, horizontal: "center" });
  }

  records.forEach((record, recordIndex) => {
    const row = worksheet.addRow([
      recordIndex + 1,
      ...fields.map((field, fieldIndex) => cellValue(record[fieldIndex]))
    ]);

    row.height = 30;
    for (let col = 1; col <= usedColumns; col += 1) {
      styleCell(row.getCell(col), { horizontal: col === 1 ? "center" : "left" });
    }
  });

  worksheet.addRow([]).height = 8;
};

const buildApprovedReportsWorkbook = (submissions, sectionFilter = "All") => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SRIHER IQAC Portal";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Sheet1", {
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true,
      verticalCentered: false,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.4,
        bottom: 0.4,
        header: 0.15,
        footer: 0.15
      }
    }
  });

  // Website currently has a maximum of 15 sub-fields, plus S.No = 16 columns (A:P),
  // matching the width/orientation of the supplied Data Capture workbook.
  const maxFieldCount = Math.max(
    1,
    ...allWebsiteSections.map(({ role, section }) => sectionFields(section, role).length)
  );
  const maxColumns = Math.max(2, maxFieldCount + 1);

  addMergedRow(worksheet, "Data Capture Template", 1, maxColumns, {
    bold: true,
    size: 14,
    horizontal: "center",
    height: 28
  });

  allWebsiteSections
    .filter(({ section }) =>
      sectionFilter === "All" || String(section.sectionNo) === String(sectionFilter)
    )
    .forEach((sectionInfo) => {
      appendWebsiteSection(worksheet, sectionInfo, submissions, maxColumns);
    });

  // Width/orientation tuned for the same wide, landscape Data Capture layout.
  worksheet.getColumn(1).width = 8;
  for (let col = 2; col <= maxColumns; col += 1) {
    worksheet.getColumn(col).width = 25;
  }

  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.properties.defaultRowHeight = 20;
  worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(maxColumns).letter}${worksheet.rowCount}`;

  return workbook;
};

exports.downloadApprovedReportsExcel = async (req, res) => {
  try {
    const submissions = await Submission.find(approvedFilterFromQuery(req))
      .populate("submittedBy", "name email employeeId school department role gender dateOfJoining facultyPhoto employmentType dateOfAppointment dateOfRelieving scopusAuthorId vidwanId")
      .sort({ school: 1, department: 1, role: 1, submittedByName: 1, year: 1, quarter: 1 })
      .lean();

    const workbook = buildApprovedReportsWorkbook(
      submissions,
      req.query.section || "All"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=IQAC_Approved_Reports_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Approved reports Excel export failed:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};