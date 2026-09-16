import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DeanLayout from "../../layouts/DeanLayout";

import {
  getFacultySubmissionById,
  reviewQuestion
} from "../../api/deanApi";

import facultyQuestions from "../../data/facultyQuestions";

function DeanFacultyView() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadSubmission();

  }, []);

  const loadSubmission =
    async () => {

      try {

        const res =
          await getFacultySubmissionById(id);

        setSubmission(
          res.data.submission
        );

      }

      catch (error) {

        console.error(error);

      }

      finally {

        setLoading(false);

      }

    };

  // ============================
  // LOADING
  // ============================

  if (loading) {

    return (

      <DeanLayout>

        <div
          style={{
            padding: "50px",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "600"
          }}
        >

          Loading Faculty Submission...

        </div>

      </DeanLayout>

    );

  }

  // ============================
  // NOT FOUND
  // ============================

  if (!submission) {

    return (

      <DeanLayout>

        <div
          style={{
            padding: "50px",
            textAlign: "center",
            color: "red",
            fontSize: "22px"
          }}
        >

          Submission Not Found

        </div>

      </DeanLayout>

    );

  }

  // ============================
  // ANSWER SEARCH
  // ============================

  const getAnswer = (sectionNo, questionIndex) => {

    const key =
      `${sectionNo}_${questionIndex}`;

    return submission.answers.find(

      (item) =>
        item.questionNo === key

    );

  };

  const handleQuestionReview = async (questionNo, rejected) => {
    const remarks = rejected
      ? window.prompt("Enter rejection reason for this question")
      : "";
    if (rejected && remarks === null) return;
    try {
      await reviewQuestion(id, questionNo, rejected, remarks || "");
      await loadSubmission();
    } catch (error) {
      console.error(error);
      alert("Question review failed");
    }
  };

  // ============================
  // FILE TYPE
  // ============================

  const renderAnswer = (value) => {

    if (!value) {

      return (

        <span
          style={{
            color: "#dc2626",
            fontWeight: "600"
          }}
        >
          NIL
        </span>

      );

    }

    if (
      value.endsWith(".jpg") ||
      value.endsWith(".jpeg") ||
      value.endsWith(".png")
    ) {

      return (

        <a
          href={`http://localhost:5000${value}`}
          target="_blank"
          rel="noreferrer"
        >

          <img
            src={`http://localhost:5000${value}`}
            alt=""
            style={{
              width: "110px",
              borderRadius: "8px",
              border: "1px solid #ddd"
            }}
          />

        </a>

      );

    }

    if (

      value.endsWith(".pdf") ||

      value.endsWith(".doc") ||

      value.endsWith(".docx")

    ) {

      return (

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

      );

    }

    return value;

  };

  // ============================
  // TOTAL QUESTIONS
  // ============================

  const totalQuestions =
    facultyQuestions.reduce(

      (total, section) =>

        total + section.questions.length,

      0

    );

  return (

    <DeanLayout>
      <button
  onClick={() => navigate(-1)}
  style={{
    position: "fixed",
    top: "80px",
    right: "30px",
    zIndex: 9999,

    background: "#2563eb",
    color: "#fff",

    border: "none",

    padding: "12px 20px",

    borderRadius: "50px",

    fontWeight: "600",

    fontSize: "16px",

    cursor: "pointer",

    boxShadow: "0 8px 20px rgba(37,99,235,.35)"
  }}
>
  ← Back
</button>

      <div
        style={{
          maxWidth: "1350px",
          margin: "0 auto",
          padding: "30px"
        }}
      >    

        {/* ============================
            PAGE TITLE
        ============================ */}

        <h1
          style={{
            color: "#1e3a8a",
            marginBottom: "25px"
          }}
        >
          Faculty Submission
        </h1>

        {/* ============================
            INFORMATION CARD
        ============================ */}

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            marginBottom: "35px"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <tbody>

              <InfoRow
                title="Faculty Name"
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

              <InfoRow
                title="Total Questions"
                value={submission.totalQuestions || totalQuestions}
              />

              <InfoRow
                title="Answered Count"
                value={submission.answeredCount}
              />

              <InfoRow
                title="Unanswered Count"
                value={submission.unansweredCount}
              />

              <tr>

                <td
                  style={{
                    padding: "12px",
                    fontWeight: "700",
                    width: "240px"
                  }}
                >
                  Status
                </td>

                <td
                  style={{
                    padding: "12px"
                  }}
                >

                  <span
                    style={{
                      background:
                        submission.status === "Approved by HOD"
                          ? "#16a34a"
                          : "#dc2626",
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

        {/* ============================
            FACULTY QUESTIONS
        ============================ */}

        <h2
          style={{
            color: "#2563eb",
            marginBottom: "20px"
          }}
        >
          Faculty Questionnaire
        </h2>
                {facultyQuestions.map((section) => (

          <div
            key={section.sectionNo}
            style={{
              background: "#fff",
              borderRadius: "12px",
              marginBottom: "35px",
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              overflow: "hidden"
            }}
          >

            {/* SECTION HEADER */}

            <div
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "16px 22px",
                fontSize: "20px",
                fontWeight: "700"
              }}
            >
              Section {section.sectionNo} : {section.sectionTitle}
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >

              <thead>

                <tr
                  style={{
                    background: "#dbeafe"
                  }}
                >

                  <th style={thStyle}>
                    Question No
                  </th>

                  <th style={thStyle}>
                    Question
                  </th>

                  <th style={thStyle}>
                    Answer
                  </th>

                  <th style={thStyle}>Review</th>

                </tr>

              </thead>

              <tbody>

                {section.questions.map((question, index) => {

                  const answerObj =
                    getAnswer(
                      section.sectionNo,
                      index
                    );

                  const value =
                    answerObj
                      ? answerObj.answer
                      : "";

                  return (

                    <tr
                      key={index}
                      style={{ background: submission.changedQuestionNos?.includes(`${section.sectionNo}_${index}`) ? "#fef3c7" : "transparent" }}
                    >

                      <td style={tdStyle}>
                        {section.sectionNo}.{index + 1}
                      </td>

                      <td style={tdStyle}>

                        <div
                          style={{
                            fontWeight: "600",
                            marginBottom: "4px"
                          }}
                        >
                          {question.question}
                        </div>

                        <div
                          style={{
                            color: "#6b7280",
                            fontSize: "13px"
                          }}
                        >
                          {question.answerFormat}
                        </div>

                      </td>

                      <td style={tdStyle}>

                        {renderAnswer(value)}

                      </td>

                      <td style={tdStyle}>
                        {submission.changedQuestionNos?.includes(`${section.sectionNo}_${index}`) && (
                          <div style={{ color: "#92400e", fontSize: "12px", marginBottom: "6px" }}>Edited after rejection</div>
                        )}
                        <button type="button" onClick={() => handleQuestionReview(`${section.sectionNo}_${index}`, false)} style={{ background: "#16a34a", color: "#fff", border: 0, padding: "6px 8px", borderRadius: "4px", marginRight: "5px" }}>
                          Approve
                        </button>
                        <button type="button" onClick={() => handleQuestionReview(`${section.sectionNo}_${index}`, true)} style={{ background: "#dc2626", color: "#fff", border: 0, padding: "6px 8px", borderRadius: "4px" }}>
                          Reject
                        </button>
                        {submission.review?.find((item) => item.questionNo === `${section.sectionNo}_${index}` && item.reviewerRole === "dean") && (
                          <div style={{ marginTop: "6px", color: "#374151", fontSize: "12px" }}>
                            {submission.review.find((item) => item.questionNo === `${section.sectionNo}_${index}` && item.reviewerRole === "dean").rejected ? "Rejected" : "Approved"}
                          </div>
                        )}
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        ))}
              </div>

    </DeanLayout>

  );

}

// =======================================
// INFO ROW COMPONENT
// =======================================

function InfoRow({

  title,

  value

}) {

  return (

    <tr>

      <td
        style={{
          padding: "12px",
          width: "240px",
          fontWeight: "700",
          color: "#374151",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        {title}
      </td>

      <td
        style={{
          padding: "12px",
          borderBottom: "1px solid #e5e7eb",
          color: "#111827"
        }}
      >
        {value || "-"}
      </td>

    </tr>

  );

}

// =======================================
// TABLE STYLES
// =======================================

const thStyle = {

  padding: "14px",

  textAlign: "left",

  borderBottom: "2px solid #cbd5e1",

  color: "#1e3a8a",

  fontWeight: "700",

  fontSize: "15px"

};

const tdStyle = {

  padding: "14px",

  borderBottom: "1px solid #e5e7eb",

  verticalAlign: "top",

  fontSize: "14px"

};

export default DeanFacultyView;