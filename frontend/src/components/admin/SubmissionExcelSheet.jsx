import React, { useMemo } from "react";

const roleName = (role = "") =>
  String(role || "").trim().toLowerCase();

const norm = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const hasValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(hasValue);
  }

  if (typeof value === "object") {
    return Object.values(value).some(hasValue);
  }

  return String(value).trim() !== "";
}

const isFilePath = (value) =>
  typeof value === "string" &&
  (value.startsWith("/uploads/") || value.startsWith("http://") || value.startsWith("https://"));

const fileUrl = (value) =>
  value.startsWith("/") ? `http://localhost:5000${value}` : value;

const displayValue = (value) => {
  if (!hasValue(value)) return "Nil";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (typeof value === "object") {
    if (value.url) return String(value.url);
    if (value.path) return String(value.path);
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${displayValue(val)}`)
      .join(" | ");
  }
  return String(value);
};

function renderReportValue(value) {
  if (!hasValue(value)) {
    return <span style={{ color: "#6b7280" }}>Nil</span>;
  }

  if (isFilePath(value)) {
    const url = fileUrl(String(value));
    const name = String(value).split("/").pop() || "View File";
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#2563eb", fontWeight: 600, textDecoration: "underline" }}
      >
        {name}
      </a>
    );
  }

  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 ? ", " : ""}
            {renderReportValue(item)}
          </React.Fragment>
        ))}
      </>
    );
  }

  if (typeof value === "object") {
    if (value.url || value.path) {
      return renderReportValue(value.url || value.path);
    }
    return Object.entries(value).map(([key, val], index) => (
      <React.Fragment key={key}>
        {index > 0 ? " | " : ""}{key}: {renderReportValue(val)}
      </React.Fragment>
    ));
  }

  return String(value);
}

function answerMapFor(submission) {
  const map = new Map();

  (submission?.answers || []).forEach((item) => {
    if (!item) return;

    if (
      item.questionNo !== undefined &&
      item.questionNo !== null
    ) {
      map.set(
        String(item.questionNo),
        item.answer
      );
    }

    if (item.question) {
      map.set(
        `q:${norm(item.question)}`,
        item.answer
      );
    }
  });

  return map;
}

function sectionAnswer(submission, section) {
  const map = answerMapFor(submission);

  if (
    section?.sectionNo !== undefined &&
    section?.sectionNo !== null &&
    map.has(String(section.sectionNo))
  ) {
    return map.get(String(section.sectionNo));
  }

  const sectionNo = String(section?.sectionNo ?? "");
  const prefixedMatches = (submission?.answers || []).filter((item) => {
    const key = String(item?.questionNo || "");
    return key.startsWith(`${sectionNo}_`) || key === sectionNo;
  });

  if (prefixedMatches.length) {
    const row = {};

    prefixedMatches.forEach((item) => {
      const key = String(item?.questionNo || "");
      const label = item?.question || key;
      row[label] = item?.answer;

      if (key.startsWith(`${sectionNo}_`)) {
        const suffix = key.slice(sectionNo.length + 1);
        if (suffix) {
          row[suffix] = item?.answer;
        }
      }
    });

    return row;
  }

  if (
    section?.sectionTitle &&
    map.has(`q:${norm(section.sectionTitle)}`)
  ) {
    return map.get(
      `q:${norm(section.sectionTitle)}`
    );
  }

  const tableData =
    submission?.tableData || {};

  if (
    section?.sectionNo !== undefined &&
    tableData[String(section.sectionNo)] !==
      undefined
  ) {
    return tableData[String(section.sectionNo)];
  }

  return undefined;
}

function columnsFor(section) {
  if (
    Array.isArray(section?.tableColumns) &&
    section.tableColumns.length
  ) {
    return section.tableColumns.map(
      (column, index) => ({
        key:
          column.key ||
          String(index),

        label:
          column.label ||
          column.key ||
          `Field ${index + 1}`,
      })
    );
  }

  if (
    Array.isArray(section?.questions) &&
    section.questions.length
  ) {
    return section.questions.map(
      (question, index) => ({
        key:
          question.key ||
          question.question ||
          question.id ||
          String(index),

        label:
          question.question ||
          question.label ||
          question.name ||
          `Field ${index + 1}`,
      })
    );
  }

  if (
    Array.isArray(section?.fields) &&
    section.fields.length
  ) {
    return section.fields.map(
      (field, index) => ({
        key:
          field.key ||
          field.question ||
          field.id ||
          String(index),

        label:
          field.label ||
          field.question ||
          field.name ||
          field.key ||
          `Field ${index + 1}`,
      })
    );
  }

  return [
    {
      key: "value",
      label: "Answer",
    },
  ];
}

function rowsFor(section, submission) {
  if (roleName(submission?.role) === "faculty" && isFacultyDetailsSection(section)) {
    const profile = submission?.submittedBy || {};
    const oldAnswers = answerMapFor(submission);
    const profileValues = [
      profile.name || submission?.submittedByName,
      profile.facultyPhoto,
      profile.designation,
      profile.employmentType,
      profile.dateOfAppointment || profile.dateOfJoining,
      profile.dateOfRelieving,
      profile.scopusAuthorId,
      profile.vidwanId,
    ];

    const row = {};
    (section.questions || []).forEach((question, index) => {
      row[question.question] = hasValue(profileValues[index])
        ? profileValues[index]
        : oldAnswers.get(`${section.sectionNo}_${index}`);
    });

    return [row];
  }

  const answer = sectionAnswer(
    submission,
    section
  );

  const sectionNo = String(section?.sectionNo ?? "");
  const prefixedAnswers = (submission?.answers || []).filter((item) => {
    const key = String(item?.questionNo || "");
    return key.startsWith(`${sectionNo}_`) || key === sectionNo;
  });

  const hasPrefixedFieldAnswers = prefixedAnswers.some((item) =>
    String(item?.questionNo || "").startsWith(`${sectionNo}_`)
  );

  if (hasPrefixedFieldAnswers && prefixedAnswers.some((item) => hasValue(item?.answer))) {
    const row = {};

    prefixedAnswers.forEach((item) => {
      const key = String(item?.questionNo || "");
      const safeKey = key.startsWith(`${sectionNo}_`)
        ? key.slice(sectionNo.length + 1)
        : "value";

      row[safeKey] = item?.answer;

      if (item?.question) {
        row[item.question] = item.answer;
      }
    });

    return [row];
  }

  if (
    section?.type === "table" ||
    section?.repeatable ||
    Array.isArray(answer)
  ) {
    if (Array.isArray(answer)) {
      return answer.filter(hasValue);
    }

    if (
      answer &&
      typeof answer === "object"
    ) {
      return [answer];
    }

    return [];
  }

  if (
    answer &&
    typeof answer === "object" &&
    hasValue(answer)
  ) {
    return [answer];
  }

  if (hasValue(answer)) {
    return [
      {
        value: answer,
      },
    ];
  }

  return [];
}

/* ============================================================
   SECTION 3 SPECIAL LOGIC
   ============================================================

   Section 3 = Faculty Details.

   Oru faculty multiple quarters submit panninaalum
   same faculty ONE TIME mattum display aagum.

   Example:

   Quarter 1 -> Arun
   Quarter 2 -> Arun
   Quarter 3 -> Arun

   Result:

   Arun

   Vera faculty:

   Quarter 1 -> Priya
   Quarter 2 -> Priya
   Result:

   Priya
*/

function isFacultyDetailsSection(section) {
  const title = norm(
    section?.sectionTitle
  );

  const number =
    String(section?.sectionNo ?? "");

  return (
    number === "3" ||
    title.includes("facultydetails")
  );
}

function facultyIdentity(row, submission) {
  /*
    First preference:
    Name of Faculty.

    If name is not available, fallback to
    submission user/name.
  */

  const possibleNames = [
    row?.Name,
    row?.name,
    row?.facultyName,
    row?.faculty_name,
    row?.["Name of the Faculty"],
    row?.["name of the faculty"],
    row?.Faculty,
    row?.faculty,
    submission?.submittedByName,
    submission?.submittedBy?.name,
  ];

  const name =
    possibleNames.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );

  if (!name) {
    return null;
  }

  return norm(name);
}

function mergeFacultyRows(submissions, section) {
  const uniqueFaculty = new Map();

  /*
    Consolidate the same faculty across all approved quarters.

    The faculty name is the identity, so a person such as
    Christopher Tamilmathi or Poornima Devi appears only once,
    even when the same person has submissions in multiple quarters.

    We do NOT simply keep the first quarter's row.  If a later
    quarter contains a value that was missing earlier, that value
    is used to complete the faculty's single consolidated row.
  */
  submissions.forEach((submission) => {
    const rows = rowsFor(section, submission);

    rows.forEach((row) => {
      if (!row || typeof row !== "object") return;

      const identity = facultyIdentity(row, submission);
      if (!identity) return;

      if (!uniqueFaculty.has(identity)) {
        uniqueFaculty.set(identity, {
          row: { ...row },
          submission,
        });
        return;
      }

      const existing = uniqueFaculty.get(identity);

      Object.keys(row).forEach((key) => {
        const currentValue = existing.row[key];
        const incomingValue = row[key];

        if (!hasValue(currentValue) && hasValue(incomingValue)) {
          existing.row[key] = incomingValue;
        }
      });

      // Also merge by normalized field name so that the same field
      // written with slightly different key casing/spelling is not lost.
      Object.keys(row).forEach((incomingKey) => {
        if (hasValue(existing.row[incomingKey])) return;

        const normalizedIncoming = norm(incomingKey);
        const existingKey = Object.keys(existing.row).find(
          (key) => norm(key) === normalizedIncoming
        );

        if (!existingKey && hasValue(row[incomingKey])) {
          existing.row[incomingKey] = row[incomingKey];
        }
      });
    });
  });

  return Array.from(uniqueFaculty.values());
}

function valueFromRow(
  row,
  column,
  index,
  section = null
) {
  if (Array.isArray(row)) {
    return row[index];
  }

  if (!row || typeof row !== "object") {
    return index === 0 ? row : undefined;
  }

  // Dean Q1/Q2 are single-record fields. Always show only the
  // actual answer, never the internal object/key structure.
  if (
    section?.type === "singleRecord" &&
    Array.isArray(section?.fields) &&
    section.fields.length === 1
  ) {
    const field = section.fields[0];
    const candidates = [
      field?.key,
      field?.label,
      column?.key,
      column?.label,
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (Object.prototype.hasOwnProperty.call(row, candidate)) {
        return row[candidate];
      }

      const target = norm(candidate);
      const actual = Object.keys(row).find(
        (key) => norm(key) === target
      );

      if (actual) return row[actual];
    }

    // Some saved submissions contain the single-record answer as
    // { value: ... } or as a one-property object. Return the value only.
    if (Object.prototype.hasOwnProperty.call(row, "value")) {
      return row.value;
    }

    const keys = Object.keys(row);
    if (keys.length === 1) {
      return row[keys[0]];
    }
  }

  const candidates = [
    column.key,
    column.label,
    column.question,
    column.name,
    column.id,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (Object.prototype.hasOwnProperty.call(row, candidate)) {
      return row[candidate];
    }

    const target = norm(candidate);
    const actual = Object.keys(row).find(
      (key) => norm(key) === target
    );

    if (actual) return row[actual];
  }

  // Never use another object's value by column position.
  return undefined;
}

function formatApprovedReportValue(value, section, column) {
  // Year of Establishment must be displayed as the year only.
  if (
    String(section?.sectionNo ?? "") === "1" &&
    norm(section?.sectionTitle).includes("yearofestablishment")
  ) {
    return "1985";
  }

  // College / Faculty of the University should display only the
  // answer text, not an object such as { collegeFaculty: "..." }.
  if (
    String(section?.sectionNo ?? "") === "2" &&
    norm(section?.sectionTitle).includes("collegefaculty")
  ) {
    if (!hasValue(value)) return "Nil";
    if (typeof value === "object" && !Array.isArray(value)) {
      const fieldKey = section?.fields?.[0]?.key;
      if (fieldKey && hasValue(value[fieldKey])) {
        return displayValue(value[fieldKey]);
      }

      const values = Object.values(value).filter(hasValue);
      if (values.length === 1) return displayValue(values[0]);
    }
  }

  return displayValue(value);
}

function SubmissionExcelSheet({
  submissions = [],
  questionSets = {},
  categoryFilter = "All",
  sectionFilter = "All",
}) {
  const orderedSubmissions =
    useMemo(() => {
      return [...submissions].sort(
        (a, b) =>
          new Date(b?.updatedAt || b?.createdAt || 0) -
          new Date(a?.updatedAt || a?.createdAt || 0)
      );
    }, [submissions]);

  const sections =
    useMemo(() => {
      const roleEntries = [
        { role: "dean", questions: questionSets?.dean },
        { role: "hod", questions: questionSets?.hod },
        { role: "faculty", questions: questionSets?.faculty },
      ];
      return roleEntries
        .flatMap(({ role, questions }) =>
          Array.isArray(questions)
            ? questions.map((section) => ({ ...section, sourceRole: role }))
            : []
        )
        .filter((section) =>
          categoryFilter === "All" || section.sourceRole === categoryFilter
        )
        .filter((section) =>
          sectionFilter === "All" || String(section.sectionNo) === String(sectionFilter)
        )
        .sort((a, b) => {
          const aNo = Number.parseFloat(String(a?.sectionNo ?? "").replace(/[^0-9.]/g, ""));
          const bNo = Number.parseFloat(String(b?.sectionNo ?? "").replace(/[^0-9.]/g, ""));

          if (Number.isNaN(aNo) && Number.isNaN(bNo)) return 0;
          if (Number.isNaN(aNo)) return 1;
          if (Number.isNaN(bNo)) return -1;
          return aNo - bNo;
        });
    }, [orderedSubmissions, questionSets, categoryFilter, sectionFilter]);

  if (!orderedSubmissions.length) {
    return (
      <div style={emptyStyle}>
        No approved submissions found.
      </div>
    );
  }

  return (
    <div style={outerSheet}>
      {sections.map((section) => {
        const sourceSubmissions = orderedSubmissions.filter(
          (submission) => roleName(submission?.role) === section.sourceRole
        );
        const isFacultySection = isFacultyDetailsSection(section);
        const columns = columnsFor(section);
        const facultyRows = isFacultySection
          ? mergeFacultyRows(sourceSubmissions, section)
          : [];
        const allRows = isFacultySection
          ? facultyRows.map((item) => ({
              submission: item.submission,
              row: item.row,
              isPlaceholder: false,
            }))
          : sourceSubmissions.flatMap((submission) => {
              const rows = rowsFor(section, submission);
              return rows.length
                ? rows.map((row) => ({ submission, row, isPlaceholder: false }))
                : [];
            }).filter(({ row }) => hasValue(row));
        const hasRows = allRows.length > 0;

        return (
          <section
            key={`${section.sourceRole}-${section.sectionNo}-${section.sectionTitle}`}
            style={sectionWrap}
          >
            <div style={questionTitle}>
              Question {section.sectionNo}. {section.sectionTitle}
            </div>
            <table style={sheetTable}>
              <thead>
                <tr>
                  <th style={serialHead}>S.No</th>
                  {columns.map((column) => (
                    <th key={column.key} style={fieldHead}>
                      {column.label}
                    </th>
                  ))}
                  <th style={fieldHead}>Submitted By</th>
                </tr>
              </thead>
              <tbody>
                {!hasRows ? (
                  <tr>
                    <td style={cell} colSpan={columns.length + 2}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>
                        No reports
                      </span>
                    </td>
                  </tr>
                ) : allRows.map(({ submission, row, isPlaceholder }, index) => {
                  const name =
                    submission?.submittedByName ||
                    submission?.submittedBy?.name ||
                    (isPlaceholder ? "Nil" : "Unknown");

                  const quarter = submission?.quarter
                    ? ` · ${submission.quarter}`
                    : "";
                  const school = submission?.school || "";
                  const department = submission?.department || "";

                  return (
                    <tr
                      key={
                        isFacultySection
                          ? `faculty-${facultyIdentity(row, submission) || "unknown"}-${index}`
                          : `${submission?._id || "empty"}-${index}`
                      }
                    >
                      <td style={cell}>{index + 1}</td>
                      {columns.map((column, colIndex) => (
                        <td key={`${column.key}-${colIndex}`} style={cell}>
                          {renderReportValue(
                            formatApprovedReportValue(
                              valueFromRow(row, column, colIndex, section),
                              section,
                              column
                            )
                          )}
                        </td>
                      ))}
                      <td style={cell}>
                        {isPlaceholder ? (
                          <span style={{ color: "#9ca3af" }}>Nil</span>
                        ) : (
                          <>
                            <strong>{name}</strong>
                            <div style={metaDark}>
                              {school} · {(submission?.role || "").toUpperCase()} · {department} · {quarter || ""}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        );
      })}

      {!sections.length && (
        <div style={emptyStyle}>
          No approved report data is available for the selected filters.
        </div>
      )}
    </div>
  );
}

const outerSheet = { background: "#fff", border: "1px solid #b7c4d4", overflowX: "auto", padding: 0 };
const roleTitle = { background: "#0f4c75", color: "#fff", padding: "14px 16px", fontSize: 17, fontWeight: 700 };
const noRecordsStyle = { padding: "18px 14px", color: "#6b7280", fontWeight: 600, background: "#f8fafc" };
const sectionWrap = { minWidth: 1100, margin: 0, borderBottom: "1px solid #9fb2c8" };
const questionTitle = { background: "#d9e6f2", color: "#111827", padding: "11px 14px", fontWeight: 700, borderTop: "1px solid #9fb2c8", borderBottom: "1px solid #9fb2c8" };
const sheetTable = { width: "100%", borderCollapse: "collapse", tableLayout: "auto" };
const serialHead = { width: 55, background: "#164e70", color: "#fff", padding: "10px 8px", border: "1px solid #b7c4d4", textAlign: "center", verticalAlign: "top" };
const fieldHead = { background: "#164e70", color: "#fff", padding: "10px 10px", border: "1px solid #b7c4d4", textAlign: "left", verticalAlign: "top", minWidth: 170 };
const cell = { padding: "9px 10px", border: "1px solid #cbd5e1", verticalAlign: "top", lineHeight: 1.45, whiteSpace: "normal" };
const metaDark = { fontSize: 11, color: "#64748b", marginTop: 3 };
const emptyStyle = { background: "#fff", borderRadius: 12, padding: 30, textAlign: "center", color: "#64748b", boxShadow: "0 2px 10px rgba(0,0,0,.05)" };

export default SubmissionExcelSheet;