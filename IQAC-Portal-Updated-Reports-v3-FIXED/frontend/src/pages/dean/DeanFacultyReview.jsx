import { useEffect, useState } from "react";
import schoolsDepartments from "../../data/schoolsDepartments";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import DeanLayout from "../../layouts/DeanLayout";

import {
  getFacultySubmissions,
  downloadFacultyPDF,
  approveSubmission
} from "../../api/deanApi";

function DeanFacultyReview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState(() => localStorage.getItem("deanDepartment") || "");
  const [selectedQuarter, setSelectedQuarter] = useState(() => localStorage.getItem("deanQuarter") || "");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("pending");

  useEffect(() => {
    loadFacultySubmissions();
  }, []);

  const loadFacultySubmissions = async () => {
    try {
      const res = await getFacultySubmissions();
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // PDF DOWNLOAD
  // ==========================

  const handleDownload =
    async (submission) => {

      try {

        const response =
          await downloadFacultyPDF(
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

        document.body.appendChild(link);

        link.click();

        link.remove();

      }

      catch (error) {

        console.error(error);

      }

    };

    // ==========================
// DEPARTMENTS OF DEAN SCHOOL
// ==========================

const departments =

  schoolsDepartments[user?.school] || [];

// ==========================
// FILTERED SUBMISSIONS
// ==========================

const filteredSubmissions =
submissions.filter((submission)=>{

const departmentMatch =

selectedDepartment === "" ||

submission.department ===
selectedDepartment;

const quarterMatch =

selectedQuarter === "" ||

submission.quarter ===
selectedQuarter;

let statusMatch = true;

if(selectedTab==="pending"){

statusMatch =
submission.status ===
"Pending Dean Review";

}

else if(selectedTab==="approved"){

statusMatch =
submission.status ===
"Approved by Dean";

}

else{

statusMatch =
submission.status ===
"Rejected by Dean";

}

return(

departmentMatch &&

quarterMatch &&

statusMatch

);

});

if(loading){

return(

<DeanLayout>

<div style={{padding:"40px"}}>

Loading...

</div>

</DeanLayout>

);

}

  return (

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
    Faculty Reviews
  </h1>
 <div
  style={{
    marginBottom: "30px"
  }}
>

  <label
    style={{
      fontWeight: "600",
      display: "block",
      marginBottom: "10px"
    }}
  >

    Select Department

  </label>

  <select

    value={selectedDepartment}

    onChange={(e)=>{

  setSelectedDepartment(e.target.value);

  localStorage.setItem(
    "deanDepartment",
    e.target.value
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

      departments.map(

        (department) => (

          <option

            key={department}

            value={department}

          >

            {department}

          </option>

        )

      )

    }

  </select>

</div>

<div
  style={{
    marginBottom: "30px"
  }}
>

  <label
    style={{
      fontWeight: "600",
      display: "block",
      marginBottom: "10px"
    }}
  >
    Select Quarter
  </label>

  <select
    value={selectedQuarter}
    onChange={(e)=>{

  setSelectedQuarter(e.target.value);

  localStorage.setItem(
    "deanQuarter",
    e.target.value
  );

}}
    style={{
      width: "220px",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db"
    }}
  >

    <option value="">
      -- Select Quarter --
    </option>

    <option value="Q1">
      Quarter 1 (Q1)
    </option>

    <option value="Q2">
      Quarter 2 (Q2)
    </option>

    <option value="Q3">
      Quarter 3 (Q3)
    </option>

    <option value="Q4">
      Quarter 4 (Q4)
    </option>

  </select>

</div>

<div
style={{
display:"flex",
gap:"15px",
marginBottom:"30px"
}}
>

<button
onClick={()=>
setSelectedTab("pending")
}
style={{
padding:"12px 25px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
background:
selectedTab==="pending"
? "#2563eb"
: "#e5e7eb",
color:
selectedTab==="pending"
? "#fff"
: "#111827"
}}
>
Pending Reviews
</button>

<button
onClick={()=>
setSelectedTab("approved")
}
style={{
padding:"12px 25px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
background:
selectedTab==="approved"
? "#16a34a"
: "#e5e7eb",
color:
selectedTab==="approved"
? "#fff"
: "#111827"
}}
>
Approved Reviews
</button>

<button
onClick={()=>
setSelectedTab("rejected")
}
style={{
padding:"12px 25px",
border:"none",
borderRadius:"8px",
cursor:"pointer",
background:
selectedTab==="rejected"
? "#dc2626"
: "#e5e7eb",
color:
selectedTab==="rejected"
? "#fff"
: "#111827"
}}
>
Rejected Reviews
</button>

</div>
  <p
  style={{
    color:"#6b7280",
    marginBottom:"30px"
  }}
>

{
selectedTab==="pending"

? "Faculty Submissions Pending Dean Review"

: selectedTab==="approved"

? "Faculty Submissions Approved by Dean"

: "Faculty Submissions Rejected by Dean"

}

</p>

{selectedDepartment === "" ||
selectedQuarter === "" ? (

  <div
    style={{
      background: "#fff",
      padding: "30px",
      borderRadius: "12px",
      textAlign: "center",
      color: "#6b7280"
    }}
  >
    Please select Department and Quarter.
  </div>

) : filteredSubmissions.length === 0 ? (

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
    {
selectedTab==="pending"

? "No Faculty Pending Dean Review"

: selectedTab==="approved"

? "No Faculty Approved by Dean"

: "No Faculty Rejected by Dean"

}
  </div>

) : (
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
      boxShadow: "0 2px 8px rgba(0,0,0,.08)"
    }}
  >

    <thead>

      <tr
        style={{
          background: "#2563eb",
          color: "#fff"
        }}
      >

        <th style={thStyle}>Faculty</th>

        <th style={thStyle}>Email</th>

        <th style={thStyle}>Department</th>

        <th style={thStyle}>Quarter</th>

        <th style={thStyle}>Answered</th>

        <th style={thStyle}>Submitted Date</th>

        <th style={thStyle}>Actions</th>

      </tr>

    </thead>

    <tbody>

      {filteredSubmissions.map((submission) => (

        <tr key={submission._id}>

          <td style={tdStyle}>
            {submission.submittedByName}
          </td>

          <td style={tdStyle}>
            {submission.submittedByEmail}
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
            {submission.answeredCount} / {submission.totalQuestions}
          </td>

          <td style={tdStyle}>
            {new Date(submission.createdAt).toLocaleDateString()}
          </td>

          <td style={tdStyle}>

            <button
  onClick={() =>
    navigate(
      `/dean/faculty-view/${submission._id}`
    )
  }
  style={{
    padding: "8px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px"
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
                cursor: "pointer"
              }}
            >
              📄 PDF
            </button>

          </td>

        </tr>

      ))}

    </tbody>

  </table>
</div>
)}

</div>
    </DeanLayout>

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
export default DeanFacultyReview;