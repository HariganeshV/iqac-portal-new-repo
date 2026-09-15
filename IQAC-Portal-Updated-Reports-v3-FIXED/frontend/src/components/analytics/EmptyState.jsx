import React from "react";

function EmptyState({

    message = "No Records Found"

}) {

    return (

        <tr>

            <td
                colSpan="7"
                style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "16px",
                    fontWeight: "600"
                }}
            >

                📭 {message}

            </td>

        </tr>

    );

}

export default EmptyState;