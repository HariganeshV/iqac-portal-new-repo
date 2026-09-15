import React from "react";

function SubmissionViewer({

    submission,

    questions,

    onClose

}) {

    if (!submission)
        return null;

    const getSectionAnswer = (sectionNo) => {

        return (

            submission.answers?.find(

                item =>

                    String(item.questionNo) ===

                    String(sectionNo)

            )?.answer || null

        );

    };

    const isFile = (value) => {

        return (

            typeof value === "string" &&

            value.startsWith("/uploads")

        );
    };

    const renderValue = (value) => {

        if (

            value === null ||

            value === undefined ||

            value === ""

        ) {

            return (

                <span
                    style={{
                        color: "#dc2626",
                        fontWeight: "600"
                    }}
                >

                    NIL

                </span>

            );

        }

        if (isFile(value)) {

            const fileName =
                value.split("/").pop();

            const extension =
                fileName
                    .split(".")
                    .pop()
                    .toLowerCase();

            const image =
                ["jpg", "jpeg", "png"]
                    .includes(extension);

            return (

                <div>

                    {

                        image &&

                        <img

                            src={`http://localhost:5000${value}`}

                            alt="Uploaded"

                            style={{

                                width: "180px",

                                marginBottom: "10px",

                                borderRadius: "8px"

                            }}

                        />

                    }

                    <br />

                    <a

                        href={`http://localhost:5000${value}`}

                        target="_blank"

                        rel="noreferrer"

                    >

                        View File

                    </a>

                </div>

            );

        }

        return value;

    };
        return (

        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >

            <div
                style={{
                    width: "90%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "25px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <h2>

                        Submission Details

                    </h2>

                    <button
    onClick={onClose}
    style={{
        position: "absolute",
        top: "20px",
        right: "60px",
        background: "#dc2626",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        zIndex: 9999,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    }}
>
    ✖ Close
</button>

                </div>

                <hr />

                <div
                    style={{
                        marginBottom: "30px",
                        lineHeight: "30px"
                    }}
                >

                    <b>Name :</b>

                    {" "}

                    {submission.submittedByName}

                    <br />

                    <b>Email :</b>

                    {" "}

                    {submission.submittedByEmail}

                    <br />

                    <b>School :</b>

                    {" "}

                    {submission.school}

                    <br />

                    <b>Department :</b>

                    {" "}

                    {submission.department}

                    <br />

                    <b>Quarter :</b>

                    {" "}

                    {submission.quarter}

                    <br />

                    <b>Status :</b>

                    {" "}

                    {submission.status}
                </div>

<div
    style={{
        display: "flex",
        gap: "20px",
        marginTop: "25px",
        marginBottom: "25px"
    }}
>

    <div
        style={{
            flex: 1,
            background: "#eff6ff",
            borderLeft: "6px solid #2563eb",
            padding: "18px",
            borderRadius: "10px",
            textAlign: "center"
        }}
    >
        <h4>Total Questions</h4>
        <h2>{submission.totalQuestions}</h2>
    </div>

    <div
        style={{
            flex: 1,
            background: "#f0fdf4",
            borderLeft: "6px solid #16a34a",
            padding: "18px",
            borderRadius: "10px",
            textAlign: "center"
        }}
    >
        <h4>Answered</h4>
        <h2>{submission.answeredCount}</h2>
    </div>

    <div
        style={{
            flex: 1,
            background: "#fef2f2",
            borderLeft: "6px solid #dc2626",
            padding: "18px",
            borderRadius: "10px",
            textAlign: "center"
        }}
    >
        <h4>Unanswered</h4>
        <h2>{submission.unansweredCount}</h2>
    </div>

</div>

                <hr />

                {

                    questions.map(section => (

                        <div
                            key={section.sectionNo}
                            style={{
                                marginTop: "35px"
                            }}
                        >

                            <div
                                style={{
                                    background: "#2563eb",
                                    color: "#fff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    fontWeight: "bold"
                                }}
                            >

                                Section {section.sectionNo}

                                {" - "}

                                {section.sectionTitle}

                            </div>
            {
    section.type === "table" && (() => {

        const sectionAnswer =
            getSectionAnswer(
                section.sectionNo
            );

        const rows =
            Array.isArray(sectionAnswer)
                ? sectionAnswer
                : [{}];

        return rows.map(
            (row, rowIndex) => (

                <div
                    key={rowIndex}
                    style={{
                        marginTop: "20px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        padding: "20px",
                        background: "#fafafa"
                    }}
                >

                    <div
                        style={{
                            background: "#1d4ed8",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            display: "inline-block",
                            marginBottom: "20px",
                            fontWeight: "bold"
                        }}
                    >

                        RECORD {rowIndex + 1}

                    </div>

                    {

                        section.tableColumns.map(
                            (column) => (

                                <div
                                    key={column.key}
                                    style={{
                                        marginBottom: "18px"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontWeight: "600",
                                            marginBottom: "5px"
                                        }}
                                    >

                                        {column.label}

                                    </div>

                                    <div>

                                        {

                                            renderValue(
                                                row[column.key]
                                            )

                                        }

                                    </div>

                                </div>

                            )
                        )

                    }

                </div>

            )

        );

    })()
}
{
    section.type === "singleRecord" && (() => {

        const answer =
            getSectionAnswer(
                section.sectionNo
            ) || {};

        return (

            <div
                style={{
                    marginTop: "20px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fafafa"
                }}
            >

                {

                    section.fields.map(
                        (field) => (

                            <div
                                key={field.key}
                                style={{
                                    marginBottom: "18px"
                                }}
                            >

                                <div
                                    style={{
                                        fontWeight: "600",
                                        marginBottom: "5px"
                                    }}
                                >

                                    {field.label}

                                </div>

                                <div>

                                    {

                                        renderValue(
                                            answer[field.key]
                                        )

                                    }

                                </div>

                            </div>

                        )
                    )

                }

            </div>

        );

    })()
}
                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default SubmissionViewer;