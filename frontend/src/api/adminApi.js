import api from "./axios";

// ==============================
// Dashboard
// ==============================

export const getDashboardStats = () =>
  api.get("/admin/dashboard");

// ==============================
// Users
// ==============================

export const getAllUsers = () =>
  api.get("/admin/users");


// Update User
export const updateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data);

// Activate / Deactivate User
export const toggleUserStatus = (id) =>
  api.put(`/admin/users/${id}/status`);

// Soft Delete User
export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

// ==============================
// Submissions
// ==============================

export const getAllSubmissions = () =>
  api.get("/admin/submissions");

export const getSubmissionById = (id) =>
  api.get(`/admin/submissions/${id}`);

export const getApprovedSubmissions = () =>
  api.get("/admin/approved-submissions", {
    params: { _ts: Date.now() },
    headers: { "Cache-Control": "no-cache" }
  });

export const downloadSubmissionPDF = (id) =>
  api.get(
    `/submissions/download/${id}`,
    {
      responseType: "blob"
    }
  );

// ==============================
// Analytics
// ==============================

export const getAdminAnalytics = (params) =>
  api.get(
    "/admin/analytics",
    {
      params
    }
  );
// ==============================
// EXCEL DOWNLOAD
// ==============================
  export const downloadAdminExcel = (params) =>
  api.get(
    "/admin/download-excel",
    {
      params,
      responseType: "blob"
    }
  );

export const downloadApprovedReportsExcel = (params) =>
  api.get("/admin/download-approved-reports-excel", {
    params,
    responseType: "blob"
  });

export const downloadApprovedReportsPDF = (params) =>
  api.get("/admin/download-approved-reports-pdf", {
    params,
    responseType: "blob"
  });
