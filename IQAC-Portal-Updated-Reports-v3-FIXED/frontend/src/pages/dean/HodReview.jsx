import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import DeanLayout from "../../layouts/DeanLayout";

import {
  getHodSubmissions,
  downloadHodPDF,
  approveSubmission,
  rejectSubmission
} from "../../api/deanApi";

import schoolsDepartments
from "../../data/schoolsDepartments";

import { useAuth }
from "../../context/AuthContext";

function HodReview() {

  const navigate = useNavigate();

  const [searchParams] =
  useSearchParams();

const tab =
  searchParams.get("tab");

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [submissions, setSubmissions] =
    useState([]);

  const [selectedDepartment, setSelectedDepartment] =
    useState(
      sessionStorage.getItem(
        "deanHodDepartment"
      ) || ""
    );
const [activeTab, setActiveTab] =
useState(() => {

  if(tab==="approved")
    return "Approved by Dean";

  if(tab==="rejected")
    return "Rejected by Dean";

  return "Pending Dean Review";

});

useEffect(() => {

  if (tab === "pending") {

    setActiveTab("Pending Dean Review");

  }

  else if (tab === "approved") {

    setActiveTab("Approved by Dean");

  }

  else if (tab === "rejected") {

    setActiveTab("Rejected by Dean");

  }

}, [tab]);

  useEffect(()=>{

  sessionStorage.setItem(
    "deanHodActiveTab",
    activeTab
  );

},[activeTab]);

  const [remarks, setRemarks] =
  useState("");

const [selectedSubmission, setSelectedSubmission] =
  useState(null);

  useEffect(() => {

    loadSubmissions();

  }, []);

  const loadSubmissions = async () => {

  try {

    const res =
      await getHodSubmissions(
        activeTab,
        selectedDepartment
      );

    setSubmissions(
      res.data.submissions || []
    );

  }

  catch (err) {

    console.error(err);

  }

  finally {

    setLoading(false);

  }

};
    // ==========================
  // DEPARTMENTS OF DEAN SCHOOL
  // ==========================

  const departments =
    schoolsDepartments[
      user?.school
    ] || [];

  // ==========================
  // SAVE FILTERS
  // ==========================

  useEffect(() => {

  loadSubmissions();

}, [

  activeTab,

  selectedDepartment

]);


  // ==========================
  // FILTER SUBMISSIONS
  // ==========================

  const filteredSubmissions = submissions;


  // ==========================
  // PDF DOWNLOAD
  // ==========================

  const handleDownload =
    async (submission) => {

      try {

        const response =
          await downloadHodPDF(
            submission._id
          );

        const url =
          window.URL.createObjectURL(
            new Blob([response.data])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          `${submission.submittedByName}_${submission.quarter}.pdf`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

      }

      catch (error) {

        console.error(error);

      }

    };
    const handleApprove = async (id) => {

  try {

    await approveSubmission(
      id,
      "Approved by Dean"
    );

    await loadSubmissions();

  }

  catch (err) {

    console.error(err);

    alert("Approval Failed");

  }

};
const handleReject = async () => {

  if (!selectedSubmission) return;

  if (!remarks.trim()) {

    alert("Please enter remarks");

    return;

  }

  try {

    await rejectSubmission(

      selectedSubmission,

      remarks

    );

    setRemarks("");

    setSelectedSubmission(null);

    await loadSubmissions();

  }

  catch (err) {

    console.error(err);

    alert("Reject Failed");

  }

};
      return (

<>

<DeanLayout>

      <div
        style={{
          padding: "30px"
        }}
      >

        <h1
          style={{
            marginBottom: "10px"
          }}
        >
          HOD Reviews
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px"
          }}
        >
          Department-wise HOD Submissions Pending Dean Review
        </p>

        {/* ==========================
            DEPARTMENT
        ========================== */}

        <div
          style={{
            marginBottom: "20px"
          }}
        >

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600"
            }}
          >
            Select Department
          </label>

          <select

            value={selectedDepartment}

            onChange={(e) => {

  const dept = e.target.value;

  setSelectedDepartment(dept);

  sessionStorage.setItem(
    "deanHodDepartment",
    dept
  );

}}

            style={{
              width: "420px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db"
            }}

          >

            <option value="">
              -- Select Department --
            </option>

            {

              departments.map((dept) => (

                <option
                  key={dept}
                  value={dept}
                >
                  {dept}
                </option>

              ))

            }

          </select>

        </div>
        {/* ==========================
    REVIEW TABS
========================== */}

<div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "30px",
    marginBottom: "30px"
  }}
