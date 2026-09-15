import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DeanLayout from "../../layouts/DeanLayout";

import {
  getHodSubmissionById
} from "../../api/deanApi";

import hodQuestions from "../../data/hodQuestions";
function getAnswer(answers, questionNo) {

  const item = answers.find(
    (a) => String(a.questionNo) === String(questionNo)
  );

  return item ? item.answer : null;

}

function isImage(value) {

  if (!value) return false;

  return (
    value.endsWith(".jpg") ||
    value.endsWith(".jpeg") ||
    value.endsWith(".png") ||
    value.endsWith(".webp")
  );

}

function isFile(value) {

  if (!value) return false;

  return (
    value.endsWith(".pdf") ||
    value.endsWith(".doc") ||
    value.endsWith(".docx") ||
    value.endsWith(".xls") ||
    value.endsWith(".xlsx")
  );

}

function DeanHodView() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadSubmission();

  }, []);

  const loadSubmission = async () => {

    try {

      const res =
        await getHodSubmissionById(id);

      setSubmission(res.data.submission);

    }

    catch (err) {

      console.error(err);

    }

    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <DeanLayout>

        <div style={{ padding: 40 }}>

          Loading...

        </div>

      </DeanLayout>

    );

  }

  if (!submission) {

    return (

      <DeanLayout>

        <div style={{ padding: 40 }}>

          Submission Not Found

        </div>

      </DeanLayout>

    );

  }

  return (

    <DeanLayout>

      <div
        style={{
          padding: "35px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
                <button
          onClick={() => navigate(-1)}
          style={{
            position: "fixed",
            top: "90px",
            right: "30px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            zIndex: 9999
          }}
        >
          ✖ Close
        </button>

        <h1
          style={{
            marginBottom: "30px",
            color: "#1e293b"
          }}
        >
          HOD Submission Details
        </h1>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "35px",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)"
          }}
        >

          <h2
            style={{
              color: "#2563eb",
              marginBottom: "20px"
            }}
          >
            HOD Information
          </h2>

          <table
            style={{
              width: "100%"
            }}
          >

            <tbody>

              <InfoRow
                title="HOD Name"
                value={submission.submittedByName}
              />

              <InfoRow
                title="Email"
                value={submission.submittedByEmail}
              />

              <InfoRow
                title="School"
                value={submission.school}
              />

              <InfoRow
                title="Department"
                value={submission.department}
              />

              <InfoRow
                title="Quarter"
                value={submission.quarter}
              />

              <tr>

                <td style={infoTitle}>
                  Status
                </td>

                <td style={infoValue}>

                  <span
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontWeight: "600"
                    }}
                  >
                    {submission.status}
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>
                <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,1fr)",
            gap: "25px",
            marginBottom: "40px"
          }}
        >

          <SummaryCard
            title="Total Questions"
            value={submission.totalQuestions}
            color="#2563eb"
          />

          <SummaryCard
            title="Answered"
            value={submission.answeredCount}
            color="#16a34a"
          />

          <SummaryCard
            title="Unanswered"
            value={submission.unansweredCount}
            color="#dc2626"
          />

        </div>

        {/* PART 2 STARTS HERE */}
        <h2
  style={{
    color: "#2563eb",
    marginBottom: "25px"
  }}
>
  HOD Responses
</h2>

