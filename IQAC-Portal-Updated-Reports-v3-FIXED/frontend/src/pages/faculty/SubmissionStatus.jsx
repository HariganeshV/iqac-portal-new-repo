import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import facultyQuestions from "../../data/facultyQuestions";
import FacultySubmissionViewer from "../../components/common/FacultySubmissionViewer";

import FacultyLayout from "../../layouts/FacultyLayout";

import {
  getMySubmissions,
  downloadPDF,
  clearSubmission
} from "../../api/submissionApi";


function SubmissionStatus() {

  const navigate = useNavigate();

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedSubmission, setSelectedSubmission] =
  useState(null);

  useEffect(() => {

    fetchSubmissions();

  }, []);

  const fetchSubmissions =
    async () => {

      try {

        const response =
          await getMySubmissions();

        setSubmissions(
          response.data.submissions || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const quarters = [
    "Q1",
    "Q2",
    "Q3",
    "Q4"
  ];

  const getQuarterData =
    (quarter) => {

      const submission =
        submissions.find(
          (item) =>
            item.quarter === quarter
        );

      if (!submission) {

        return {

          status:
            "Not Started",

          date:
            "-",

          totalQuestions:
            0,

          answeredCount:
            0,

          unansweredCount:
            0,

          hodRemarks:
            "-",
          
          deanRemarks: "-",

          submissionId:
            null

        };

      }

      return {

  status: submission.status,

  date:
    new Date(submission.createdAt).toLocaleDateString(),

  totalQuestions:
    submission.totalQuestions || 0,

  answeredCount:
    submission.answeredCount || 0,

  unansweredCount:
    submission.unansweredCount || 0,

  hodRemarks:
    submission.hodRemarks || "-",

  deanRemarks:
    submission.deanRemarks || "-",

  submissionId:
    submission._id,

  submission

};

    };

  const handleDownload =
async (
  submissionId,
  quarter,
  facultyName
) => {

    try {

      const response =
        await downloadPDF(
          submissionId
        );

      const blob =
        new Blob(
          [response.data],
          {
            type:
              "application/pdf"
          }
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      facultyName =
  facultyName || "Faculty";

link.download =
  `${facultyName}-${quarter}.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

    } catch (error) {

      console.error(error);

      alert(
        "PDF Download Failed"
      );

    }

  };

  const handleEdit =
    (submissionId) => {

      navigate(
        `/faculty/questionnaire/${submissionId}`
      );

    };

    const handleClear = async (id) => {

  const ok = window.confirm(

    "Are you sure you want to clear this submission?"

  );

  if (!ok) return;

  try {

    await clearSubmission(id);

    fetchSubmissions();

  }

  catch (err) {

    console.log(err);

    alert("Failed to clear submission");

  }

};

  return (

    <FacultyLayout>

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >

        <h1>
          My Submissions
        </h1>

        <p>
          View Quarterly Submission Status
        </p>

        {

          loading ?

          <p>
            Loading...
          </p>

          :

          <table
            style={{
              width: "100%",
              marginTop: "25px",
              borderCollapse:
                "collapse"
            }}
          >

            <thead>

              <tr
                style={{
                  background:
                    "#2563eb",
                  color:
                    "white"
                }}
              >

                <th style={thStyle}>
                  Quarter
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Rejection Reason
                </th>

                <th style={thStyle}>
                  Total Questions
                </th>

                <th style={thStyle}>
                  Answered
                </th>

                <th style={thStyle}>
                  Unanswered
                </th>

                <th style={thStyle}>
                  Submitted Date
                </th>

                <th style={thStyle}>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {

                quarters.map(
                  (
                    quarter
                  ) => {

                    const info =
                      getQuarterData(
                        quarter
                      );

                    return (

                      <tr
                        key={
                          quarter
                        }
                      >

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            quarter
                          }
                        </td>

                        <td
                          style={{
                            ...tdStyle,

                            color:

                              info.status ===
                              "Pending HOD Approval"

                                ? "#f59e0b"

                              : info.status==="Pending Dean Review"

                                  ? "#2563eb"

                              : info.status ===
                                "Rejected by HOD"

                                ? "#ef4444"

                              : info.status ===
                                "Pending Dean Review"

                                ? "#2563eb"

                              : info.status ===
                                "Approved by Dean"

                                ? "#16a34a"

                              : "#ef4444",

                            fontWeight:
                              "600"
                          }}
                        >
                          {
                            info.status
                          }
                        </td>

                        <td style={tdStyle}>
{
  info.status === "Rejected by HOD"
    ? info.hodRemarks || "-"
    : info.status === "Rejected by Dean"
    ? info.deanRemarks || "-"
    : "-"
}
</td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.totalQuestions
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.answeredCount
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.unansweredCount
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            info.date
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >

                      {
  info.submissionId && (

    <div
      style={{
        display: "flex",
        gap: "8px"
      }}
    >
      
      <button
    onClick={() =>
      setSelectedSubmission(
        info.submission
      )
    }
    style={{
      background:"#7c3aed",
      color:"#fff",
      border:"none",
      padding:"8px 15px",
      borderRadius:"6px",
      cursor:"pointer"
    }}
  >
    View
  </button>

      {
  (
    info.status === "Draft" ||
    info.status === "Rejected by HOD" ||
    info.status === "Rejected by Dean"
  ) && (

    <button
      onClick={() =>
        handleEdit(info.submissionId)
      }
      style={{
        background:"#2563eb",
        color:"#fff",
        border:"none",
        padding:"8px 15px",
        borderRadius:"6px",
        cursor:"pointer"
      }}
    >
      Edit
    </button>

  )
}

      <button
        onClick={() =>
  handleDownload(
  info.submissionId,
  quarter,
  info.submission?.submittedByName ||
  info.submission?.facultyName
)
}
        style={{
          background:"#16a34a",
          color:"#fff",
          border:"none",
          padding:"8px 15px",
          borderRadius:"6px",
          cursor:"pointer"
        }}
      >
        PDF
      </button>

      <button
  onClick={() =>
    handleClear(
      info.submissionId
    )
  }
  style={{
    background:"#dc2626",
    color:"#fff",
    border:"none",
    padding:"8px 15px",
    borderRadius:"6px",
    cursor:"pointer"
  }}
>
  Clear All
</button>

    </div>

  )
}

                        </td>

                      </tr>

                    );

                  }
                )

              }

            </tbody>

          </table>

        }

      </div>
     
     {
selectedSubmission && (

<FacultySubmissionViewer
    submission={selectedSubmission}
    onClose={() => setSelectedSubmission(null)}
/>

)
}
    </FacultyLayout>

  );

}

const thStyle = {

  padding: "12px",

  textAlign: "left"

};

const tdStyle = {

  padding: "12px",

  borderBottom:
    "1px solid #e5e7eb"

};

export default SubmissionStatus;