>

  <button
    onClick={() =>
      setActiveTab("Pending Dean Review")
    }
    style={{
      padding: "12px 22px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      background:
        activeTab ===
        "Pending Dean Review"
          ? "#2563eb"
          : "#e5e7eb",
      color:
        activeTab ===
        "Pending Dean Review"
          ? "#fff"
          : "#111827"
    }}
  >
    Pending Reviews
  </button>

  <button
    onClick={() =>
      setActiveTab("Approved by Dean")
    }
    style={{
      padding: "12px 22px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      background:
        activeTab ===
        "Approved by Dean"
          ? "#16a34a"
          : "#e5e7eb",
      color:
        activeTab ===
        "Approved by Dean"
          ? "#fff"
          : "#111827"
    }}
  >
    Approved Reviews
  </button>

  <button
    onClick={() =>
      setActiveTab("Rejected by Dean")
    }
    style={{
      padding: "12px 22px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      background:
        activeTab ===
        "Rejected by Dean"
          ? "#dc2626"
          : "#e5e7eb",
      color:
        activeTab ===
        "Rejected by Dean"
          ? "#fff"
          : "#111827"
    }}
  >
    Rejected Reviews
  </button>

</div>

        

        {

          loading

          ?

          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center"
            }}
          >
            Loading...
          </div>

          :

          selectedDepartment === ""

          ?

          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#6b7280"
            }}
          >
            Please select Department.
          </div>

          :

          filteredSubmissions.length === 0

          ?

          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#dc2626",
              fontWeight: "600"
            }}
          >
            No HOD submissions found.
          </div>

          :

          (
            <div
  style={{
    overflowX: "auto",
    borderRadius: "12px"
  }}
>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow:
        "0 2px 8px rgba(0,0,0,.08)"
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
          HOD Name
        </th>

        <th style={thStyle}>
          Department
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
          Actions
        </th>

      </tr>

    </thead>

    <tbody>

      {

        filteredSubmissions.map(

          (submission) => (

            <tr
              key={submission._id}
            >

              <td style={tdStyle}>
                {submission.submittedByName}
              </td>

              <td
                style={{
                  ...tdStyle,
                  maxWidth: "320px",
                  wordBreak: "break-word",
                  whiteSpace: "normal"
                }}
              >
                {submission.department}
              </td>

              <td style={tdStyle}>
                {submission.quarter}
              </td>

              <td style={tdStyle}>
                {submission.answeredCount}
                {" / "}
                {submission.totalQuestions}
              </td>

              <td style={tdStyle}>
                {
                  new Date(
                    submission.createdAt
                  ).toLocaleDateString()
                }
              </td>

              <td style={tdStyle}>

                <span
                  style={{
                   background:

submission.status ===
"Approved by Dean"

? "#16a34a"

: submission.status ===
"Rejected by Dean"

? "#dc2626"

: "#f59e0b",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "600",
                    fontSize: "13px"
                  }}
                >
                  {submission.status}
                </span>

              </td>

              <td style={tdStyle}>

  <button
    onClick={() => {

  sessionStorage.setItem(
    "deanHodDepartment",
    selectedDepartment
  );

  sessionStorage.setItem(
    "deanHodActiveTab",
    activeTab
  );

  navigate(
    `/dean/hod-view/${submission._id}`
  );

}}
    style={{
      padding: "8px 14px",
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "8px",
      marginBottom: "6px"
    }}
  >
    👁 View
  </button>

  <button
    onClick={() =>
      handleDownload(submission)
    }
    style={{
      padding: "8px 14px",
      background: "#16a34a",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "8px",
      marginBottom: "6px"
    }}
  >
    📄 PDF
  </button>

              </td>

            </tr>

          )

        )

      }

    </tbody>

  </table>

</div>
          )

        }

      </div>

    </DeanLayout>

{
  selectedSubmission && (

    <RejectPopup

      remarks={remarks}

      setRemarks={setRemarks}

      onCancel={() => {

        setSelectedSubmission(null);

        setRemarks("");

      }}

      onReject={handleReject}

    />

  )
}

</>

);
}

const thStyle = {

  padding: "14px",

  textAlign: "left",

  background: "#2563eb",

  color: "#fff",

  fontWeight: "600"

};

const tdStyle = {

  padding: "14px",

  borderBottom: "1px solid #e5e7eb",

  verticalAlign: "top"

};

function RejectPopup({

  remarks,

  setRemarks,

  onCancel,

  onReject

}) {

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >

      <div
        style={{
          width: "700px",
          background: "#fff",
          borderRadius: "14px",
          padding: "35px"
        }}
      >

        <h2
          style={{
            marginBottom: "25px"
          }}
        >
          Reject Submission
        </h2>

        <textarea
          autoFocus
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
          placeholder="Enter Dean Remarks..."
          spellCheck={false}
          rows={7}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            lineHeight: "1.6",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            marginTop: "25px"
          }}
        >

          <button
            onClick={onCancel}
            style={{
              padding: "10px 22px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            onClick={onReject}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Reject
          </button>

        </div>

      </div>

    </div>

  );

}
export default HodReview;