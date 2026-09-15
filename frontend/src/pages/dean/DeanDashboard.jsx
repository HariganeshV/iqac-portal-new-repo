import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DeanLayout from "../../layouts/DeanLayout";
import { useAuth } from "../../context/AuthContext";

import {

  getHodSubmissions,
  getMyDeanSubmissions,

  getDeanDepartments,
  downloadDeanExcel

} from "../../api/deanApi";

function DeanDashboard() {

  const navigate = useNavigate();
  const [departments, setDepartments] =
  useState([]);

const [selectedDepartment, setSelectedDepartment] =
  useState("All");

  const { user } = useAuth();

  const [hodReviews, setHodReviews] =
    useState([]);

  const [deanSubmissions, setDeanSubmissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

  fetchData();

  fetchDepartments();

}, []);

const fetchDepartments = async () => {

  try {

    const response =
      await getDeanDepartments();

    setDepartments(
      response.data.departments || []
    );

  }

  catch (error) {

    console.log(error);

  }

};

const handleDownloadExcel = async () => {

  try {

    const response =
      await downloadDeanExcel(
        selectedDepartment
      );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "IQAC_Dean_Report.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

  }

  catch (error) {

    console.log(error);

  }

};

  const fetchData = async () => {

    try {

      const hodResponse =
        await getHodSubmissions();

      const deanResponse =
        await getMyDeanSubmissions();

      setHodReviews(

        hodResponse.data.submissions || []

      );

      setDeanSubmissions(

        deanResponse.data.submissions || []

      );

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };

  // ==========================
  // HOD REVIEW COUNTS
  // ==========================

  const pendingReviews =
    hodReviews.filter(

      (s) =>

        s.status ===
        "Pending Dean Review"

    );

  const approvedReviews =
    hodReviews.filter(

      (s) =>

        s.status ===
        "Approved by Dean"

    );

  const rejectedReviews =
    hodReviews.filter(

      (s) =>

        s.status ===
        "Rejected by Dean"

    );

  // ==========================
  // DEAN SUBMISSION COUNTS
  // ==========================

  const approvedCount =
    deanSubmissions.filter(

      (s) =>

        s.status ===
        "Approved by Admin"

    ).length;

  const rejectedCount =
    deanSubmissions.filter(

      (s) =>

        s.status ===
        "Rejected by Admin"

    ).length;

  const pendingCount =
    deanSubmissions.filter(

      (s) =>

        s.status ===
        "Pending Admin Review"

    ).length;

  const submittedCount =
    deanSubmissions.filter(

      (s) =>

        s.status !==
        "Draft"

    ).length;

  const draftCount =
    deanSubmissions.filter(

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

    <DeanLayout>

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
  
  <div className="action-card">

  <h3>📋 Faculty Reviews</h3>

  <p>
    View Faculty Reports
  </p>

  <button
    onClick={() =>
      navigate("/dean/faculty-review")
    }
  >
    Open
  </button>

</div>

  <div className="action-card">

    <h3>📋 HOD Reviews</h3>

    <p>
      Review HOD Reports
    </p>

    <button
      onClick={() =>
        navigate("/dean/hod-review")
      }
    >
      Open
    </button>

  </div>

  <div className="action-card">

    <h3>📝 Dean Questionnaire</h3>

    <p>
      Fill Quarterly Dean Report
    </p>

    <button
      onClick={() =>
        navigate("/dean/questionnaire")
      }
    >
      Open
    </button>

  </div>

  <div className="action-card">

    <h3>📂 My Dean Submissions</h3>

    <p>
      View Submitted Reports
    </p>

    <button
      onClick={() =>
        navigate("/dean/submissions")
      }
    >
      Open
    </button>

  </div>

  <div className="action-card">

    <h3>📊 Analytics</h3>

    <p>
      View School Analytics
    </p>

    <button
      onClick={() =>
        navigate("/dean/analytics")
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
  📥 Export Excel Report
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
        fontWeight: 600,
        display: "block",
        marginBottom: "8px"
      }}
    >
      School
    </label>

    <input

      value={user?.school || ""}

      readOnly

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
        fontWeight: 600,
        display: "block",
        marginBottom: "8px"
      }}
    >
      Department
    </label>

    <select

      value={selectedDepartment}

      onChange={(e)=>

        setSelectedDepartment(
          e.target.value
        )

      }

      style={{

        width:"100%",

        padding:"12px",

        borderRadius:"8px"

      }}

    >

      <option value="All">
        All Departments
      </option>

      {

        departments.map(dep=>(

          <option

            key={dep}

            value={dep}

          >

            {dep}

          </option>

        ))

      }

    </select>

  </div>

  <button

    onClick={handleDownloadExcel}

    style={{

      background:"#16a34a",

      color:"white",

      border:"none",

      padding:"14px 28px",

      borderRadius:"10px",

      cursor:"pointer",

      fontWeight:"bold",

      fontSize:"15px"

    }}

  >

    ⬇ Download

  </button>

</div>

{/* Review Summary */}

<h2
  style={{
    marginTop: "40px",
    marginBottom: "20px"
  }}
>
  HOD Review Summary
</h2>

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
        "/dean/hod-review?tab=pending"
      )
    }
  >

    <h2>
      {pendingReviews.length}
    </h2>

    <p>
      Pending HOD Reviews
    </p>

  </div>

  <div
    className="stat-card"
    onClick={() =>
      navigate(
        "/dean/hod-review?tab=approved"
      )
    }
  >

    <h2>
      {approvedReviews.length}
    </h2>

    <p>
      Approved HOD Reviews
    </p>

  </div>

  <div
    className="stat-card"
    onClick={() =>
      navigate(
        "/dean/hod-review?tab=rejected"
      )
    }
  >

    <h2>
      {rejectedReviews.length}
    </h2>

    <p>
      Rejected HOD Reviews
    </p>

  </div>

</div>

{/* Dean Submission Status */}

<h2
  style={{
    marginBottom: "20px"
  }}
>
  Dean Submission Status
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginBottom: "35px"
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

{/* Quarter Status */}

<h2
  style={{
    marginBottom: "20px"
  }}
>
  Quarter Status
</h2>

<div
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "40px"
  }}
>

  {
    ["Q1","Q2","Q3","Q4"].map(

      (quarter) => {

        const submission =
          deanSubmissions.find(

            (s) =>

              s.quarter === quarter

          );

        return (

          <div
            key={quarter}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px 0",
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

                  submission?.status ===
                  "Draft"

                    ? "#2563eb"

                    : submission?.status ===
                      "Pending Admin Review"

                    ? "#f59e0b"

                    : submission?.status ===
                      "Rejected by Admin"

                    ? "#ef4444"

                    : submission?.status ===
                      "Approved by Admin"

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
            transition:.25s;

          }

          .stat-card:hover{

            transform:translateY(-3px);

          }

          .stat-card h2{

            color:#2563eb;
            margin:0;
            font-size:32px;

          }

          .stat-card p{

            margin-top:10px;
            font-weight:600;

          }

          .action-card{

            background:white;
            padding:25px;
            border-radius:15px;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);

          }

          .action-card h3{

            margin-top:0;

          }

          .action-card p{

            color:#6b7280;

          }

          .action-card button{

            margin-top:10px;
            background:#2563eb;
            color:white;
            border:none;
            padding:10px 20px;
            border-radius:8px;
            cursor:pointer;
            font-weight:600;
            transition:.25s;

          }

          .action-card button:hover{

            background:#1d4ed8;

          }

        `}

      </style>

    </div>

  </DeanLayout>

  );

}

export default DeanDashboard;