import React from "react";

function SubmissionTabs({

    activeTab,

    setActiveTab,

    counts

}) {

    const tabs = [

        {

            key:
                "submitted",

            label:
                "Submitted",

            color:
                "#2563eb"

        },

        {

            key:
                "pending",

            label:
                "Pending",

            color:
                "#f59e0b"

        },

        {

            key:
                "approved",

            label:
                "Approved",

            color:
                "#16a34a"

        },

        {

            key:
                "rejected",

            label:
                "Rejected",

            color:
                "#dc2626"

        },

        {

            key:
                "notSubmitted",

            label:
                "Not Submitted",

            color:
                "#6b7280"

        }

    ];

    return (

        <div
            style={{

                display: "flex",

                gap: "12px",

                flexWrap: "wrap",

                marginBottom: "25px"

            }}
        >

            {

                tabs.map(

                    (tab) => (

                        <button

                            key={tab.key}

                            onClick={() =>
                                setActiveTab(
                                    tab.key
                                )
                            }

                            style={{

                                border: "none",

                                cursor:
                                    "pointer",

                                padding:
                                    "10px 20px",

                                borderRadius:
                                    "8px",

                                fontWeight:
                                    "600",

                                transition:
                                    ".25s",

                                background:

                                    activeTab ===
                                    tab.key

                                        ? tab.color

                                        : "#e5e7eb",

                                color:

                                    activeTab ===
                                    tab.key

                                        ? "#fff"

                                        : "#111827"

                            }}

                        >

                            {tab.label}

                            {" ("}

                            {

                                counts?.[
                                    tab.key
                                ] || 0

                            }

                            {")"}

                        </button>

                    )

                )

            }

        </div>

    );

}

export default SubmissionTabs;