import {
  useEffect,
  useState
} from "react";

import AdminLayout
from "../../layouts/AdminLayout";

import AnalyticsBarChart
from "../../components/charts/BarChart";

import QuarterSelector
from "../../components/analytics/QuarterSelector";

import SummaryCards
from "../../components/analytics/SummaryCards";

import SubmissionTabs
from "../../components/analytics/SubmissionTabs";

import SubmissionTable
from "../../components/analytics/SubmissionTable";

import NotSubmittedTable
from "../../components/analytics/NotSubmittedTable";

import schoolsDepartments from "../../data/schoolsDepartments";

import {

  getAdminAnalytics,

  downloadSubmissionPDF

}

from "../../api/adminApi";

function Analytics() {

  const [

    analytics,

    setAnalytics

  ] = useState(null);

  const [

    loading,

    setLoading

  ] = useState(true);

  const [

    selectedRole,

    setSelectedRole

  ] = useState("faculty");

  const [

    selectedSchool,

    setSelectedSchool

  ] = useState("All");

  const [

    selectedDepartment,

    setSelectedDepartment

  ] = useState("All");

  const [

    selectedQuarter,

    setSelectedQuarter

  ] = useState("Q1");

  const [

    selectedTab,

    setSelectedTab

  ] = useState("submitted");

  useEffect(() => {

  loadAnalytics();

}, [

  selectedRole,

  selectedSchool,

  selectedDepartment,

  selectedQuarter

]);

  const loadAnalytics =
    async () => {

      try {

        setLoading(true);

       const res =
  await getAdminAnalytics({

    role: selectedRole,

    school: selectedSchool,

    department: selectedDepartment,

    quarter: selectedQuarter

  });

        setAnalytics(
          res.data
        );

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <AdminLayout>

        <div
          style={{
            padding:"30px"
          }}
        >

          <h2>

            Loading Analytics...

          </h2>

        </div>

      </AdminLayout>

    );

  }
    const quarter =
      analytics?.analytics?.[selectedQuarter] || {
        submitted: [], pending: [], approved: [], rejected: [], notSubmitted: [],
        submittedCount: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0, notSubmittedCount: 0
      };

  const summary = {

  totalUsers:
    (quarter?.submittedCount || 0) +
    (quarter?.notSubmittedCount || 0),

  totalSubmitted:
    quarter?.submittedCount || 0,

  totalPending:
    quarter?.pendingCount || 0,

  totalApproved:
    quarter?.approvedCount || 0,

  totalRejected:
    quarter?.rejectedCount || 0,

  totalNotSubmitted:
    quarter?.notSubmittedCount || 0

};

  const getCurrentData = () => {

    switch (selectedTab) {

      case "submitted":

        return quarter?.submitted || [];

      case "pending":

        return quarter?.pending || [];

      case "approved":

        return quarter?.approved || [];

      case "rejected":

        return quarter?.rejected || [];

      default:

        return [];

    }

  };

  const handleDownload =
    async (submission) => {

      try {

        const res =
          await downloadSubmissionPDF(
            submission._id
          );

        const url =
          window.URL.createObjectURL(

            new Blob([res.data])

          );

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          `${submission.submittedBy?.name || "Submission"}.pdf`;

        link.click();

      }

      catch (error) {

        console.log(error);

      }

    };

  return (

    <AdminLayout>

      <div
        style={{
          padding:"30px",
          background:"#f3f4f6",
          minHeight:"100vh"
        }}
      >

        <h1
          style={{
            marginBottom:"20px"
          }}
        >

          📊 Admin Analytics

        </h1>

        <div
          style={{
            display:"grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap:"15px",
            marginBottom:"30px"
          }}
        >

          <select
            value={selectedRole}
            onChange={(e)=>
              setSelectedRole(
                e.target.value
              )
            }
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
  value={selectedSchool}
  onChange={(e) => {

    setSelectedSchool(e.target.value);

    setSelectedDepartment("All");

  }}
>

  <option value="All">
    All Schools
  </option>

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
  value={selectedDepartment}
  onChange={(e)=>
    setSelectedDepartment(
      e.target.value
    )
  }
>

  <option value="All">
    All Departments
  </option>

  {

    selectedSchool !== "All" &&

    schoolsDepartments[selectedSchool]?.map((department)=>(

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

        <QuarterSelector

          selectedQuarter={
            selectedQuarter
          }

          setSelectedQuarter={
            setSelectedQuarter
          }

        />

        <SummaryCards

          summary={summary}

        />
                {/* ========================= */}
        {/* Analytics Bar Chart */}
        {/* ========================= */}

        <AnalyticsBarChart

          data={
            analytics?.chartData || []
          }

        />

        {/* ========================= */}
        {/* Submission Tabs */}
        {/* ========================= */}

        <SubmissionTabs

          activeTab={
            selectedTab
          }

          setActiveTab={
            setSelectedTab
          }

          counts={{

            submitted:
              quarter?.submittedCount || 0,

            pending:
              quarter?.pendingCount || 0,

            approved:
              quarter?.approvedCount || 0,

            rejected:
              quarter?.rejectedCount || 0,

            notSubmitted:
              quarter?.notSubmittedCount || 0

          }}

        />

        {/* ========================= */}
        {/* Tables */}
        {/* ========================= */}

        {

          selectedTab ===
          "notSubmitted"

          ?

          (

            <NotSubmittedTable

              facultyList={

                quarter?.notSubmitted || []

              }

            />

          )

          :

          (

            <SubmissionTable

              submissions={

                getCurrentData()

              }

              showRemarks={

                selectedTab ===
                "rejected"

              }

              onDownload={

                handleDownload

              }

            />

          )

        }
              </div>

    </AdminLayout>

  );

}

export default Analytics;