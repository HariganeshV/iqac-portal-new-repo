import React from "react";

function ActionButtons({

    submission,

    onView,

    onDownload

}) {

    return (

        <div
            style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center"
            }}
        >

            <button
                onClick={() =>
                    onDownload(submission)
                }
                style={{
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                }}
            >
                📄 PDF
            </button>

        </div>

    );

}

export default ActionButtons;