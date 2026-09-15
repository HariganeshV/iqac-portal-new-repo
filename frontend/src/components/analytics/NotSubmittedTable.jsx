import React from "react";

function NotSubmittedTable({

    facultyList = []

}) {

    return (

        <table
            style={{
                width: "100%",
                borderCollapse: "collapse"
            }}
        >

            <thead>

                <tr
                    style={{
                        background: "#2563eb",
                        color: "#fff"
                    }}
                >

                    <th style={thStyle}>
                        Faculty
                    </th>

                    <th style={thStyle}>
                        Email
                    </th>

                </tr>

            </thead>

            <tbody>

                {

                    facultyList.length === 0 ?

                        <tr>

                            <td
                                colSpan="2"
                                style={emptyStyle}
                            >

                                No Faculty Found

                            </td>

                        </tr>

                        :

                        facultyList.map(

                            (faculty) => (

                                <tr
                                    key={faculty._id}
                                >

                                    <td style={tdStyle}>
                                        {faculty.name}
                                    </td>

                                    <td style={tdStyle}>
                                        {faculty.email}
                                    </td>

                                </tr>

                            )

                        )

                }

            </tbody>

        </table>

    );

}

const thStyle = {

    padding: "12px",

    textAlign: "left"

};

const tdStyle = {

    padding: "12px",

    borderBottom:
        "1px solid #e5e7eb"

};

const emptyStyle = {

    padding: "20px",

    textAlign: "center"

};

export default NotSubmittedTable;