import React from "react";
import { useEffect, useState } from "react";
import facultyQuestions from "../../data/facultyQuestions";
import { useLocation} from "react-router-dom";

import HodLayout
from "../../layouts/HodLayout";

import {
  getFacultySubmissions,
  approveSubmission,
  rejectSubmission,
  downloadFacultyPDF
} from "../../api/hodApi";

function FacultyReview() {

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const location =
  useLocation();

  const [remarks, setRemarks] =
    useState({});

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const params =
  new URLSearchParams(
    location.search
  );

const [activeTab,
setActiveTab] =
useState(
  params.get("tab") ||
  "pending"
);

useEffect(() => {

  const params =
    new URLSearchParams(
      location.search
    );

  setActiveTab(
    params.get("tab") ||
    "pending"
  );

}, [location.search]);

const pendingReviews =
  submissions.filter(
    (s) =>
      s.status ===
      "Pending HOD Approval"
  );

const approvedReviews = submissions.filter(
  (s) =>
    s.status === "Pending Dean Review" ||
    s.status === "Approved by Dean"
);

const rejectedReviews = submissions.filter(
  (s) =>
    s.status === "Rejected by HOD" ||
    s.status === "Rejected by Dean"
);

let displayData = [];

if (activeTab === "pending") {
  displayData = pendingReviews;
}

if (activeTab === "approved") {
  displayData = approvedReviews;
}

if (activeTab === "rejected") {
  displayData = rejectedReviews;
}

  useEffect(() => {

    fetchSubmissions();

  }, []);

 const handleDownload =
  async (
    submissionId,
    facultyName,
    quarter
  ) => {

    try {

      const response =
        await downloadFacultyPDF(
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

  const fetchSubmissions =
    async () => {

      try {

        const response =
          await getFacultySubmissions();

        setSubmissions(
          response.data.submissions || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const handleApprove =
    async (id) => {

      try {

        await approveSubmission(id);

        alert(
          "Submission Approved Successfully"
        );

        fetchSubmissions();

      } catch (error) {

        console.error(error);

        alert(
          "Approval Failed"
        );

      }

    };

  const handleReject =
    async (id) => {

      try {

        const reason =
          remarks[id] || "";

        if (!reason.trim()) {

          alert(
            "Please enter rejection reason"
          );

          return;

        }

        await rejectSubmission(
          id,
          reason
        );

        alert(
          "Submission Rejected Successfully"
        );

        fetchSubmissions();

      } catch (error) {

        console.error(error);

        alert(
          "Reject Failed"
        );

      }

    };

  return (

<HodLayout>

<div
  style={{
    padding: "30px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg,#eef4ff 0%,#f8fafc 100%)"
  }}
>

     <div
  style={{
    background:
      "linear-gradient(135deg,#2563eb,#1e40af)",
    color: "white",
    padding: "30px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow:
      "0 8px 20px rgba(37,99,235,0.2)"
  }}
>
  <h1
    style={{
      margin: 0
    }}
  >
    Faculty Reviews
  </h1>

  <p
    style={{
      marginTop: "10px",
      marginBottom: 0
    }}
  >
    Review Faculty Quarterly Reports
  </p>
</div>
      
      <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "20px"
  }}
>
  <button
    onClick={() =>
      setActiveTab("pending")
    }
    style={{
      padding: "10px 15px",
      background:
        activeTab === "pending"
          ? "#2563eb"
          : "#e5e7eb",
      color:
        activeTab === "pending"
          ? "white"
          : "black",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Pending Reviews
  </button>

  <button
    onClick={() =>
      setActiveTab("approved")
    }
    style={{
      padding: "10px 15px",
      background:
        activeTab === "approved"
          ? "#16a34a"
          : "#e5e7eb",
      color:
        activeTab === "approved"
          ? "white"
          : "black",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Approved Reviews
  </button>

  <button
    onClick={() =>
      setActiveTab("rejected")
    }
    style={{
      padding: "10px 15px",
      background:
        activeTab === "rejected"
          ? "#dc2626"
          : "#e5e7eb",
      color:
        activeTab === "rejected"
          ? "white"
          : "black",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Rejected Reviews
  </button>
</div>

      {

        loading ?

        <p>
          Loading...
        </p>

        :
       <div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)"
  }}
>
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse:
              "collapse"
          }}
        >

          <thead>

            <tr>

              <th style={thStyle}>
                Faculty
              </th>

              <th style={thStyle}>
                Email
              </th>

              <th style={thStyle}>
                Quarter
              </th>

              <th style={thStyle}>
                Answered
              </th>
              
              <th style={thStyle}>
                Submitted Date
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Remarks
              </th>

              <th style={thStyle}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {

              displayData.map(
                (
                  item
                ) => (

                  <tr
                    key={
                      item._id
                    }
                  >

                   <td style={tdStyle}>
  {item.submittedByName}
</td>

<td style={tdStyle}>
  {item.submittedByEmail}
</td>

                    <td style={tdStyle}>
                      {
                        item.quarter
                      }
                    </td>

                    <td style={tdStyle}>
  {
    item.answeredCount
  }
  /
  {
    item.totalQuestions
  }
</td>

<td style={tdStyle}>
  {
    item.createdAt
      ? new Date(
          item.createdAt
        ).toLocaleDateString(
          "en-GB"
        )
      : "-"
  }
</td>

<td style={tdStyle}>
  {
    item.status
  }
</td>

                    <td style={tdStyle}>

                      <textarea
                        rows="2"
                        placeholder="Reason if rejecting..."
                        value={
  remarks[item._id] ??
  item.hodRemarks ??
  ""
}
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [item._id]:
                              e.target.value
                          })
                        }
                        style={{
                          width: "100%"
                        }}
                      />

                    </td>

                    <td style={tdStyle}>

                      <button
                        onClick={() =>
                          setSelectedSubmission(
                            item
                          )
                        }
                        style={viewBtn}
                      >
                        View
                      </button>
                      
                    <button
  onClick={() =>
    handleDownload(
  item._id,
  item.submittedByName,
  item.quarter
)
  }
  style={{
    background:"#7c3aed",
    color:"#fff",
    border:"none",
    padding:"8px 12px",
    borderRadius:"5px",
    marginRight:"5px",
    cursor:"pointer"
  }}
>
  PDF
</button>

                    {
item.status === "Pending HOD Approval" && (
  <button
    onClick={() => handleApprove(item._id)}
    style={approveBtn}
  >
    Approve
  </button>
)
}

{
item.status === "Pending HOD Approval" && (
  <button
    onClick={() => handleReject(item._id)}
    style={rejectBtn}
  >
    Reject
  </button>
)
}

                    </td>

                  </tr>

                )
              )

            }

          </tbody>

        </table>
      </div>

      }

      {

        selectedSubmission && (

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center"
            }}
          >

            <div
  style={{
    background: "white",
    padding: "25px",
    width: "80%",
    maxHeight:
      "80vh",
    overflowY:
      "auto",
    borderRadius:
      "12px",
    position:
      "relative"
  }}
 >

<div
  style={{
    position: "sticky",
    top: 0,
    background: "white",
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
    borderBottom:
      "1px solid #e5e7eb",
    marginBottom: "20px"
  }}
>
  <h2
    style={{
      margin: 0
    }}
  >
    Faculty Answers
  </h2>

  <button
    onClick={() =>
      setSelectedSubmission(null)
    }
    style={{
      background:"#dc2626",
      color:"#fff",
      border:"none",
      padding:"8px 15px",
      borderRadius:"30px",
fontWeight:"600",
boxShadow:
"0 3px 8px rgba(0,0,0,0.08)",
      cursor:"pointer"
    }}
  >
    ✕ Close
  </button>
</div>

<div
  style={{
    marginBottom: "20px",
    background: "#f3f4f6",
    padding: "15px",
    borderRadius: "8px"
  }}
>
<p>
<strong>Name:</strong>
{selectedSubmission.submittedByName}
</p>

<p>
<strong>Email:</strong>
{selectedSubmission.submittedByEmail}
</p>

<p><strong>School:</strong> {selectedSubmission.school}</p>

<p><strong>Department:</strong> {selectedSubmission.department}</p>

<p><strong>Quarter:</strong> {selectedSubmission.quarter}</p>

<p><strong>Status:</strong> {selectedSubmission.status}</p>

<p><strong>Answered:</strong> {selectedSubmission.answeredCount}</p>

<p><strong>Unanswered:</strong> {selectedSubmission.unansweredCount}</p>

<p><strong>Remarks:</strong> {selectedSubmission.hodRemarks || "-"}</p>

<p><strong>Submitted Date:</strong>{" "} {new Date(selectedSubmission.createdAt).toLocaleDateString("en-GB") }</p>

</div>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse"
  }}
>
   <tbody>

{
facultyQuestions.map(
(section)=>{

return (

<React.Fragment
  key={section.sectionNo}
>

<tr>

<td
colSpan="2"
style={{
background:"#dbeafe",
fontWeight:"bold",
padding:"12px"
}}
>

Section {section.sectionNo}
 -
 {section.sectionTitle}

</td>

</tr>

{

section.questions.map(
(question,index)=>{

const key =
`${section.sectionNo}_${index}`;

const answerObj =
selectedSubmission.answers?.find(
(a)=>
a.questionNo === key
);

return (

<tr key={key}>

<td style={tdStyle}>
{question.question}
</td>

<td style={tdStyle}>

{
answerObj?.answer ?

(
typeof answerObj.answer === "string"

?

(

answerObj.answer.match(/\.(jpg|jpeg|png)$/i)

?

<img
  src={`http://localhost:5000${answerObj.answer}`}
  alt="Faculty Upload"
  style={{
    maxWidth:"250px",
    borderRadius:"8px"
  }}
/>

:

answerObj.answer.match(/\.(pdf|doc|docx|xls|xlsx)$/i)

?

<div>

  <p
    style={{
      color:"#16a34a",
      fontWeight:"600",
      marginBottom:"8px"
    }}
  >
    Current File :
    {" "}
    {
      answerObj.answer
        .split("/")
        .pop()
    }
  </p>

  <a
    href={`http://localhost:5000${answerObj.answer}`}
    target="_blank"
    rel="noreferrer"
    style={{
      display:"inline-block",
      padding:"8px 15px",
      background:"#2563eb",
      color:"#fff",
      textDecoration:"none",
      borderRadius:"6px",
      fontWeight:"600"
    }}
  >
    👁 View PDF
  </a>

</div>

:

String(answerObj.answer)

)

:

String(answerObj.answer)

)

:

"NIL"

}

</td>

</tr>

);

}
)

}

</React.Fragment>

);

}
)

}

</tbody>

</table>
      

            </div>

          </div>

        )

      }

   </div>

</HodLayout>

);

}

const thStyle = {

  padding: "12px",

  background:
    "#2563eb",

  color:
    "white",

  textAlign:
    "left"

};

const tdStyle = {

  padding: "12px",

  borderBottom:
    "1px solid #e5e7eb",

  verticalAlign:
    "top"

};

const viewBtn = {

  background:
    "#2563eb",

  color:
    "white",

  border:
    "none",

  padding:
    "8px 12px",

  marginRight:
    "5px",

  cursor:
    "pointer",

  borderRadius:
    "5px"

};

const approveBtn = {

  background:
    "#16a34a",

  color:
    "white",

  border:
    "none",

  padding:
    "8px 12px",

  marginRight:
    "5px",

  cursor:
    "pointer",

  borderRadius:
    "5px"

};

const rejectBtn = {

  background:
    "#dc2626",

  color:
    "white",

  border:
    "none",

  padding:
    "8px 12px",

  cursor:
    "pointer",

  borderRadius:
    "5px"

};

export default FacultyReview;