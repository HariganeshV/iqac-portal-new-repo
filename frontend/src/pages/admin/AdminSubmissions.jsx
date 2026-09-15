import { useEffect, useMemo, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

import FacultySubmissionViewer
from "../../components/common/FacultySubmissionViewer";

import SubmissionViewer
from "../../components/common/SubmissionViewer";

import schoolsDepartments from "../../data/schoolsDepartments";

import facultyQuestions
from "../../data/facultyQuestions";

import hodQuestions
from "../../data/hodQuestions";

import deanQuestions
from "../../data/deanQuestions";

import {

  getAllSubmissions,

  getSubmissionById,

  downloadSubmissionPDF

} from "../../api/adminApi";

function AdminSubmissions() {

  const [loading, setLoading] =
    useState(true);

  const [submissions, setSubmissions] =
    useState([]);

  const [selectedSubmission,
    setSelectedSubmission] =
    useState(null);

  const [showModal,
    setShowModal] =
    useState(false);

  const [search,
    setSearch] =
    useState("");

  const [roleFilter,
    setRoleFilter] =
    useState("All");

  const [quarterFilter,
    setQuarterFilter] =
    useState("All");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [schoolFilter, setSchoolFilter] =
  useState("All");

const [departmentFilter, setDepartmentFilter] =
  useState("All");

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
          await getAllSubmissions();

        setSubmissions(
          response.data.submissions || []
        );
        console.log(response.data.submissions);

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };

  // ===========================
  // VIEW SUBMISSION
  // ===========================

  const handleView =
    async (id) => {

      try {

        const response =
          await getSubmissionById(id);

        setSelectedSubmission(
          response.data.submission
        );

        setShowModal(true);

      }

      catch (error) {

        console.log(error);

      }

    };

  // ===========================
  // DOWNLOAD PDF
  // ===========================

  const handleDownload =
    async (id, quarter) => {

      try {

        const response =
          await downloadSubmissionPDF(id);

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
          document.createElement("a");

        link.href = url;

        link.download =
          `Submission-${quarter}.pdf`;

        link.click();

      }

      catch (error) {

        console.log(error);

      }

    };
      // ===========================
  // FILTERED SUBMISSIONS
  // ===========================

  const filteredSubmissions =
    submissions.filter((submission) => {

      const matchesSearch =

        submission.submittedBy?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        submission.submittedBy?.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesRole =

        roleFilter === "All"

        ||

        submission.role ===
        roleFilter;
      
      const matchesSchool =

  schoolFilter === "All"

  ||

  submission.submittedBy?.school === schoolFilter;
  const matchesDepartment =

  departmentFilter === "All"

  ||

  submission.submittedBy?.department === departmentFilter;
      const matchesQuarter =

        quarterFilter === "All"

        ||

        submission.quarter ===
        quarterFilter;

      const matchesStatus =

        statusFilter === "All"

        ||

        submission.status ===
        statusFilter;

      return (

  matchesSearch &&

  matchesRole &&

  matchesSchool &&

  matchesDepartment &&

  matchesQuarter &&

  matchesStatus

);

    });

  return (

    <AdminLayout>

      <div
        style={{
          background:"#f3f4f6",
          minHeight:"100vh"
        }}
      >

        <div
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#1e3a8a)",
            color:"#fff",
            padding:"30px",
            borderRadius:"15px",
            marginBottom:"30px"
          }}
        >

          <h1
            style={{
              margin:0
            }}
          >
            Submission Management
          </h1>

          <p
            style={{
              marginTop:"10px"
            }}
          >
            Monitor all Faculty, HOD and Dean submissions.
          </p>

        </div>

        {/* Filters */}

        <div
          style={{
            background:"#fff",
            padding:"20px",
            borderRadius:"15px",
            display:"grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap:"15px",
            marginBottom:"30px"
          }}
        >

          <input

            type="text"

            placeholder="Search"

            value={search}

            onChange={(e)=>

              setSearch(
                e.target.value
              )

            }

            style={inputStyle}

          />

          <select

            value={roleFilter}

            onChange={(e)=>

              setRoleFilter(
                e.target.value
              )

            }

            style={inputStyle}

          >

            <option>All</option>
            <option>faculty</option>
            <option>hod</option>
            <option>dean</option>

          </select>
           
           <select
  value={schoolFilter}
  onChange={(e) => {

    setSchoolFilter(e.target.value);

    setDepartmentFilter("All");

  }}
  style={inputStyle}
>

  <option>All</option>

  {

    Object.keys(schoolsDepartments).map((school) => (

      <option
        key={school}
        value={school}
      >
        {school}
      </option>

    ))

  }

</select>

      <select
  value={departmentFilter}
  onChange={(e) =>
    setDepartmentFilter(e.target.value)
  }
  style={inputStyle}
>

  <option>All</option>

  {

    schoolFilter === "All"

      ? []

      : schoolsDepartments[schoolFilter]?.map((department) => (

          <option
            key={department}
            value={department}
          >
            {department}
          </option>

        ))

  }

