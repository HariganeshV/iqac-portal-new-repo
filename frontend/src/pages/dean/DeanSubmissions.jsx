import { useEffect, useState } from "react";

import DeanLayout from "../../layouts/DeanLayout";

import SubmissionViewer
from "../../components/common/SubmissionViewer";

import {
  getMyDeanSubmissions,
  downloadDeanPDF,
clearDeanSubmission
} from "../../api/deanApi";

import { useNavigate } from "react-router-dom";

import deanQuestions from "../../data/deanQuestions";

function DeanSubmissions() {

  const navigate = useNavigate();

  const [submissions, setSubmissions] =
    useState([]);

  const [selectedSubmission,
    setSelectedSubmission] =
    useState(null);

  const [showModal,
    setShowModal] =
    useState(false);

  useEffect(() => {

    loadSubmissions();

  }, []);

  // ===========================
  // LOAD SUBMISSIONS
  // ===========================

  const loadSubmissions =
    async () => {

      try {

        const response =
          await getMyDeanSubmissions();

        const saved =
          response.data.submissions || [];

        const quarters = [
          "Q1",
          "Q2",
          "Q3",
          "Q4"
        ];

        const rows =
          quarters.map((quarter) => {

            const existing =
              saved.find(
                item =>
                  item.quarter === quarter
              );

            if (existing)
              return existing;

            return {

              quarter,

              status:
                "Not Started",

              totalQuestions: 0,

              answeredCount: 0,

              unansweredCount: 0,

              createdAt: null,

              answers: []

            };

          });

        setSubmissions(rows);

      }

      catch (error) {

        console.log(error);

      }

    };

  // ===========================
  // VIEW SUBMISSION
  // ===========================

  const handleView =
    (submission) => {

      setSelectedSubmission(
        submission
      );

      setShowModal(true);

    };

  // ===========================
  // DOWNLOAD PDF
  // ===========================

  const handleDownload =
    async (id, quarter) => {

      try {

        const response =
          await downloadDeanPDF(id);

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

        link.download =
          `Dean-${quarter}.pdf`;

        link.click();

      }

      catch (error) {

        console.log(error);

      }

    };

 // ===========================
  // CLEAR ALL
  // ===========================
  const handleClear = async (id) => {

  const confirmClear =

    window.confirm(

      "Are you sure you want to clear this entire quarter?"

    );

  if (!confirmClear)

    return;

  try {

    await clearDeanSubmission(id);

    loadSubmissions();

    alert("Quarter cleared successfully.");

  }

  catch (error) {

    console.log(error);

    alert("Failed to clear submission.");

  }

};

  // ===========================
  // ANSWER FINDER
  // ===========================

  const getSectionAnswer = (sectionNo) => {

  if (!selectedSubmission)
    return null;

  return (
    selectedSubmission.answers?.find(
      answer =>
        String(answer.questionNo) ===
        String(sectionNo)
    )?.answer || null
  );

};
      return (

    <DeanLayout>

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
          My Dean Submissions
        </h1>

        <p>
          View Quarterly Submission Status
        </p>

        <table
          style={{
            width: "100%",
            marginTop: "25px",
            borderCollapse: "collapse"
          }}
        >

          <thead>

            <tr
              style={{
                background: "#2563eb",
                color: "#fff"
              }}
            >

              <th style={thStyle}>
                Quarter
              </th>

              <th style={thStyle}>
                Status
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

              submissions.map(
                (item) => (

                  <tr
                    key={item.quarter}
                  >

                    <td style={tdStyle}>
                      {item.quarter}
                    </td>

                    <td
  style={{
    ...tdStyle,
    color:

      item.status ===
      "Submitted to Admin"

      ? "#16a34a"

      : item.status ===
      "Draft"

      ? "#f59e0b"

      : "#6b7280",

    fontWeight: "600"
  }}
>

  {item.status}

</td>

                    <td style={tdStyle}>
                      {
                        item.totalQuestions
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        item.answeredCount
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        item.unansweredCount
                      }
                    </td>

                    <td style={tdStyle}>

                      {

                        item.createdAt

                        ?

                        new Date(
                          item.createdAt
                        ).toLocaleDateString()

                        :

                        "-"

                      }

                    </td>

                    <td style={tdStyle}>

                      {

                        item.status !==
                        "Not Started"

                        &&

                        <div
                          style={{
                            display: "flex",
                            gap: "8px"
                          }}
                        >

                          <button
                            onClick={() =>
                              handleView(
                                item
                              )
                            }
                            style={{

                              background:
                                "#7c3aed",

                              color:
                                "#fff",

                              border:
                                "none",

                              padding:
                                "8px 15px",

                              borderRadius:
                                "6px",

                              cursor:
                                "pointer"

                            }}
                          >

                            View

                          </button>

                          {
  item.status === "Draft" && (

    <button
      onClick={() =>
        navigate(
          `/dean/questionnaire/${item._id}`
        )
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
                                item._id,
                                item.quarter
                              )
                            }
                            style={{

                              background:
                                "#16a34a",

                              color:
                                "#fff",

                              border:
                                "none",

                              padding:
                                "8px 15px",

                              borderRadius:
                                "6px",

                              cursor:
                                "pointer"

                            }}
                          >

                            PDF

                          </button>

                          <button

  onClick={() =>

    handleClear(item._id)

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

                      }

                    </td>

                  </tr>

                )

              )

            }

          </tbody>

        </table>
              {
showModal && (

<SubmissionViewer

submission={selectedSubmission}

questions={deanQuestions}

onClose={() =>

setShowModal(false)

}

/>

)
}

    </div>

  </DeanLayout>
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

export default DeanSubmissions;
