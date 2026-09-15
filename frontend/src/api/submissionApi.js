import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Attach JWT Token Automatically

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) =>
    Promise.reject(error)

);

// ==============================
// SAVE NEW SUBMISSION
// ==============================

export const saveSubmission =
  (data) =>
    API.post(
      "/submissions/save",
      data
    );

// ==============================
// GET LOGGED IN USER
// SUBMISSIONS
// ==============================

export const getMySubmissions =
  () =>
    API.get(
      "/submissions/my"
    );

// ==============================
// GET SINGLE SUBMISSION
// FOR EDIT MODE
// ==============================

export const getSubmissionById =
  (id) =>
    API.get(
      `/submissions/${id}`
    );

// ==============================
// UPDATE EXISTING SUBMISSION
// ==============================

export const updateSubmission =
  (id, data) =>
    API.put(
      `/submissions/update/${id}`,
      data
    );

// ==============================
// SUBMIT QUESTIONNAIRE
// OPTIONAL
// ==============================

export const submitQuestionnaire =
  (id) =>
    API.put(
      `/submissions/submit/${id}`
    );

export const downloadPDF =
  (id) =>
    API.get(
      `/submissions/download/${id}`,
      {
        responseType: "blob"
      }
    );
    export const clearSubmission =
(id)=>

API.delete(
`/submissions/clear/${id}`
);

export default API;