</select>

          <select

            value={quarterFilter}

            onChange={(e)=>

              setQuarterFilter(
                e.target.value
              )

            }

            style={inputStyle}

          >

            <option>All</option>
            <option>Q1</option>
            <option>Q2</option>
            <option>Q3</option>
            <option>Q4</option>

          </select>

          <select

            value={statusFilter}

            onChange={(e)=>

              setStatusFilter(
                e.target.value
              )

            }

            style={inputStyle}

          >

            <option>All</option>


            <option>
              Approved by Dean
            </option>

            <option>
              Submitted to Admin
            </option>

            <option>
              Pending Admin Review
            </option>

          </select>

        </div>
        {/* ===========================
    SUBMISSIONS TABLE
=========================== */}

<div
  style={{
    background:"#ffffff",
    borderRadius:"15px",
    overflow:"hidden",
    boxShadow:"0 4px 15px rgba(0,0,0,.08)"
  }}
>

  <table
    style={{
      width:"100%",
      borderCollapse:"collapse"
    }}
  >

    <thead
      style={{
        background:"#2563eb",
        color:"#ffffff"
      }}
    >

      <tr>

        <th style={thStyle}>Name</th>

        <th style={thStyle}>Role</th>

        <th style={thStyle}>Quarter</th>

        <th style={thStyle}>Department</th>

        <th style={thStyle}>Status</th>

        <th style={thStyle}>Submitted</th>

        <th style={thStyle}>Actions</th>

      </tr>

    </thead>

    <tbody>

      {

        loading ?

        (

          <tr>

            <td
              colSpan="7"
              style={{
                padding:"30px",
                textAlign:"center"
              }}
            >

              Loading Submissions...

            </td>

          </tr>

        )

        :

        filteredSubmissions.length===0 ?

        (

          <tr>

            <td
              colSpan="7"
              style={{
                padding:"30px",
                textAlign:"center"
              }}
            >

              No Submissions Found

            </td>

          </tr>

        )

        :

        filteredSubmissions.map((submission)=>(

          <tr
            key={submission._id}
          >

            <td style={tdStyle}>

              <strong>

                {submission.submittedBy?.name}

              </strong>

              <br/>

              <span
                style={{
                  color:"#6b7280",
                  fontSize:"13px"
                }}
              >

                {submission.submittedBy?.email}

              </span>

            </td>

            <td style={tdStyle}>

              <span
                style={{

                  background:

                    submission.role==="faculty"

                    ?

                    "#10b981"

                    :

                    submission.role==="hod"

                    ?

                    "#f59e0b"

                    :

                    "#2563eb",

                  color:"#fff",

                  padding:"6px 12px",

                  borderRadius:"8px",

                  textTransform:"capitalize"

                }}
              >

                {submission.role}

              </span>

            </td>

            <td style={tdStyle}>

              {submission.quarter}

            </td>

            <td style={tdStyle}>

              {submission.submittedBy?.department || "-"}

            </td>

            <td style={tdStyle}>

              <span
                style={{

                  background:

                    submission.status.includes("Approved")

                    ?

                    "#10b981"

                    :

                    submission.status.includes("Pending")

                    ?

                    "#f59e0b"

                    :

                    "#ef4444",

                  color:"#fff",

                  padding:"6px 12px",

                  borderRadius:"8px",

                  fontSize:"13px"

                }}
              >

                {submission.status}

              </span>

            </td>

            <td style={tdStyle}>

              {

                submission.createdAt

                ?

                new Date(

                  submission.createdAt

                ).toLocaleDateString()

                :

                "-"

              }

            </td>

            <td style={tdStyle}>

              <div
                style={{
                  display:"flex",
                  gap:"8px",
                  flexWrap:"wrap"
                }}
              >

                <button
                  className="viewButton"
                  onClick={()=>

                    handleView(

                      submission._id

                    )

                  }
                >

                  View

                </button>

                <button
                  className="pdfButton"
                  onClick={()=>

                    handleDownload(

                      submission._id,

                      submission.quarter

                    )

                  }
                >

                  PDF

                </button>

              </div>

            </td>

          </tr>

        ))

      }

    </tbody>

  </table>

</div>
      {/* ===========================
          SUBMISSION VIEWER
      =========================== */}

      {
  showModal &&
  selectedSubmission && (

    selectedSubmission.role === "faculty"

      ? (

        <FacultySubmissionViewer
          submission={selectedSubmission}
          onClose={() => setShowModal(false)}
        />

      )

      : (

        <SubmissionViewer
          submission={selectedSubmission}
          questions={
            selectedSubmission.role === "hod"
              ? hodQuestions
              : deanQuestions
          }
          onClose={() => setShowModal(false)}
        />

      )

  )
}

      <style>

        {`

          .viewButton{

            background:#2563eb;
            color:white;
            border:none;
            padding:8px 18px;
            border-radius:8px;
            cursor:pointer;
            transition:.3s;

          }

          .viewButton:hover{

            background:#1d4ed8;

          }

          .pdfButton{

            background:#16a34a;
            color:white;
            border:none;
            padding:8px 18px;
            border-radius:8px;
            cursor:pointer;
            transition:.3s;

          }

          .pdfButton:hover{

            background:#15803d;

          }

        `}

      </style>

    </div>

  </AdminLayout>

  );

}

const inputStyle = {

  padding:"12px",

  border:"1px solid #d1d5db",

  borderRadius:"8px",

  outline:"none",

  fontSize:"15px",

  width:"100%"

};

const thStyle = {

  padding:"14px",

  textAlign:"left"

};

const tdStyle = {

  padding:"14px",

  borderBottom:"1px solid #e5e7eb"

};

export default AdminSubmissions;