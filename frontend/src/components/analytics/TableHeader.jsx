import React from "react";

function TableHeader({ showRemarks = false }) {

  return (

    <thead>

      <tr
        style={{
          background: "#2563eb",
          color: "#fff"
        }}
      >

        <th style={{ padding: "12px", textAlign: "left" }}>
          Name
        </th>

        <th style={{ padding: "12px", textAlign: "left" }}>
          Email
        </th>

        <th style={{ padding: "12px", textAlign: "left" }}>
          Department
        </th>

        <th style={{ padding: "12px", textAlign: "center" }}>
          Answered
        </th>

        <th style={{ padding: "12px", textAlign: "center" }}>
          Submitted Date
        </th>

        <th style={{ padding: "12px", textAlign: "center" }}>
          Status
        </th>

        {
          showRemarks && (

            <th
              style={{
                padding: "12px",
                textAlign: "center"
              }}
            >
              Remarks
            </th>

          )
        }

        <th
          style={{
            padding: "12px",
            textAlign: "center"
          }}
        >
          Actions
        </th>

      </tr>

    </thead>

  );

}

export default TableHeader;