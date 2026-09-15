import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

import schoolsDepartments from "../../data/schoolsDepartments";

import SubmissionViewer from "../../components/common/SubmissionViewer";
import FacultySubmissionViewer
from "../../components/common/FacultySubmissionViewer";

import facultyQuestions from "../../data/facultyQuestions";
import hodQuestions from "../../data/hodQuestions";
import deanQuestions from "../../data/deanQuestions";

import {
  getAllSubmissions,
  getSubmissionById,
  downloadSubmissionPDF
} from "../../api/adminApi";

function Reports() {

  const [loading, setLoading] =
    useState(true);

  const [submissions, setSubmissions] =
    useState([]);

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [roleTab, setRoleTab] =
    useState("faculty");

  const [search, setSearch] =
    useState("");

  const [quarterFilter, setQuarterFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [schoolFilter, setSchoolFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  useEffect(() => {

    loadReports();

  }, []);

  // ===========================
  // LOAD REPORTS
  // ===========================

  const loadReports =
    async () => {

      try {

        const response =
          await getAllSubmissions();

        setSubmissions(
          response.data.submissions || []
        );

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
              type: "application/pdf"
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
  // FILTER OPTIONS
  // ===========================

  

  // ===========================
  // FILTER REPORTS
  // ===========================

  const filteredReports =
    submissions.filter((report) => {

      const matchesRole =
        report.role === roleTab;

      const matchesSearch =

        report.submittedBy?.name

          ?.toLowerCase()

          .includes(
            search.toLowerCase()
          )

        ||

        report.submittedBy?.email

          ?.toLowerCase()

          .includes(
            search.toLowerCase()
          );

      const matchesQuarter =

        quarterFilter === "All"

        ||

        report.quarter ===
        quarterFilter;

      const matchesStatus =

        statusFilter === "All"

        ||

        report.status ===
        statusFilter;

      const matchesSchool =

        schoolFilter === "All"

        ||

        report.submittedBy?.school ===
        schoolFilter;

      const matchesDepartment =

        departmentFilter === "All"

        ||

        report.submittedBy?.department ===
        departmentFilter;

      return (

        matchesRole &&

        matchesSearch &&

        matchesQuarter &&

        matchesStatus &&

        matchesSchool &&

        matchesDepartment

      );

    });

  return (

    <AdminLayout>
        <div
  style={{
    background: "#f3f4f6",
    minHeight: "100vh"
  }}
>

  {/* Header */}

  <div
    style={{
      background:
        "linear-gradient(135deg,#2563eb,#1e3a8a)",
      color: "#fff",
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
      Admin Reports
    </h1>

    <p
      style={{
        marginTop: "10px"
      }}
    >
      View and download Faculty, HOD and Dean submissions.
    </p>

  </div>

  {/* Role Tabs */}

  <div
    style={{
      display: "flex",
      gap: "15px",
      marginBottom: "25px"
    }}
  >

    {

      ["faculty","hod","dean"].map(
        (role) => (

          <button

            key={role}

            onClick={() =>
              setRoleTab(role)
            }

            style={{

              padding:"12px 24px",

              border:"none",

              borderRadius:"8px",

              cursor:"pointer",

              fontWeight:"600",

              background:

                roleTab===role

                ?

                "#2563eb"

                :

                "#ffffff",

              color:

                roleTab===role

                ?

                "#ffffff"

                :

                "#111827"

            }}

          >

            {role.toUpperCase()}

          </button>

        )

      )

    }

  </div>

  {/* Filters */}

  <div
    style={{
      background:"#ffffff",
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

      placeholder="Search Name / Email"

      value={search}

      onChange={(e)=>
        setSearch(
          e.target.value
        )
      }

      style={inputStyle}

    />

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
      <option value="POOLED">Yearly / pooled (Q1-Q4)</option>

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
      <option>Approved by HOD</option>
      <option>Approved by Dean</option>
      <option>Submitted to Admin</option>
      <option>Pending Admin Review</option>

    </select>

    <select

      value={schoolFilter}

      onChange={(e) => {

  setSchoolFilter(e.target.value);

  setDepartmentFilter("All");

}}

      style={inputStyle}

    >

     <option value="All">All</option>

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

      onChange={(e)=>
        setDepartmentFilter(
          e.target.value
        )
      }

      style={inputStyle}

    >

      <option value="All">All</option>

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

  </div>
  {/* ===========================
    REPORTS TABLE
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

        <th style={thStyle}>Faculty / User</th>

        <th style={thStyle}>Role</th>

        <th style={thStyle}>Quarter</th>

        <th style={thStyle}>School</th>

        <th style={thStyle}>Department</th>

        <th style={thStyle}>Submitted Date</th>

        <th style={thStyle}>Status</th>

        <th style={thStyle}>Actions</th>

      </tr>

    </thead>

    <tbody>

      {

        loading ?

        (

          <tr>

            <td
              colSpan="8"
              style={{
                padding:"30px",
                textAlign:"center"
              }}
            >

              Loading Reports...

            </td>

          </tr>

        )

        :

        filteredReports.length===0 ?

        (

          <tr>

            <td
              colSpan="8"
              style={{
                padding:"30px",
                textAlign:"center"
              }}
            >

              No Reports Found

            </td>

          </tr>

        )

        :

        filteredReports.map((report)=>(

          <tr
            key={report._id}
          >

            <td style={tdStyle}>

              <strong>

                {report.submittedBy?.name}

              </strong>

              <br/>

              <span
                style={{
                  color:"#6b7280",
                  fontSize:"13px"
                }}
              >

                {report.submittedBy?.email}

              </span>

            </td>

            <td style={tdStyle}>

              <span
                style={{

                  background:

                    report.role==="faculty"

                    ?

                    "#10b981"

                    :

                    report.role==="hod"

                    ?

                    "#f59e0b"

                    :

                    "#2563eb",

                  color:"#ffffff",

                  padding:"6px 12px",

                  borderRadius:"8px",

                  textTransform:"capitalize",

                  fontSize:"14px"

                }}
              >

                {report.role}

              </span>

            </td>

            <td style={tdStyle}>

              {report.quarter}

            </td>

            <td style={tdStyle}>

              {report.submittedBy?.school || "-"}

            </td>

            <td style={tdStyle}>

              {report.submittedBy?.department || "-"}

            </td>

            <td style={tdStyle}>

              {

                report.createdAt

                ?

                new Date(
                  report.createdAt
                ).toLocaleDateString()

                :

                "-"

              }

            </td>

            <td style={tdStyle}>

              <span
                style={{

                  background:

                    report.status.includes("Approved")

                    ?

                    "#10b981"

                    :

                    report.status.includes("Pending")

                    ?

                    "#f59e0b"

                    :

                    "#ef4444",

                  color:"#ffffff",

                  padding:"6px 12px",

                  borderRadius:"8px",

                  fontSize:"13px"

                }}
              >

                {report.status}

              </span>

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
                  onClick={() =>
                    handleView(report._id)
                  }
                >

                  View

                </button>

                <button
                  className="pdfButton"
                  onClick={()=>

                    handleDownload(

                      report._id,

                      report.quarter

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

export default Reports;