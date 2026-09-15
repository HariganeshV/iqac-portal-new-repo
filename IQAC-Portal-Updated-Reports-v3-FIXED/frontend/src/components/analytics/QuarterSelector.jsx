import React from "react";

function QuarterSelector({

    selectedQuarter,

    setSelectedQuarter

}) {

    const quarters = [

        "Q1",

        "Q2",

        "Q3",

        "Q4"

    ];

    return (

        <div
            style={{
                display: "flex",
                gap: "12px",
                marginBottom: "30px",
                flexWrap: "wrap"
            }}
        >

            {

                quarters.map(

                    (quarter) => (

                        <button

                            key={quarter}

                            onClick={() =>
                                setSelectedQuarter(
                                    quarter
                                )
                            }

                            style={{

                                padding:
                                    "12px 30px",

                                border: "none",

                                borderRadius:
                                    "10px",

                                cursor:
                                    "pointer",

                                fontWeight:
                                    "bold",

                                fontSize:
                                    "15px",

                                transition:
                                    ".25s",

                                background:

                                    selectedQuarter ===
                                    quarter

                                        ? "#2563eb"

                                        : "#e5e7eb",

                                color:

                                    selectedQuarter ===
                                    quarter

                                        ? "#fff"

                                        : "#111827"

                            }}

                        >

                            {quarter}

                        </button>

                    )

                )

            }

        </div>

    );

}

export default QuarterSelector;