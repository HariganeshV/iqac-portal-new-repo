import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HodLayout from "../../layouts/HodLayout";
import { useAuth } from "../../context/AuthContext";


import {

  getFacultyReviewStats,
  getMyHodSubmissions,

  downloadHodExcel,
  getHodDepartmentInfo

} from "../../api/hodApi";

function HodDashboard() {

  const navigate = useNavigate();

  const [facultyReviews,
  setFacultyReviews] =
  useState([]);

const [hodSubmissions,
  setHodSubmissions] =
  useState([]);

  const { user } = useAuth();

  const [submissions, setSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
  const [departmentInfo, setDepartmentInfo] =
  useState({

    school: "",

    department: ""

  });

  useEffect(() => {

    fetchData();

  }, []);
  
const handleDownloadExcel =
async () => {

  try {

    const response =
      await downloadHodExcel();

    const url =
      window.URL.createObjectURL(

        new Blob([response.data])

      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "IQAC_HOD_Report.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

  }

  catch(error){

    console.log(error);

  }

};
const fetchData =
  async () => {

    try {

      const facultyResponse =
  await getFacultyReviewStats();

      const hodResponse =
        await getMyHodSubmissions();

      setFacultyReviews(
        facultyResponse.data
          .submissions || []
      );

      setHodSubmissions(
        hodResponse.data
          .submissions || []
      );
      const infoResponse =
  await getHodDepartmentInfo();

setDepartmentInfo(
  infoResponse.data
);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const pendingReviews =
    facultyReviews.filter(
      (s) =>
        s.status ===
        "Pending HOD Approval"
    );

  const approvedReviews =
facultyReviews.filter(
  (s) =>

    s.status ===
    "Pending Dean Review"

    ||

    s.status ===
    "Approved by Dean"

);

 const rejectedReviews =
facultyReviews.filter(
  (s) =>

    s.status ===
    "Rejected by HOD"

    ||

    s.status ===
    "Rejected by Dean"

);
    const approvedCount =
  hodSubmissions.filter(
    (s) =>
      s.status ===
      "Approved by Dean"
  ).length;

const rejectedCount =
  hodSubmissions.filter(
    (s) =>
      s.status ===
      "Rejected by Dean"
  ).length;

const pendingCount =
  hodSubmissions.filter(
    (s) =>
      s.status ===
      "Pending Dean Review"
  ).length;

const submittedCount =
  hodSubmissions.filter(
    (s) =>
      s.status !== "Draft"
  ).length;

  const draftCount =
  hodSubmissions.filter(
    (s) =>
      s.status ===
      "Draft"
  ).length;

const notStartedCount =
  Math.max(
    0,
    4 -
      (
        submittedCount +
        draftCount
      )
  );

  return (

  <HodLayout>

    <div
      style={{
        background: "#f3f4f6",
        minHeight: "100vh"
      }}
    >

      {/* Welcome Banner */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#1e40af)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          marginBottom: "30px"
        }}
      >

        <h1
  style={{
    margin: 0
  }}
>
  Welcome, {user?.gender === "Male" ? "Mr." : "Ms."} {user?.name}
</h1>

<p
  style={{
    marginTop: "10px",
    fontSize: "16px"
  }}
>
  Department : {user?.department}
</p>

<p
  style={{
    marginTop: "5px",
    fontSize: "16px"
  }}
>
  School : {user?.school}
</p>

<p
  style={{
    marginTop: "5px",
    fontSize: "16px",
    fontWeight: "600"
  }}
>
  Employee ID : {user?.employeeId}
</p>

      </div>

          {/* Quick Actions */}

      <h2
        style={{
          marginTop: "40px",
          marginBottom: "20px"
        }}
      >
        Quick Actions
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px"
        }}
      >

        <div
          className="action-card"
        >

          <h3>
            📋 Faculty Reviews
          </h3>

          <p>
            Review Faculty Reports
          </p>

          <button
            onClick={() =>
              navigate(
                "/hod/faculty-review"
              )
            }
          >
            Open
          </button>

        </div>

        <div
          className="action-card"
        >

          <h3>
            📝 HOD Questionnaire
          </h3>

          <p>
            Fill Quarterly HOD Report
          </p>

          <button
            onClick={() =>
              navigate(
                "/hod/questionnaire"
              )
            }
          >
            Open
          </button>

        </div>

        <div
          className="action-card"
        >

          <h3>
            📂 My HOD Submissions
          </h3>

          <p>
            View Submitted Reports
          </p>

          <button
            onClick={() =>
              navigate(
                "/hod/submissions"
              )
            }
          >
            Open
          </button>

        </div>

        <div
  className="action-card"
>

  <h3>
    📊 Analytics
  </h3>

  <p>
    View Department Analytics
  </p>

  <button
    onClick={() =>
      navigate("/hod/analytics")
    }
  >
    Open
  </button>

</div>

      </div>

      <h2
  style={{
    marginTop: "40px",
    marginBottom: "20px"
  }}
>
  📥 Export Faculty Excel
</h2>

<div
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "40px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: "20px",
    alignItems: "end"
  }}
>

  <div>

    <label
      style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: 600
      }}
    >
      School
    </label>

    <input

      readOnly

      value={departmentInfo.school}

      style={{

        width: "100%",

        padding: "12px",

        borderRadius: "8px",

        border: "1px solid #d1d5db",

        background: "#f3f4f6"

      }}

    />

  </div>

  <div>

    <label
      style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: 600
      }}
    >
      Department
    </label>

    <input

      readOnly

      value={departmentInfo.department}

      style={{

        width: "100%",

        padding: "12px",

        borderRadius: "8px",

        border: "1px solid #d1d5db",

        background: "#f3f4f6"

      }}

    />

  </div>

  <button

    onClick={handleDownloadExcel}

    style={{

      background: "#16a34a",

      color: "white",

      border: "none",

      padding: "14px 28px",

      borderRadius: "10px",

      cursor: "pointer",

      fontWeight: "bold",

      fontSize: "15px"

    }}

  >

    ⬇ Download

  </button>

