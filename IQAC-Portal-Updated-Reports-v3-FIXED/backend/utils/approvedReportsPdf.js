const PDFDocument = require("pdfkit");

const facultyQuestions = require("../data/facultyQuestions");
const hodQuestions = require("../data/hodQuestions");
const deanQuestions = require("../data/deanQuestions");

const QUESTION_SETS = {
  faculty: facultyQuestions,
  hod: hodQuestions,
  dean: deanQuestions,
};

// Keep the PDF visually consistent with the approved-report Excel export:
// - one continuous worksheet-like flow
// - landscape / very wide page
// - black text and black grid/borders only
// - question -> format -> headers -> data
// - pages break only when the physical PDF page is full, never once per question
const PAGE = {
  width: 2383.94,
  height: 1683.78,
  margin: 32,
};

const BORDER = "#000000";
const TEXT = "#000000";
const FONT = "Helvetica";
const BOLD = "Helvetica-Bold";

const clean = (value) => {
  if (value === undefined || value === null || value === "") return "Nil";
  if (Array.isArray(value)) {
    const values = value.filter(hasMeaningfulValue).map(clean);
    return values.length ? values.join(", ") : "Nil";
  }
  if (typeof value === "object") {
    if (value.url) return String(value.url);
    if (value.path) return String(value.path);
    if (value.filename) return String(value.filename);
    const values = Object.values(value).filter(hasMeaningfulValue).map(clean);
    return values.length ? values.join(" | ") : "Nil";
  }
  return String(value);
};

const hasMeaningfulValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);
  if (typeof value === "object") return Object.values(value).some(hasMeaningfulValue);
  return true;
};

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const sectionFields = (section, role) => {
  if (role === "faculty") {
    return (section.questions || []).map((item, index) => ({
      key: String(index),
      label: item.question || `Field ${index + 1}`,
      format: item.answerFormat || item.type || "",
    }));
  }

  const source = section.tableColumns || section.fields || section.questions || [];
  return source.map((item, index) => ({
    key: item.key ?? String(index),
    label: item.label || item.question || item.key || `Field ${index + 1}`,
    format: item.answerFormat || item.type || "",
  }));
};

const findSectionAnswerItem = (submission, sectionNo) => {
  const answers = Array.isArray(submission.answers) ? submission.answers : [];
  return answers.find((item) => String(item.questionNo) === String(sectionNo));
};

const readStructuredSectionValue = (submission, sectionNo) => {
  const item = findSectionAnswerItem(submission, sectionNo);
  if (item && hasMeaningfulValue(item.answer)) return item.answer;

  const tableData = submission.tableData || {};
  const fallback = tableData[String(sectionNo)] ?? tableData[sectionNo];
  return hasMeaningfulValue(fallback) ? fallback : undefined;
};

const facultyRecord = (submission, section) => {
  const answers = Array.isArray(submission.answers) ? submission.answers : [];
  const fields = sectionFields(section, "faculty");

  const matched = fields.map((field, index) => {
    const exactKey = `${section.sectionNo}_${index}`;
    let item = answers.find((answer) => String(answer.questionNo) === exactKey);

    if (!item) {
      const target = normalizeText(field.label);
      item = answers.find((answer) => normalizeText(answer.question) === target);
    }

    return item ? item.answer : undefined;
  });

  return matched.some(hasMeaningfulValue) ? matched : null;
};

