import React from "react";

const roleLabel = (role) => {
  if (role === "faculty") return "Faculty";
  if (role === "hod") return "HOD";
  if (role === "dean") return "Dean";
  return role || "-";
};

const roleBadgeStyle = (role) => {
  const backgrounds = {
    faculty: "#dcfce7",
    hod: "#fef3c7",
    dean: "#dbeafe"
  };

  const colors = {
    faculty: "#047857",
    hod: "#b45309",
    dean: "#1d4ed8"
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "72px",
    padding: "6px 10px",
    borderRadius: "6px",
    background: backgrounds[role] || "#f3f4f6",
    color: colors[role] || "#374151",
    fontSize: "12px",
    fontWeight: 700,
    border: "1px solid rgba(0,0,0,0.06)"
  };
};

const statusStyle = (status) => {
  if (!status) return {};

  if (status.toLowerCase().includes("approved")) {
    return {
      background: "#dcfce7",
      color: "#166534"
    };
  }

  if (status.toLowerCase().includes("rejected")) {
    return {
      background: "#fee2e2",
      color: "#b91c1c"
    };
  }

  return {
    background: "#fef3c7",
    color: "#92400e"
  };
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const cellStyle = {
  padding: "13px 14px",
  borderRight: "1px solid #e5e7eb",
  borderBottom: "1px solid #e5e7eb",
  color: "#1f2937",
  fontSize: "13px",
  verticalAlign: "middle",
  whiteSpace: "nowrap"
};

function AdminReportGrid({
  reports,
  loading,
  onView,
  onDownload
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 18px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f8fafc"
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              color: "#111827"
            }}
          >
            Submission Reports
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7280",
              fontSize: "12px"
            }}
          >
            Spreadsheet-style view of all available IQAC submissions.
          </p>
        </div>

        <div
          style={{
            padding: "7px 11px",
            borderRadius: "6px",
            background: "#e5edff",
            color: "#1d4ed8",
            fontSize: "12px",
            fontWeight: 700
          }}
        >
          {reports.length} {reports.length === 1 ? "record" : "records"}
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "calc(100vh - 400px)"
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "1250px",
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "auto"
          }}
        >
          <thead>
            <tr>
              {[
                "S.No",
                "Name",
                "Email",
                "Category",
                "School / Faculty",
                "Department",
                "Quarter",
                "Year",
                "Submitted Date",
                "Status",
                "Answered",
                "Unanswered",
                "Actions"
              ].map((heading, index) => (
                <th
                  key={heading}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    padding: "12px 14px",
                    background: "#1d4ed8",
                    color: "#ffffff",
                    borderRight: "1px solid rgba(255,255,255,0.18)",
                    fontSize: "12px",
                    fontWeight: 700,
                    textAlign: index === 0 ? "center" : "left",
                    whiteSpace: "nowrap"
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={13}
                  style={{
                    padding: "45px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px"
                  }}
                >
                  Loading reports...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  style={{
                    padding: "45px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px"
                  }}
                >
                  No reports found for the selected filters.
                </td>
              </tr>
            ) : (
              reports.map((report, index) => {
                const name =
                  report.submittedByName ||
                  report.submittedBy?.name ||
                  "-";

                const email =
                  report.submittedByEmail ||
                  report.submittedBy?.email ||
                  "-";

                const school =
                  report.school ||
                  report.submittedBy?.school ||
                  "-";

                const department =
                  report.department ||
                  report.submittedBy?.department ||
                  "-";

                return (
                  <tr
                    key={report._id}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#f8fafc"
                    }}
                  >
                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#6b7280"
                      }}
                    >
                      {index + 1}
                    </td>

                    <td style={{ ...cellStyle, fontWeight: 700 }}>
                      {name}
                    </td>

                    <td style={{ ...cellStyle, color: "#4b5563" }}>
                      {email}
                    </td>

                    <td style={cellStyle}>
                      <span style={roleBadgeStyle(report.role)}>
                        {roleLabel(report.role)}
                      </span>
                    </td>

                    <td style={{ ...cellStyle, fontWeight: 600 }}>
                      {school}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        whiteSpace: "normal",
                        minWidth: "230px",
                        maxWidth: "340px"
                      }}
                    >
                      {department}
                    </td>

                    <td style={{ ...cellStyle, textAlign: "center", fontWeight: 700 }}>
                      {report.quarter || "-"}
                    </td>

                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      {report.year || "-"}
                    </td>

                    <td style={cellStyle}>
                      {formatDate(report.createdAt || report.submittedDate)}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          ...statusStyle(report.status),
                          display: "inline-block",
                          padding: "6px 9px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 700,
                          whiteSpace: "nowrap"
                        }}
                      >
                        {report.status || "-"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#047857"
                      }}
                    >
                      {report.answeredCount ?? 0}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#b91c1c"
                      }}
                    >
                      {report.unansweredCount ?? 0}
                    </td>

                    <td style={cellStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "7px"
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onView(report._id)}
                          style={{
                            border: "none",
                            borderRadius: "6px",
                            padding: "7px 11px",
                            background: "#2563eb",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => onDownload(report._id, report.quarter)}
                          style={{
                            border: "none",
                            borderRadius: "6px",
                            padding: "7px 11px",
                            background: "#16a34a",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && reports.length > 0 && (
        <div
          style={{
            padding: "10px 16px",
            background: "#f8fafc",
            borderTop: "1px solid #e5e7eb",
            color: "#6b7280",
            fontSize: "11px"
          }}
        >
          Tip: scroll horizontally to see all spreadsheet columns.
        </div>
      )}
    </div>
  );
}

export default AdminReportGrid;