</div>

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}
      >

        <div
          className="stat-card"
          onClick={() =>
  navigate(
    "/hod/faculty-review?tab=pending"
  )
}
        >

          <h2>
            {
              pendingReviews.length
            }
          </h2>

          <p>
            Pending Faculty Reviews
          </p>

        </div>

        <div
          className="stat-card"
          onClick={() =>
  navigate(
    "/hod/faculty-review?tab=approved"
  )
}
        >

          <h2>
            {
              approvedReviews.length
            }
          </h2>

          <p>
            Approved Faculty Reviews
          </p>

        </div>

        <div
          className="stat-card"
          onClick={() =>
  navigate(
    "/hod/faculty-review?tab=rejected"
  )
}
        >

          <h2>
            {
              rejectedReviews.length
            }
          </h2>

          <p>
            Rejected Faculty Reviews
          </p>

        </div>

      </div>
     <h2
  style={{
    marginBottom:"20px"
  }}
>
  HOD Submission Status
</h2>

<div
  style={{
    display:"grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap:"20px",
    marginBottom:"30px"
  }}
>

  <div className="stat-card">
    <h2>{submittedCount}</h2>
    <p>Submitted Quarters</p>
  </div>

  <div className="stat-card">
    <h2>{approvedCount}</h2>
    <p>Approved</p>
  </div>

  <div className="stat-card">
    <h2>{rejectedCount}</h2>
    <p>Rejected</p>
  </div>

  <div className="stat-card">
    <h2>{pendingCount}</h2>
    <p>Pending Approval</p>
  </div>

  <div className="stat-card">
    <h2>{draftCount}</h2>
    <p>Draft Reports</p>
  </div>

  <div className="stat-card">
    <h2>{notStartedCount}</h2>
    <p>Not Started</p>
  </div>

</div>

<h2
  style={{
    marginBottom:"20px"
  }}
>
  Quarter Status
</h2>

<div
  style={{
    background:"#fff",
    padding:"25px",
    borderRadius:"15px",
    marginBottom:"40px"
  }}
>

  {
  ["Q1","Q2","Q3","Q4"].map(
    (quarter) => {

      const submission =
         hodSubmissions.find(
          (s) =>
            s.quarter === quarter
        );

      return (

        <div
          key={quarter}
          style={{
            display:"flex",
            justifyContent:
              "space-between",
            padding:"15px 0",
            borderBottom:
              "1px solid #e5e7eb"
          }}
        >

          <span>
            {quarter}
          </span>

          <strong
            style={{
              color:
                submission?.status === "Draft"
                  ? "#2563eb"
                  : submission?.status ===
                    "Pending Dean Review"
                  ? "#f59e0b"
                  : submission?.status ===
                    "Rejected by Dean"
                  ? "#ef4444"
                  : submission?.status ===
                    "Approved by Dean"
                  ? "#10b981"
                  : submission?.status ===
                    "Submitted to Admin"
                  ? "#10b981"
                  : "#6b7280"
            }}
          >

            {
              submission
                ? submission.status
                : "Not Started"
            }

          </strong>

        </div>

      );

    }
  )
}

</div>

      <style>

        {`

          .stat-card{

            background:white;
            padding:25px;
            border-radius:15px;
            text-align:center;
            cursor:pointer;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);

          }

          .stat-card:hover{

            transform:translateY(-3px);

          }

          .stat-card h2{

            color:#2563eb;
            margin:0;
            font-size:32px;

          }

          .action-card{

            background:white;
            padding:25px;
            border-radius:15px;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);

          }

          .action-card button{

            margin-top:10px;
            background:#2563eb;
            color:white;
            border:none;
            padding:10px 20px;
            border-radius:8px;
            cursor:pointer;

          }

        `}

      </style>

       </div>

  </HodLayout>

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

export default HodDashboard;