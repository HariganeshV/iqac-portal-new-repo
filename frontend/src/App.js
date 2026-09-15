import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Reports from "./pages/admin/Reports";
import ApprovedReports from "./pages/admin/ApprovedReports";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import AdminSubmissions from "./pages/admin/AdminSubmissions";

import FacultyDashboard
from "./pages/faculty/FacultyDashboard";
import FacultyQuestionnaire
from "./pages/faculty/FacultyQuestionnaire";
import SubmissionStatus
from "./pages/faculty/SubmissionStatus";

import HodDashboard from "./pages/hod/HodDashboard";
import FacultyReview from "./pages/hod/FacultyReview";
import ApprovedReviews from "./pages/hod/ApprovedReviews";
import RejectedReviews from "./pages/hod/RejectedReviews";
import HodQuestionnaire from "./pages/hod/HodQuestionnaire";
import HodSubmissions from "./pages/hod/HodSubmissions";
import HodAnalytics from "./pages/hod/HodAnalytics";

import DeanDashboard from "./pages/dean/DeanDashboard";
import DeanFacultyReview from "./pages/dean/DeanFacultyReview";
import HodReview from "./pages/dean/HodReview";
import DeanQuestionnaire from "./pages/dean/DeanQuestionnaire";
import DeanSubmissions from "./pages/dean/DeanSubmissions";
import DeanAnalytics from "./pages/dean/DeanAnalytics";
import DeanFacultyView from "./pages/dean/DeanFacultyView";
import DeanHodView from "./pages/dean/DeanHodView";

import AdminDashboard
from "./pages/admin/AdminDashboard";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />
      {/* FACULTY ROUTES */}
      <Route
        path="/faculty/dashboard"
        element={
          <FacultyDashboard />
        }
      />

      <Route
        path="/faculty/questionnaire"
        element={
          <FacultyQuestionnaire />
        }
      />

      {/* EDIT MODE */}

      <Route
        path="/faculty/questionnaire/:id"
        element={
          <FacultyQuestionnaire />
        }
      />

      <Route
        path="/faculty/submissions"
        element={
          <SubmissionStatus />
        }
      />
      {/* HOD ROUTES */}
      <Route
        path="/hod/dashboard"
        element={
          <HodDashboard />
        }
      />

      <Route
  path="/hod/faculty-review"
  element={<FacultyReview />}
/>

<Route
  path="/hod/approved-reviews"
  element={<ApprovedReviews />}
/>

<Route
  path="/hod/rejected-reviews"
  element={<RejectedReviews />}
/>

<Route
  path="/hod/questionnaire"
  element={
    <HodQuestionnaire />
  }
/>

<Route
  path="/hod/submissions"
  element={<HodSubmissions />}
/>

<Route
  path="/hod/analytics"
  element={
    <HodAnalytics />
  }
/>
<Route
  path="/hod/questionnaire/:id"
  element={
    <HodQuestionnaire />
  }
/>
       {/* DEAN ROUTES */}
      <Route
  path="/dean/dashboard"
  element={<DeanDashboard />}
/>

<Route
  path="/dean/faculty-review"
  element={<DeanFacultyReview />}
/>

<Route
  path="/dean/hod-review"
  element={<HodReview />}
/>

<Route
  path="/dean/questionnaire"
  element={<DeanQuestionnaire />}
/>

<Route
  path="/dean/questionnaire/:id"
  element={<DeanQuestionnaire />}
/>

<Route
  path="/dean/submissions"
  element={<DeanSubmissions />}
/>

<Route
  path="/dean/analytics"
  element={<DeanAnalytics />}
/>
<Route
  path="/dean/faculty-view/:id"
  element={<DeanFacultyView />}
/>
<Route
  path="/dean/hod-view/:id"
  element={<DeanHodView />}
/>

     {/* ADMIN ROUTES */}

<Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>

<Route
  path="/admin/reports"
  element={<Reports />}
/>

<Route
  path="/admin/approved-reports"
  element={<ApprovedReports />}
/>

<Route
  path="/admin/users"
  element={<UserManagement />}
/>

<Route
  path="/admin/analytics"
  element={<Analytics />}
/>

<Route
  path="/admin/submissions"
  element={<AdminSubmissions />}
/>

    </Routes>

  );

}

export default App;