const structuredRecords = (submission, section, role) => {
  const raw = readStructuredSectionValue(submission, section.sectionNo);
  if (!hasMeaningfulValue(raw)) return [];

  const fields = sectionFields(section, role);

  if (section.type === "table") {
    const rows = Array.isArray(raw) ? raw : [raw];

    return rows
      .filter((row) => hasMeaningfulValue(row))
      .map((row) => {
        if (row && typeof row === "object" && !Array.isArray(row)) {
          return fields.map((field) => row[field.key]);
        }
        return fields.length === 1 ? [row] : fields.map(() => undefined);
      })
      .filter((row) => row.some(hasMeaningfulValue));
  }

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const row = fields.map((field) => raw[field.key]);
    return row.some(hasMeaningfulValue) ? [row] : [];
  }

  if (fields.length === 1 && hasMeaningfulValue(raw)) return [[raw]];
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
  const relevant = submissions.filter(
    (submission) => String(submission.role || "").toLowerCase() === role
  );
  const rows = [];

  if (role === "faculty") {
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

const sectionOwnerMap = (() => {
  const map = new Map();
  Object.entries(QUESTION_SETS).forEach(([role, sections]) => {
    (sections || []).forEach((section) => {
      map.set(`${role}:${section.sectionNo}`, { role, section });
    });
  });
  return map;
})();

const allWebsiteSections = Array.from(sectionOwnerMap.values()).sort((a, b) => {
  const an = Number.parseFloat(String(a.section.sectionNo).replace(/[^0-9.]/g, ""));
  const bn = Number.parseFloat(String(b.section.sectionNo).replace(/[^0-9.]/g, ""));
  if (an !== bn) return an - bn;
  const roleOrder = { faculty: 0, hod: 1, dean: 2 };
  return roleOrder[a.role] - roleOrder[b.role];
});

const maxFieldCount = Math.max(
  1,
  ...allWebsiteSections.map(({ role, section }) => sectionFields(section, role).length)
);
const TOTAL_COLUMNS = Math.max(2, maxFieldCount + 1); // S.No + website fields

const contentWidth = PAGE.width - PAGE.margin * 2;
const firstColumnWidth = 72;
const fieldColumnWidth = (contentWidth - firstColumnWidth) / Math.max(1, TOTAL_COLUMNS - 1);

function pageTop(doc) {
  return PAGE.margin;
}

function drawCell(doc, text, x, y, width, height, options = {}) {
  doc
    .lineWidth(0.7)
    .strokeColor(BORDER)
    .rect(x, y, width, height)
    .stroke();

  doc
    .font(options.bold ? BOLD : FONT)
    .fontSize(options.fontSize || 9)
    .fillColor(TEXT)
    .text(String(text ?? ""), x + 5, y + 4, {
      width: Math.max(1, width - 10),
      height: Math.max(1, height - 8),
      align: options.align || "left",
      valign: "center",
      lineGap: 1,
      ellipsis: false,
    });
}

function estimateRowHeight(doc, values, widths, fontSize, minimum = 24, maximum = 105) {
  let maxHeight = minimum;

  values.forEach((value, index) => {
    doc.font(FONT).fontSize(fontSize);
    const h = doc.heightOfString(String(value ?? ""), {
      width: Math.max(20, widths[index] - 10),
      lineGap: 1,
    });
    maxHeight = Math.max(maxHeight, h + 9);
  });

  return Math.min(maximum, maxHeight);
}

function drawMainHeader(doc) {
  const y = pageTop(doc);
  doc
    .font(BOLD)
    .fontSize(16)
    .fillColor(TEXT)
    .text("Data Capture Template", PAGE.margin, y, {
      width: contentWidth,
      align: "center",
    });
  return y + 28;
}

function drawSectionTitle(doc, section, y) {
  const height = 32;
  drawCell(
    doc,
    `${section.sectionNo}. ${section.sectionTitle || ""}`,
    PAGE.margin,
    y,
    contentWidth,
    height,
    { bold: true, fontSize: 10 }
  );
  return y + height;
}

function drawFormatAndHeader(doc, fields, y) {
  const widths = [firstColumnWidth, ...fields.map(() => fieldColumnWidth)];
  const visibleWidths = widths.length < TOTAL_COLUMNS
    ? [...widths, ...Array(TOTAL_COLUMNS - widths.length).fill(fieldColumnWidth)]
    : widths;

  // Format row: exactly like the Excel export, with blank S.No cell.
  const formatValues = ["", ...fields.map((field) => field.format || "")];
  while (formatValues.length < TOTAL_COLUMNS) formatValues.push("");

  const formatHeight = 25;
  let x = PAGE.margin;
  formatValues.forEach((value, index) => {
    drawCell(doc, value, x, y, visibleWidths[index], formatHeight, {
      fontSize: 8,
      align: "left",
    });
    x += visibleWidths[index];
  });

  y += formatHeight;

  const headerValues = ["S.No", ...fields.map((field) => field.label)];
  while (headerValues.length < TOTAL_COLUMNS) headerValues.push("");

  const headerHeight = 52;
  x = PAGE.margin;
  headerValues.forEach((value, index) => {
    drawCell(doc, value, x, y, visibleWidths[index], headerHeight, {
      bold: true,
      fontSize: 8.5,
      align: "center",
    });
    x += visibleWidths[index];
  });

  return { y: y + headerHeight, widths: visibleWidths };
}

function drawNoReports(doc, y, widths) {
  const height = 28;
  let x = PAGE.margin;
  drawCell(doc, "No reports", x, y, widths.reduce((a, b) => a + b, 0), height, {
    fontSize: 9,
  });
  return y + height;
}

function drawSingleRecordValue(doc, y, value) {
  const height = 28;
  drawCell(doc, clean(value), PAGE.margin, y, contentWidth, height, { fontSize: 9 });
  return y + height;
}

function drawDataRows(doc, records, fields, y, widths, responseStart = 1) {
  let serial = responseStart;
  const fontSize = fields.length > 12 ? 7.5 : fields.length > 9 ? 8 : 8.5;

  for (const record of records) {
    const values = [serial, ...fields.map((field, index) => clean(record[index]))];
    while (values.length < TOTAL_COLUMNS) values.push("");

    const rowHeight = estimateRowHeight(doc, values, widths, fontSize);
    if (y + rowHeight > PAGE.height - PAGE.margin) {
      return { y, serial, complete: false };
    }

    let x = PAGE.margin;
    values.forEach((value, index) => {
      drawCell(doc, value, x, y, widths[index], rowHeight, {
        fontSize,
        align: index === 0 ? "center" : "left",
      });
      x += widths[index];
    });

    y += rowHeight;
    serial += 1;
  }

  return { y, serial, complete: true };
}

function addContinuationPage(doc, section, fields) {
  doc.addPage({ size: [PAGE.width, PAGE.height], layout: "landscape", margin: 0 });
  let y = pageTop(doc);
  doc
    .font(BOLD)
    .fontSize(12)
    .fillColor(TEXT)
    .text(`Data Capture Template — ${section.sectionNo}. ${section.sectionTitle || ""}`, PAGE.margin, y, {
      width: contentWidth,
      align: "left",
    });
  y += 24;
  return drawFormatAndHeader(doc, fields, y).y;
}

function renderSection(doc, sectionInfo, submissions) {
  const { role, section } = sectionInfo;
  const fields = sectionFields(section, role);
  const records = rowsForWebsiteSection(submissions, role, section);

  let y = doc.y;
  if (y < PAGE.margin + 25) y = PAGE.margin + 25;

  // If the next section title/header would not fit, move to the next physical page.
  if (y + 110 > PAGE.height - PAGE.margin) {
    doc.addPage({ size: [PAGE.width, PAGE.height], layout: "landscape", margin: 0 });
    y = drawMainHeader(doc);
  }

  y = drawSectionTitle(doc, section, y);

  // Single-value sections match the compact Excel representation.
  if (section.type === "singleRecord" && fields.length === 1) {
    if (!records.length) {
      y = drawSingleRecordValue(doc, y, "No reports");
    } else {
      for (const record of records) {
        if (y + 28 > PAGE.height - PAGE.margin) {
          doc.addPage({ size: [PAGE.width, PAGE.height], layout: "landscape", margin: 0 });
          y = drawMainHeader(doc);
        }
        y = drawSingleRecordValue(doc, y, record[0]);
      }
    }
    doc.y = y + 8;
    return;
  }

  let header = drawFormatAndHeader(doc, fields, y);
  y = header.y;
  const widths = header.widths;

  if (!records.length) {
    if (y + 28 > PAGE.height - PAGE.margin) {
      doc.addPage({ size: [PAGE.width, PAGE.height], layout: "landscape", margin: 0 });
      y = drawMainHeader(doc);
      y = drawSectionTitle(doc, section, y);
      header = drawFormatAndHeader(doc, fields, y);
      y = header.y;
    }
    y = drawNoReports(doc, y, widths);
    doc.y = y + 8;
    return;
  }

  let result = drawDataRows(doc, records, fields, y, widths, 1);
  y = result.y;
  let serial = result.serial;

  while (!result.complete) {
    doc.addPage({ size: [PAGE.width, PAGE.height], layout: "landscape", margin: 0 });
    y = addContinuationPage(doc, section, fields);
    result = drawDataRows(doc, records.slice(serial - 1), fields, y, widths, serial);
    y = result.y;
    serial = result.serial;
  }

  doc.y = y + 8;
}

module.exports = function generateApprovedReportsPdf(res, submissions, sectionFilter = "All") {
  const doc = new PDFDocument({
    size: [PAGE.width, PAGE.height],
    layout: "landscape",
    margin: 0,
    bufferPages: false,
    autoFirstPage: true,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="IQAC_Approved_Reports.pdf"');
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  doc.pipe(res);

  let y = drawMainHeader(doc);
  doc.y = y;

  if (!submissions.length) {
    drawCell(doc, "No approved reports found.", PAGE.margin, doc.y + 10, contentWidth, 30, {
      fontSize: 10,
    });
    doc.end();
    return;
  }

  const entries = allWebsiteSections.filter(({ role, section }) =>
    (sectionFilter === "All" || String(section.sectionNo) === String(sectionFilter)) &&
    rowsForWebsiteSection(submissions, role, section).length > 0
  );

  let renderedAny = false;

  for (const entry of entries) {
    renderSection(doc, entry, submissions);
    renderedAny = true;
  }

  if (!renderedAny) {
    drawCell(doc, "No reports", PAGE.margin, doc.y + 10, contentWidth, 30, { fontSize: 10 });
  }

  doc.end();
};
