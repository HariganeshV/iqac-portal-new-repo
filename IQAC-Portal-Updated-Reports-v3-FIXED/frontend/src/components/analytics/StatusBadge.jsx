import React from "react";

function StatusBadge({ status }) {

    const getStyle = () => {

        switch (status) {

            case "Pending HOD Approval":
                return {
                    background: "#fef3c7",
                    color: "#b45309"
                };

            case "Approved by HOD":
                return {
                    background: "#dcfce7",
                    color: "#15803d"
                };

            case "Rejected by HOD":
                return {
                    background: "#fee2e2",
                    color: "#dc2626"
                };

            case "Pending Dean Review":
                return {
                    background: "#dbeafe",
                    color: "#2563eb"
                };

            case "Approved by Dean":
                return {
                    background: "#dcfce7",
                    color: "#15803d"
                };

            case "Rejected by Dean":
                return {
                    background: "#fee2e2",
                    color: "#dc2626"
                };

            case "Draft":
                return {
                    background: "#f3f4f6",
                    color: "#6b7280"
                };

            default:
                return {
                    background: "#e5e7eb",
                    color: "#374151"
                };

        }

    };

    const style = getStyle();

    return (

        <span
            style={{
                background: style.background,
                color: style.color,
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "13px",
                display: "inline-block"
            }}
        >
            {status}
        </span>

    );

}

export default StatusBadge;