import API from "./submissionApi";

// Faculty submissions waiting for HOD

export const getFacultySubmissions =
  () =>
    API.get(
      "/hod/faculty-submissions"
    );

// Approve Faculty Submission

export const approveSubmission =
  (id) =>
    API.put(
      `/hod/approve/${id}`
    );

// Reject Faculty Submission

export const rejectSubmission =
  (id, remarks) =>
    API.put(
      `/hod/reject/${id}`,
      {
        remarks
      }
    );

    export const downloadFacultyPDF =
  (id) =>
    API.get(
      `/submissions/download/${id}`,
      {
        responseType: "blob"
      }
    );

    export const saveHodSubmission =
  (data) =>
    API.post(
      "/hod/save",
      data
    );

export const submitHodSubmission =
  (id) =>
    API.put(
      `/hod/submit/${id}`
    );

export const getMyHodSubmissions =
  () =>
    API.get(
      "/hod/my"
    );

    export const updateHodSubmission =
  (id, data) =>
    API.put(
      `/hod/update/${id}`,
      data
    );

    export const downloadHodPDF =
(id) =>
API.get(
`/submissions/download/${id}`,
{
responseType:"blob"
}
);

export const getHodAnalytics =
() =>
API.get(
"/hod/analytics"
);

export const clearHodSubmission =
(id)=>

API.delete(

`/hod/clear/${id}`

);

export const getFacultyReviewStats = () =>
  API.get("/hod/faculty-review-stats");

export const downloadHodExcel = () =>
  API.get(
    "/hod/export-excel",
    {
      responseType: "blob"
    }
  );

export const getHodDepartmentInfo = () =>
  API.get(
    "/hod/department-info"
  );