{
  hodQuestions.map((section) => (

    <div
      key={section.sectionNo}
      style={{
        marginBottom: "35px"
      }}
    >

      <div
        style={{
          background: "#2563eb",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "10px",
          fontWeight: "700",
          fontSize: "20px",
          marginBottom: "20px"
        }}
      >

        {section.sectionTitle}

      </div>

      <div
  style={{
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
    overflow: "hidden"
  }}
>

  {
    [section].map((question, index) => {

      // Dynamic Table -> Part 4
      if (question.type === "table") {

  const rows =
getAnswer(
  submission.answers,
  question.sectionNo
) || [];

  const displayRows =
  rows.length
    ? rows
    : [
        Object.fromEntries(
          question.tableColumns.map(col => [
            col.key,
            ""
          ])
        )
      ];

  return (

    <div
      key={index}
      style={{
        borderBottom:
          "1px solid #e5e7eb",
        padding: "22px"
      }}
    >

      <h3
        style={{
          color: "#2563eb",
          marginBottom: "20px"
        }}
      >
        {question.sectionNo}. {question.sectionTitle}
      </h3>

      {

        displayRows.map(

          (record, recordIndex) => (

            <div
              key={recordIndex}
              style={{
                border:
                  "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                background:
                  "#f8fafc"
              }}
            >

              <h4
                style={{
                  color: "#1d4ed8",
                  marginBottom: "20px"
                }}
              >
                Record {recordIndex + 1}
              </h4>

              {

                question.tableColumns.map(

                  (column, columnIndex) => {

                    const value =
                      record?.[
                        column.key
                      ];

                    const text =
value === undefined ||
value === null ||
value === ""
? "NIL"
: value;

                    return (

                      <div
                        key={columnIndex}
                        style={{
                          marginBottom:
                            "18px"
                        }}
                      >

                        <div
                          style={{
                            fontWeight:
                              "600",
                            marginBottom:
                              "6px"
                          }}
                        >

                          {column.label}

                        </div>

                        {

                          isImage(text)

                          ?

                          <a
                            href={`http://localhost:5000${text}`}
                            target="_blank"
                            rel="noreferrer"
                          >

                            <img
                              src={`http://localhost:5000${text}`}
                              alt=""
                              style={{
                                width:
                                  "150px",
                                borderRadius:
                                  "8px"
                              }}
                            />

                          </a>

                          :

                          isFile(text)

                          ?

                          <a
                            href={`http://localhost:5000${text}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color:
                                "#2563eb",
                              fontWeight:
                                "600"
                            }}
                          >

                            📄 View File

                          </a>

                          :

                          <div
                            style={{
                              color:
                                value
                                  ? "#111827"
                                  : "#dc2626"
                            }}
                          >

                            {text}

                          </div>

                        }

                      </div>

                    );

                  }

                )

              }

            </div>

          )

        )

      }

    </div>

  );

}

      // Single Record -> Part 5
      if (question.type === "singleRecord") {

  const record =
getAnswer(
  submission.answers,
  question.sectionNo
) ||
Object.fromEntries(
  question.fields.map(field => [
    field.key,
    ""
  ])
);

  return (

    <div
      key={index}
      style={{
        borderBottom: "1px solid #e5e7eb",
        padding: "22px"
      }}
    >

      <h3
        style={{
          color: "#2563eb",
          marginBottom: "20px"
        }}
      >
        {question.sectionNo}. {question.sectionTitle}
      </h3>

      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "10px",
          padding: "20px",
          background: "#f8fafc"
        }}
      >

        {
          question.fields.map(
            (column, i) => {

              const value =
                record?.[
                  column.key
                ];

              const text =
value === undefined ||
value === null ||
value === ""
? "NIL"
: value;

              return (

                <div
                  key={i}
                  style={{
                    marginBottom: "18px"
                  }}
                >

                  <div
                    style={{
                      fontWeight: "600",
                      marginBottom: "6px"
                    }}
                  >

                    {column.label}

                  </div>

                  {

                    isImage(text)

                    ?

                    <a
                      href={`http://localhost:5000${text}`}
                      target="_blank"
                      rel="noreferrer"
                    >

                      <img
                        src={`http://localhost:5000${text}`}
                        alt=""
                        style={{
                          width: "150px",
                          borderRadius: "8px"
                        }}
                      />

                    </a>

                    :

                    isFile(text)

                    ?

                    <a
                      href={`http://localhost:5000${text}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#2563eb",
                        fontWeight: "600"
                      }}
                    >

                      📄 View File

                    </a>

                    :

                    <div
                      style={{
                        color:
                          value
                            ? "#111827"
                            : "#dc2626"
                      }}
                    >

                      {text}

                    </div>

                  }

                </div>

              );

            }

          )
        }

      </div>

    </div>

  );

}
      const answer =
  getAnswer(
    submission.answers,
    question.sectionNo
  );

const value =
  answer === undefined ||
  answer === null
    ? ""
    : answer;

      return (

        <div
          key={index}
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #e5e7eb"
          }}
        >

          <div
            style={{
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "12px"
            }}
          >

            {question.sectionNo}. {question.sectionTitle}

          </div>

          {

            isImage(value)

            ?

            <a
              href={`http://localhost:5000${value}`}
              target="_blank"
              rel="noreferrer"
            >

              <img
                src={`http://localhost:5000${value}`}
                alt=""
                style={{
                  width: "140px",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}
              />

            </a>

            :

            isFile(value)

            ?

            <a
              href={`http://localhost:5000${value}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#2563eb",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >

              📄 View File

            </a>

            :

            <div
              style={{
                color: value
                  ? "#111827"
                  : "#dc2626",
                fontWeight: "500"
              }}
            >

              {
  value === ""
    ? "NIL"
    : value
}
            </div>

          }

        </div>

      );

    })

  }

</div>

    </div>

  ))
}

      </div>

    </DeanLayout>

  );

}

function InfoRow({

  title,

  value

}) {

  return (

    <tr>

      <td style={infoTitle}>
        {title}
      </td>

      <td style={infoValue}>
        {value}
      </td>

    </tr>

  );

}

function SummaryCard({

  title,

  value,

  color

}) {

  return (

    <div
      style={{
        borderLeft: `6px solid ${color}`,
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,.08)",
        textAlign: "center"
      }}
    >

      <h3>{title}</h3>

      <h1>{value}</h1>

    </div>

  );

}

const infoTitle = {

  padding: "12px",

  width: "220px",

  fontWeight: "700"

};

const infoValue = {

  padding: "12px"

};
export default DeanHodView;