import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import schoolsDepartments from "../../data/schoolsDepartments";
import {
  getAllUsers,
  updateUser,
  toggleUserStatus,
  deleteUser
} from "../../api/adminApi";

function UserManagement() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [schoolFilter, setSchoolFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});


  useEffect(() => {

    fetchUsers();

  }, []);

 const fetchUsers = async () => { 

    try {

      const response =
        await getAllUsers();

      setUsers(
        response.data.users || []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      school: user.school || "",
      department: user.department || "",
      designation: user.designation || "",
      employeeId: user.employeeId || "",
      dateOfJoining: user.dateOfJoining || "",
      facultyPhoto: user.facultyPhoto || "",
      employmentType: user.employmentType || "",
      dateOfAppointment: user.dateOfAppointment || "",
      dateOfRelieving: user.dateOfRelieving || "",
      scopusAuthorId: user.scopusAuthorId || "",
      vidwanId: user.vidwanId || ""
    });
  };

  const handleEditChange = (event) => {
    setEditForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const saveUser = async (event) => {
    event.preventDefault();
    try {
      await updateUser(editingUser._id, editForm);
      setEditingUser(null);
      await fetchUsers();
      alert("User updated successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user.");
    }
  };

  const filteredUsers =
    users.filter((user) => {

      const matchesSearch =

        user.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        user.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesRole =

        roleFilter === "All"

        ||

        user.role === roleFilter;

      const matchesSchool =

        schoolFilter === "All"

        ||

        user.school === schoolFilter;

      const matchesDepartment =

        departmentFilter === "All"

        ||

        user.department ===
        departmentFilter;

      return (

        matchesSearch &&

        matchesRole &&

        matchesSchool &&

        matchesDepartment

      );

    });
    
    const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {

    await deleteUser(id);

    fetchUsers();

    alert("User deleted successfully.");

  } catch (err) {

    console.log(err);

    alert("Failed to delete user.");

  }

};

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
            color:"white",
            padding:"30px",
            borderRadius:"15px",
            marginBottom:"30px"
          }}
        >

          <h1
            style={{margin:0}}
          >
            User Management
          </h1>

          <p
            style={{
              marginTop:"10px"
            }}
          >
            Manage Faculty,
            HOD,
            Dean and
            Admin Accounts
          </p>

        </div>

        <div
          style={{
            background:"#fff",
            padding:"20px",
            borderRadius:"15px",
            marginBottom:"25px",
            display:"grid",
            gap:"15px",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))"
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
            value={roleFilter}

            onChange={(e)=>
              setRoleFilter(
                e.target.value
              )
            }

            style={inputStyle}
          >

            <option>
              All
            </option>

            <option>
              faculty
            </option>

            <option>
              hod
            </option>

            <option>
              dean
            </option>

            <option>
              admin
            </option>

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

<option value="IQAC">IQAC</option>

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
            value={
              departmentFilter
            }

            onChange={(e)=>
              setDepartmentFilter(
                e.target.value
              )
            }

            style={inputStyle}
          >

            <option value="All">
    All
</option>

{

    schoolFilter !== "All" &&
    schoolFilter !== "IQAC" &&

    schoolsDepartments[schoolFilter]?.map((department)=>(

        <option
            key={department}
            value={department}
        >
            {department}
        </option>

    ))

}

