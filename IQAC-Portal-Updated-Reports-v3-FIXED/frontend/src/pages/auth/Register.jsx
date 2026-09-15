import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import schoolsDepartments from "../../data/schoolsDepartments";

function Register() {

  const navigate = useNavigate();

const [formData, setFormData] =
useState({
  name: "",
  email: "",
  password: "",
  employeeId: "",
  gender: "",
  role: "faculty",
  school: "",
  department: "",
  designation: "",
  dateOfJoining: "",
  facultyPhoto: "",
  employmentType: "",
  dateOfAppointment: "",
  dateOfRelieving: "",
  scopusAuthorId: "",
  vidwanId: ""
});

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    if (name === "role") {

      setFormData({
        ...formData,
        role: value,
        school: "",
        department: ""
      });

      return;
    }

    if (name === "school") {

      setFormData({
        ...formData,
        school: value,
        department: ""
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setFormData((previous) => ({
      ...previous,
      facultyPhoto: reader.result
    }));
    reader.readAsDataURL(file);
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      // Full Name

      if (
        !formData.name.trim()
      ) {
        alert(
          "Please enter Full Name"
        );
        return;
      }

      // Email

      if (
        !formData.email.trim()
      ) {
        alert(
          "Please enter Email"
        );
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          formData.email
        )
      ) {
        alert(
          "Please enter valid Email"
        );
        return;
      }

      // Password

      if (
        !formData.password
      ) {
        alert(
          "Please enter Password"
        );
        return;
      }

      if (
        formData.password.length < 6
      ) {
        alert(
          "Password must contain at least 6 characters"
        );
        return;
      }

      // Employee ID Validation

if (!formData.employeeId.trim()) {

  alert("Please enter Employee ID");

  return;

}

      // Gender

if (!formData.gender) {

  alert(
    "Please select Gender"
  );

  return;

}

      // School

      if (
        !formData.school
      ) {
        alert(
          "Please select School"
        );
        return;
      }

      // Designation

      if (!formData.designation.trim()) {
        alert("Please enter Designation");
        return;
      }

      // Date of Joining

      if (!formData.dateOfJoining) {
        alert("Please enter Date of Joining");
        return;
      }

      if (formData.role === "faculty" && !formData.employmentType) {
        alert("Please select Employment Type");
        return;
      }

      if (formData.role === "faculty" && !formData.dateOfAppointment) {
        alert("Please enter Date/Year of Appointment");
        return;
      }

      // Department

      if (
        formData.role !== "dean" &&
        !formData.department
      ) {
        alert(
          "Please select Department"
        );
        return;
      }

      try {

        await registerUser(
          formData
        );

        alert(
          "Registration Successful"
        );

        navigate(
          "/login"
        );

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Registration Failed"
        );

      }
    };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#2563eb,#1e3a8a)",
        padding: "20px"
      }}
    >

      <div
        style={{
          width: "550px",
          background: "#fff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.2)"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px"
          }}
        >
          SRIHER IQAC
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px"
          }}
        >
          Create New Account
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={
              handleChange
            }
            style={inputStyle}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={
              handleChange
            }
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={
              handleChange
            }
            style={inputStyle}
          />

          <input
  name="employeeId"
  type="text"
  placeholder="Employee ID"
  value={formData.employeeId}
  onChange={handleChange}
  style={inputStyle}
/>

          <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  style={inputStyle}
>

  <option value="">
    Select Gender
  </option>

  <option value="Male">
    Male
  </option>

  <option value="Female">
    Female
  </option>

</select>

          <select
            name="role"
            value={formData.role}
            onChange={
              handleChange
            }
            style={inputStyle}
          >
            <option value="faculty">
              Faculty
            </option>

            <option value="hod">
              HOD
            </option>

            <option value="dean">
              Dean
            </option>
          </select>

          <select
            name="school"
            value={formData.school}
            onChange={
              handleChange
            }
            style={inputStyle}
          >
            <option value="">
              Select School
            </option>

            {
              Object.keys(
                schoolsDepartments
              ).map(
                (school) => (

                  <option
                    key={school}
                    value={school}
                  >
                    {school}
                  </option>

                )
              )
            }

          </select>

          <input
            name="designation"
            type="text"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={handleChange}
            style={inputStyle}
          />

          {formData.role === "faculty" && (
            <>
              <label style={fieldLabel}>Faculty Photo</label>
              <input type="file" accept="image/png,image/jpeg" onChange={handlePhotoChange} style={inputStyle} />

              <select name="employmentType" value={formData.employmentType} onChange={handleChange} style={inputStyle}>
                <option value="">Select Employment Type</option>
                <option value="Permanent">Permanent</option>
                <option value="Temporary">Temporary</option>
              </select>

              <label style={fieldLabel}>Date/Year of Appointment</label>
              <input name="dateOfAppointment" type="date" value={formData.dateOfAppointment} onChange={handleChange} style={inputStyle} />

              <label style={fieldLabel}>Date of Relieving (if applicable)</label>
              <input name="dateOfRelieving" type="date" value={formData.dateOfRelieving} onChange={handleChange} style={inputStyle} />

              <input name="scopusAuthorId" type="text" placeholder="SCOPUS Author ID" value={formData.scopusAuthorId} onChange={handleChange} style={inputStyle} />
              <input name="vidwanId" type="text" placeholder="VIDWAN ID" value={formData.vidwanId} onChange={handleChange} style={inputStyle} />
            </>
          )}

          {
            formData.role !== "dean" &&
            formData.school && (

              <select
                name="department"
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
              >

                <option value="">
                  Select Department
                </option>

                {
                  schoolsDepartments[
                    formData.school
                  ]?.map(
                    (
                      department
                    ) => (

                      <option
                        key={
                          department
                        }
                        value={
                          department
                        }
                      >
                        {
                          department
                        }
                      </option>

                    )
                  )
                }

              </select>

            )
          }

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background:
                "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Register
          </button>

        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

const fieldLabel = {
  display: "block",
  marginBottom: "6px",
  color: "#374151",
  fontWeight: 600
};

export default Register;