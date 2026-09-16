import API from "./axios";

// ==============================
// FACULTY REVIEW
// ==============================

export const getFacultySubmissions = () =>
  API.get("/dean/faculty-submissions");

export const getFacultySubmissionById = (id) =>
  API.get(`/dean/faculty-submission/${id}`);

// ==============================
// HOD REVIEW
// ==============================

export const getHodSubmissions = (

  status = "",

  department = ""

) =>

  API.get(

    "/dean/hod-submissions",

    {

      params: {

        status,

        department

      }

    }

  );

export const getHodSubmissionById = (id) =>
  API.get(`/dean/hod-submission/${id}`);

// ==============================
// APPROVE / REJECT
// ==============================

export const approveSubmission = (id, remarks) =>
  API.put(`/dean/approve/${id}`, {
    remarks
  });

export const rejectSubmission = (id, remarks) =>
  API.put(`/dean/reject/${id}`, {
    remarks
  });

export const reviewQuestion = (id, questionNo, rejected, remarks = "") =>
  API.put(`/dean/review-question/${id}`, { questionNo, rejected, remarks });

// ==============================
// DEAN QUESTIONNAIRE
// ==============================

export const saveDeanSubmission = (data) =>
  API.post("/dean/save", data);

export const updateDeanSubmission = (id, data) =>
  API.put(
    `/dean/update/${id}`,
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data"
      }
    }
  );
  
export const submitDeanSubmission = (id) =>
  API.put(`/dean/submit/${id}`);

export const getMyDeanSubmissions = () =>
  API.get("/dean/my");

// ==============================
// PDF DOWNLOAD
// ==============================

export const downloadFacultyPDF = (id) =>
  API.get(
    `/submissions/download/${id}`,
    {
      responseType: "blob"
    }
  );

export const downloadHodPDF = (id) =>
  API.get(
    `/submissions/download/${id}`,
    {
      responseType: "blob"
    }
  );

  export const downloadDeanPDF = (id) =>
  API.get(
    `/submissions/download/${id}`,
    {
      responseType: "blob"
    }
  );

  export const clearDeanSubmission = (id) =>

  API.delete(`/dean/clear/${id}`);

export const getDeanAnalytics = (

  role,

  department

) =>

API.get(

  "/dean/analytics",

  {

    params: {

      role,

      department

    }

  }

);

export const getDeanDepartments = () =>
  API.get("/dean/departments");

export const downloadDeanExcel = (department) =>
  API.get("/dean/export-excel", {
    params: {
      department
    },
    responseType: "blob"
  });