{

    schoolFilter === "IQAC" && (

        <option value="IQAC">
            IQAC
        </option>

    )

}

          </select>

        </div>
                <div
          style={{
            background:"#fff",
            borderRadius:"15px",
            overflow:"hidden",
            boxShadow:"0 4px 15px rgba(0,0,0,0.08)"
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
                color:"#fff"
              }}
            >

              <tr>

                <th style={thStyle}>Name</th>

                <th style={thStyle}>Email</th>

                <th style={thStyle}>Role</th>

                <th style={thStyle}>School</th>

                <th style={thStyle}>Department</th>

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
                      colSpan="7"
                      style={{
                        padding:"30px",
                        textAlign:"center"
                      }}
                    >

                      Loading...

                    </td>

                  </tr>

                )

                :

                filteredUsers.length===0 ?

                (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        padding:"30px",
                        textAlign:"center"
                      }}
                    >

                      No Users Found

                    </td>

                  </tr>

                )

                :

                filteredUsers.map((user)=>(

                  <tr
                    key={user._id}
                  >

                    <td style={tdStyle}>

                      {user.name}

                    </td>

                    <td style={tdStyle}>

                      {user.email}

                    </td>

                    <td style={tdStyle}>

                      <span
                        style={{
                          background:
                            user.role==="admin"
                            ?"#dc2626"
                            :user.role==="dean"
                            ?"#2563eb"
                            :user.role==="hod"
                            ?"#f59e0b"
                            :"#10b981",

                          color:"#fff",

                          padding:"6px 12px",

                          borderRadius:"8px",

                          textTransform:"capitalize",

                          fontSize:"14px"
                        }}
                      >

                        {user.role}

                      </span>

                    </td>

                    <td style={tdStyle}>

                      {user.school || "-"}

                    </td>

                    <td style={tdStyle}>

                      {user.department || "-"}

                    </td>

                    <td style={tdStyle}>

                      <span
                        style={{
                          background:
                            user.isActive===false
                            ?"#ef4444"
                            :"#10b981",

                          color:"#fff",

                          padding:"6px 12px",

                          borderRadius:"8px"
                        }}
                      >

                        {

                          user.isActive===false

                          ?

                          "Inactive"

                          :

                          "Active"

                        }

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
  className="actionButton"
  onClick={() => startEditing(user)}
>
  Edit
</button>
                        <button
  className="deleteButton"
  onClick={() => handleDelete(user._id)}
>
  Delete
</button>
                      </div>

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        </div>

        {editingUser && (
          <div style={modalBackdrop}>
            <form onSubmit={saveUser} style={editModal}>
              <h2>Edit User Profile</h2>
              <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Full Name" style={inputStyle} />
              <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" style={inputStyle} />
              <input name="employeeId" value={editForm.employeeId} onChange={handleEditChange} placeholder="Employee ID" style={inputStyle} />
              <input name="designation" value={editForm.designation} onChange={handleEditChange} placeholder="Designation" style={inputStyle} />
              <input name="dateOfJoining" type="date" value={editForm.dateOfJoining} onChange={handleEditChange} style={inputStyle} />
              {editingUser.role === "faculty" && (
                <>
                  <input name="facultyPhoto" value={editForm.facultyPhoto} onChange={handleEditChange} placeholder="Faculty Photo URL or data" style={inputStyle} />
                  <select name="employmentType" value={editForm.employmentType} onChange={handleEditChange} style={inputStyle}>
                    <option value="">Select Employment Type</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                  <input name="dateOfAppointment" type="date" value={editForm.dateOfAppointment} onChange={handleEditChange} style={inputStyle} />
                  <input name="dateOfRelieving" type="date" value={editForm.dateOfRelieving} onChange={handleEditChange} style={inputStyle} />
                  <input name="scopusAuthorId" value={editForm.scopusAuthorId} onChange={handleEditChange} placeholder="SCOPUS Author ID" style={inputStyle} />
                  <input name="vidwanId" value={editForm.vidwanId} onChange={handleEditChange} placeholder="VIDWAN ID" style={inputStyle} />
                </>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="actionButton">Save</button>
                <button type="button" className="deleteButton" onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
                <style>

          {`

            .actionButton{

              background:#2563eb;
              color:#fff;
              border:none;
              padding:8px 16px;
              border-radius:8px;
              cursor:pointer;
              transition:.3s;

            }

            .actionButton:hover{

              background:#1d4ed8;

            }

            .deleteButton{

              background:#ef4444;
              color:#fff;
              border:none;
              padding:8px 16px;
              border-radius:8px;
              cursor:pointer;

            }

            .deleteButton:hover{

              background:#dc2626;

            }

            .statusButton{

              background:#10b981;
              color:#fff;
              border:none;
              padding:8px 16px;
              border-radius:8px;
              cursor:pointer;

            }

            .statusButton:hover{

              background:#059669;

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

  fontSize:"15px"

};

const thStyle = {

  padding:"14px",

  textAlign:"left"

};

const tdStyle = {

  padding:"14px",

  borderBottom:"1px solid #e5e7eb"

};

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 10
};

const editModal = {
  background: "#fff",
  borderRadius: 12,
  padding: 24,
  width: "min(520px, 100%)",
  maxHeight: "90vh",
  overflowY: "auto"
};

export default UserManagement;
