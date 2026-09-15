import React, {
    useEffect,
    useState
} from "react";

import HodLayout from "../../layouts/HodLayout";

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

import {

    getHodAnalytics,

    downloadFacultyPDF

} from "../../api/hodApi";

function HodAnalytics() {

    const [

        analytics,

        setAnalytics

    ] = useState(null);

    const [

        loading,

        setLoading

    ] = useState(true);

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

    }, []);

    const loadAnalytics = async () => {

        try {

            const res =
                await getHodAnalytics();

            setAnalytics(
                res.data
            );

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <HodLayout>

                <div
                    style={{
                        padding: "30px"
                    }}
                >

                    <h2>

                        Loading Analytics...

                    </h2>

                </div>

            </HodLayout>

        );

    }

    const quarter =

    analytics?.analytics?.[
        selectedQuarter
    ];

    const summary = {

        totalFaculty:

            analytics.summary.totalFaculty,

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

        async (

            submission

        ) => {

            try {

                const res =

                    await downloadFacultyPDF(

                        submission._id

                    );

                const url =

                    window.URL.createObjectURL(

                        new Blob([

                            res.data

                        ])

                    );

                const link =

                    document.createElement("a");

                link.href = url;

                link.download =

                    `${submission.submittedByName}.pdf`;

                link.click();

            }

            catch (err) {

                console.log(err);

            }

        };
            return (

        <HodLayout>

            <div
                style={{
                    padding: "30px",
                    background: "#f3f4f6",
                    minHeight: "100vh"
                }}
            >

                <h1
                    style={{
                        marginBottom: "15px"
                    }}
                >
                    📊 HOD Analytics
                </h1>

                <hr
                    style={{
                        marginBottom: "25px"
                    }}
                />

                {/* ========================= */}
                {/* Faculty Overview */}
                {/* ========================= */}

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        marginBottom: "30px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,.08)"
                    }}
                >

                    <h2>

                        Faculty Overview

                    </h2>

                    <p>

                        <strong>

                            Total Faculty :

                        </strong>

                        {" "}

                        {

                            analytics.summary.totalFaculty

                        }

                    </p>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "20px"
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    background: "#2563eb",
                                    color: "#fff"
                                }}
                            >

                                <th
                                    style={{
                                        padding: "12px"
                                    }}
                                >
                                    Faculty Name
                                </th>

                                <th
                                    style={{
                                        padding: "12px"
                                    }}
                                >
                                    Email
                                </th>

                                <th
                                    style={{
                                        padding: "12px"
                                    }}
                                >
                                    Department
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                analytics.facultyList.map(

                                    (

                                        faculty

                                    ) => (

                                        <tr
                                            key={
                                                faculty._id
                                            }
                                        >

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    borderBottom:
                                                        "1px solid #ddd"
                                                }}
                                            >
                                                {

                                                    faculty.name

                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    borderBottom:
                                                        "1px solid #ddd"
                                                }}
                                            >
                                                {

                                                    faculty.email

                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    borderBottom:
                                                        "1px solid #ddd"
                                                }}
                                            >
                                                {
    faculty.department ||

    analytics.department ||

    "-"
}
                                            </td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

                </div>

                {/* ========================= */}
                {/* Bar Chart */}
                {/* ========================= */}

                <AnalyticsBarChart

                    data={analytics.chartData}

                />

                {/* ========================= */}
                {/* Quarter Selector */}
                {/* ========================= */}

                <QuarterSelector

                    selectedQuarter={
                        selectedQuarter
                    }

                    setSelectedQuarter={
                        setSelectedQuarter
                    }

                />

                {/* ========================= */}
                {/* Summary Cards */}
                {/* ========================= */}

                <SummaryCards

                    summary={summary}

                />

                {/* ========================= */}
                {/* Tabs */}
                {/* ========================= */}

                <SubmissionTabs

    activeTab={selectedTab}

    setActiveTab={setSelectedTab}

    counts={{

    submitted: quarter?.submittedCount || 0,

    pending: quarter?.pendingCount || 0,

    approved: quarter?.approvedCount || 0,

    rejected: quarter?.rejectedCount || 0,

    notSubmitted: quarter?.notSubmittedCount || 0

}}

/>
                                {/* ========================= */}
                {/* Tables */}
                {/* ========================= */}

                {

                    selectedTab === "notSubmitted"

                        ? (

                            <NotSubmittedTable

    facultyList={

        quarter?.notSubmitted || []

    }

/>

                        )

                        : (

                            <SubmissionTable

    submissions={

        getCurrentData()

    }

    showRemarks={

        selectedTab === "rejected"

    }

    onDownload={

        handleDownload

    }

/>

                        )

                }

               
            </div>

        </HodLayout>

    );

}

export default HodAnalytics;