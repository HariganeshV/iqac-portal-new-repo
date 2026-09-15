import React, {
    useMemo,
    useState
} from "react";

import {
    approveSubmission,
    rejectSubmission,
    downloadFacultyPDF
} from "../../api/hodApi";

function HodQuarterTable({

    analytics,
    selectedQuarter,
    refreshAnalytics

}) {

    const [activeTab, setActiveTab] =
        useState("submitted");

    const [remarks, setRemarks] =
        useState({});

    const [selectedSubmission,
        setSelectedSubmission] =
        useState(null);

    const quarterData =
        analytics?.[selectedQuarter] || {};

    const submittedFaculty =
        quarterData.submittedFaculty || [];

    const pendingFaculty =
        quarterData.pendingFaculty || [];

    const approvedFaculty =
        quarterData.approvedFaculty || [];

    const rejectedFaculty =
        quarterData.rejectedFaculty || [];

    const notSubmittedFaculty =
        quarterData.notSubmittedFaculty || [];

    const tableData =
        useMemo(() => {

            switch (activeTab) {

                case "submitted":
                    return submittedFaculty;

                case "pending":
                    return pendingFaculty;

                case "approved":
                    return approvedFaculty;

                case "rejected":
                    return rejectedFaculty;

                case "notSubmitted":
                    return notSubmittedFaculty;

                default:
                    return [];

            }

        }, [

            activeTab,

            submittedFaculty,

            pendingFaculty,

            approvedFaculty,

            rejectedFaculty,

            notSubmittedFaculty

        ]);

    const handleDownload =
        async (
            id,
            name,
            quarter
        ) => {

            try {

                const response =
                    await downloadFacultyPDF(id);

                const blob =
                    new Blob(
                        [response.data],
                        {
                            type:
                                "application/pdf"
                        }
                    );

                const url =
                    window.URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    `${name}-${quarter}.pdf`;

                document.body.appendChild(link);

                link.click();

                link.remove();

            }

            catch (err) {

                console.log(err);

                alert("PDF Download Failed");

            }

        };

    return (

        <div
            style={{
                background: "#fff",
                marginTop: "35px",
                borderRadius: "15px",
                padding: "25px",
                boxShadow:
                    "0 4px 12px rgba(0,0,0,.08)"
            }}
        >

            <h2
                style={{
                    marginBottom: "20px"
                }}
            >
                {selectedQuarter} Faculty Status
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "25px"
                }}
            >

                <button
                    onClick={() =>
                        setActiveTab("submitted")
                    }
                    style={{
                        ...tabStyle,
                        background:
                            activeTab === "submitted"
                                ? "#2563eb"
                                : "#e5e7eb",
                        color:
                            activeTab === "submitted"
                                ? "#fff"
                                : "#111827"
                    }}
                >
                    Submitted
                    (
                    {submittedFaculty.length}
                    )
                </button>

                <button
                    onClick={() =>
                        setActiveTab("pending")
                    }
                    style={{
                        ...tabStyle,
                        background:
                            activeTab === "pending"
                                ? "#f59e0b"
                                : "#e5e7eb",
                        color:
                            activeTab === "pending"
                                ? "#fff"
                                : "#111827"
                    }}
                >
                    Pending
                    (
                    {pendingFaculty.length}
                    )
                </button>

                <button
                    onClick={() =>
                        setActiveTab("approved")
                    }
                    style={{
                        ...tabStyle,
                        background:
                            activeTab === "approved"
                                ? "#16a34a"
                                : "#e5e7eb",
                        color:
                            activeTab === "approved"
                                ? "#fff"
                                : "#111827"
                    }}
                >
                    Approved
                    (
                    {approvedFaculty.length}
                    )
                </button>

                <button
                    onClick={() =>
                        setActiveTab("rejected")
                    }
                    style={{
                        ...tabStyle,
                        background:
                            activeTab === "rejected"
                                ? "#dc2626"
                                : "#e5e7eb",
                        color:
                            activeTab === "rejected"
                                ? "#fff"
                                : "#111827"
                    }}
                >
                    Rejected
                    (
                    {rejectedFaculty.length}
                    )
                </button>

                <button
                    onClick={() =>
                        setActiveTab("notSubmitted")
                    }
                    style={{
                        ...tabStyle,
                        background:
                            activeTab === "notSubmitted"
                                ? "#6b7280"
                                : "#e5e7eb",
                        color:
                            activeTab === "notSubmitted"
                                ? "#fff"
                                : "#111827"
                    }}
                >
                    Not Submitted
                    (
                    {notSubmittedFaculty.length}
                    )
                </button>

            </div>

            {/* Part 2 la Dynamic Table varum */}

        </div>

    );

}

const tabStyle = {

    border: "none",

    padding: "10px 18px",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "15px"

};

export default HodQuarterTable;