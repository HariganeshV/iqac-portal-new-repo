import React from "react";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import EmptyState from "./EmptyState";

function SubmissionTable({

    submissions = [],

    showRemarks = false,

    onDownload

}) {

    return (

        <div
            style={{
                background: "#ffffff",
                borderRadius: "15px",
                padding: "20px",
                boxShadow:
                    "0 4px 12px rgba(0,0,0,.08)"
            }}
        >

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >

                <TableHeader
                    showRemarks={showRemarks}
                />

                <tbody>

                    {

                        submissions.length === 0

                            ? (

                                <EmptyState
                                    message="No Records Found"
                                />

                            )

                            : (

                                submissions.map(

                                    (submission) => (

                                        <TableRow

                                            key={
                                                submission._id
                                            }

                                            submission={
                                                submission
                                            }

                                            showRemarks={
                                                showRemarks
                                            }


                                            onDownload={
                                                onDownload
                                            }

                                        />

                                    )

                                )

                            )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default SubmissionTable;