import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import { useAuth } from "../../context/AuthContext";

import {
  getDashboardStats,
  getAllSubmissions,
  downloadAdminExcel
} from "../../api/adminApi";

import schoolsDepartments
from "../../data/schoolsDepartments";

function AdminDashboard() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({});

  const [submissions, setSubmissions] =
    useState([]);

  const [
  selectedSchool,
  setSelectedSchool
] = useState("All");

const [
  selectedDepartment,
  setSelectedDepartment
] = useState("All");

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const statsResponse =
          await getDashboardStats();

        const submissionResponse =
          await getAllSubmissions();

        setStats(
          statsResponse.data.stats || {}
        );

        setSubmissions(
          submissionResponse.data.submissions || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const recentSubmissions =
    submissions.slice(0, 5);

  const handleDownloadExcel =
async () => {
  console.log("Download button clicked");

  try {

    const response =
      await downloadAdminExcel({

        school:
          selectedSchool,

        department:
          selectedDepartment

      });

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "IQAC_Admin_Report.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

  }

  catch(error){

    console.log(error);

  }

};

  return (

    <AdminLayout>

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
              "linear-gradient(135deg,#2563eb,#1e3a8a)",
            color: "white",
            padding: "35px",
            borderRadius: "16px",
            marginBottom: "35px"
          }}
        >

          <h1
            style={{
              margin: 0
            }}
          >
            Welcome,
            {" "}
            {user?.name}
          </h1>

          <p
            style={{
              marginTop: "12px",
              fontSize: "17px"
            }}
          >
            Administrator
          </p>

          <p
            style={{
              marginTop: "6px",
              opacity: 0.9
            }}
          >
            Complete access to Faculty,
            HOD, Dean,
            Departments,
            Analytics,
            Reports,
            Users and
            Institutional Data.
          </p>

        </div>

        {/* Quick Actions */}

        <h2
          style={{
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
            gap: "20px",
            marginBottom: "40px"
          }}
        >

          <div
            className="action-card"
          >

            <h3>
              👥 User Management
            </h3>

            <p>
              Create, edit,
              activate or deactivate users.
            </p>

            <button
              onClick={() =>
                navigate("/admin/users")
              }
            >
              Open
            </button>

          </div>

          <div
            className="action-card"
          >

            <h3>
              📄 Approved Reports
            </h3>

            <p>
              View approved Faculty,
              HOD and Dean reports.
            </p>

            <button
              onClick={() =>
                navigate("/admin/approved-reports")
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
              Institution,
              School and
              Department analytics.
            </p>

            <button
              onClick={() =>
                navigate("/admin/analytics")
              }
            >
              Open
            </button>

          </div>

          <div
            className="action-card"
          >

            <h3>
              📝 Submissions
            </h3>

            <p>
              Monitor all submissions
              across the portal.
            </p>

            <button
              onClick={() =>
                navigate("/admin/submissions")
              }
            >
              Open
            </button>

          </div>

        </div>

        {/* ========================= */}
{/* Excel Download */}
{/* ========================= */}

<h2
style={{
  marginBottom:"20px"
}}
>
📥 Export Excel Report
</h2>

<div
style={{
  background:"#fff",
  padding:"25px",
  borderRadius:"15px",
  boxShadow:"0 4px 15px rgba(0,0,0,.08)",
  marginBottom:"40px"
}}
>

<div
style={{
  display:"grid",
  gridTemplateColumns:
    "1fr 1fr auto",
  gap:"20px",
  alignItems:"end"
}}
>

<div>

<label
style={{
fontWeight:"600",
marginBottom:"8px",
display:"block"
}}
>
School
</label>

<select

value={selectedSchool}

onChange={(e)=>{

setSelectedSchool(
e.target.value
);

setSelectedDepartment(
"All"
);

}}

style={{
width:"100%",
padding:"12px",
borderRadius:"8px"
}}

>

<option value="All">
All Schools
</option>

{

Object.keys(
schoolsDepartments
).map((school)=>(

<option
key={school}
value={school}
>

{school}

</option>

))

}

</select>

</div>

<div>

<label
style={{
fontWeight:"600",
marginBottom:"8px",
display:"block"
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

selectedSchool!=="All" &&

schoolsDepartments[
selectedSchool
]?.map((dept)=>(

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

<button

onClick={
handleDownloadExcel
}

style={{

height:"46px",

background:"#16a34a",

color:"#fff",

border:"none",

padding:"0 30px",

borderRadius:"8px",

cursor:"pointer",

fontWeight:"600"

}}

>

⬇ Download Excel

</button>

</div>

</div>

                {/* Dashboard Statistics */}

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Dashboard Statistics
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}
        >

          <div className="stat-card">
            <h2>{stats.totalFaculty || 0}</h2>
            <p>Total Faculty</p>
          </div>

          <div className="stat-card">
            <h2>{stats.totalHod || 0}</h2>
            <p>Total HOD</p>
          </div>

          <div className="stat-card">
            <h2>{stats.totalDean || 0}</h2>
            <p>Total Dean</p>
          </div>

          <div className="stat-card">
            <h2>{stats.totalUsers || 0}</h2>
            <p>Total Users</p>
          </div>

          <div className="stat-card">
            <h2>{stats.totalSubmissions || 0}</h2>
            <p>Total Submissions</p>
          </div>

          <div className="stat-card">
            <h2>{stats.pendingHodApproval || 0}</h2>
            <p>Pending HOD Approval</p>
          </div>

          <div className="stat-card">
            <h2>{stats.pendingDeanReview || 0}</h2>
            <p>Pending Dean Review</p>
          </div>

          <div className="stat-card">
            <h2>{stats.pendingAdminReview || 0}</h2>
            <p>Pending Admin Review</p>
          </div>

          <div className="stat-card">
            <h2>{stats.approvedByHod || 0}</h2>
            <p>Approved by HOD</p>
          </div>

          <div className="stat-card">
            <h2>{stats.approvedByDean || 0}</h2>
            <p>Approved by Dean</p>
          </div>

        </div>

        {/* Recent Submissions */}

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Recent Submissions
        </h2>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
            marginBottom: "40px"
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <thead
              style={{
                background: "#2563eb",
                color: "#ffffff"
              }}
            >

              <tr>

                <th style={thStyle}>
                  Name
                </th>

                <th style={thStyle}>
                  Role
                </th>

                <th style={thStyle}>
                  Quarter
                </th>

                <th style={thStyle}>
                  Department
                </th>

                <th style={thStyle}>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {
                recentSubmissions.length === 0 ?

                  (

                    <tr>

                      <td
                        colSpan="5"
                        style={{
                          padding: "25px",
                          textAlign: "center"
                        }}
                      >
                        No submissions found
                      </td>

                    </tr>

                  )

                  :

                  recentSubmissions.map(
                    (submission) => (

                      <tr
                        key={submission._id}
                      >

                        <td style={tdStyle}>
                          {
                            submission
                              ?.submittedBy
                              ?.name
                          }
                        </td>

                        <td style={tdStyle}>
                          {
                            submission
                              ?.submittedBy
                              ?.role
                          }
                        </td>

                        <td style={tdStyle}>
                          {
                            submission
                              ?.quarter
                          }
                        </td>

                        <td style={tdStyle}>
                          {
                            submission
                              ?.submittedBy
                              ?.department
                          }
                        </td>

                        <td style={tdStyle}>

                          <span
                            style={{
                              padding:
                                "6px 12px",
                              borderRadius:
                                "8px",
                              color:
                                "#ffffff",
                              background:
                                submission.status.includes(
                                  "Approved"
                                )
                                  ? "#10b981"
                                  : submission.status.includes(
                                      "Pending"
                                    )
                                  ? "#f59e0b"
                                  : "#ef4444"
                            }}
                          >

                            {
                              submission.status
                            }

                          </span>

                        </td>

                      </tr>

                    )
                  )

              }

            </tbody>

          </table>

        </div>

                {/* Institution Overview */}

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Institution Overview
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}
        >

          <div className="action-card">
            <h3>🏫 Schools</h3>
            <p>Manage Schools and Institution Structure.</p>
          </div>

          <div className="action-card">
            <h3>🏢 Departments</h3>
            <p>Manage Departments across all Schools.</p>
          </div>

          <div className="action-card">
            <h3>📅 Academic Year</h3>
            <p>Configure Academic Years & Submission Windows.</p>
          </div>

          <div className="action-card">
            <h3>🔐 System Settings</h3>
            <p>Manage Roles, Permissions and Portal Configuration.</p>
          </div>

        </div>

        {/* Responsibilities */}

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Administrator Responsibilities
        </h2>

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            marginBottom: "40px"
          }}
        >

          <ul
            style={{
              lineHeight: "2",
              paddingLeft: "25px"
            }}
          >

            <li>Manage all Faculty, HOD, Dean and Admin accounts.</li>

            <li>Create, Edit, Delete and Activate Users.</li>

            <li>Manage Schools and Departments.</li>

            <li>Monitor all submissions across the institution.</li>

            <li>View Institute, School and Department Analytics.</li>

            <li>Export Institutional Reports.</li>

            <li>Configure Submission Deadlines.</li>

            <li>Monitor User Activity and Audit Logs.</li>

            <li>Reset Passwords and Manage Permissions.</li>

            <li>Overall IQAC Monitoring and Administration.</li>

          </ul>

        </div>

        <style>

          {`

            .stat-card{

              background:#ffffff;
              padding:25px;
              border-radius:15px;
              text-align:center;
              cursor:pointer;
              transition:.3s;
              box-shadow:0 4px 15px rgba(0,0,0,.08);

            }

            .stat-card:hover{

              transform:translateY(-4px);

            }

            .stat-card h2{

              color:#2563eb;
              margin:0;
              font-size:34px;

            }

            .action-card{

              background:#ffffff;
              padding:25px;
              border-radius:15px;
              box-shadow:0 4px 15px rgba(0,0,0,.08);

            }

            .action-card h3{

              margin-top:0;

            }

            .action-card button{

              margin-top:15px;
              background:#2563eb;
              color:white;
              border:none;
              padding:10px 22px;
              border-radius:8px;
              cursor:pointer;

            }

            .action-card button:hover{

              background:#1d4ed8;

            }

          `}

        </style>

      </div>

    </AdminLayout>

  );

}

const thStyle = {

  padding: "14px",

  textAlign: "left"

};

const tdStyle = {

  padding: "14px",

  borderBottom:
    "1px solid #e5e7eb"

};

export default AdminDashboard;