import React from "react";

import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

function TableRow({

    submission,

    showRemarks = false,

    onDownload

}) {

    return (

        <tr>

            {/* Faculty */}

            <td style={tdStyle}>

                {submission.submittedByName}

            </td>

            {/* Email */}

            <td style={tdStyle}>

                {submission.submittedByEmail}

            </td>
              
              {/* Department */}

<td style={tdStyle}>

    {submission.department || "-"}

</td>

            {/* Answered */}

            <td
    style={{
        ...tdStyle,
        textAlign: "center"
    }}
>

    {submission.answeredCount || 0}

    {" / "}

    {submission.totalQuestions ?? "-"}

</td>

            {/* Submitted Date */}

            <td
                style={{
                    ...tdStyle,
                    textAlign: "center"
                }}
            >

                {

                    submission.createdAt

                        ? new Date(
    submission.createdAt
).toLocaleString("en-IN")

                        : "-"

                }

            </td>

            {/* Status */}

            <td
                style={{
                    ...tdStyle,
                    textAlign: "center"
                }}
            >

                <StatusBadge

                    status={submission.status}

                />

            </td>

            {/* Remarks */}

            {
    showRemarks && (

        <td style={tdStyle}>

            {

                submission.remarks ||

                "-"

            }

        </td>

    )

}

            {/* Actions */}

            <td
                style={{
                    ...tdStyle,
                    textAlign: "center"
                }}
            >

                <ActionButtons

    submission={submission}

    onDownload={onDownload}

/>

            </td>

        </tr>

    );

}

const tdStyle = {

    padding: "12px",

    borderBottom:

        "1px solid #e5e7eb"

};

export default TableRow;