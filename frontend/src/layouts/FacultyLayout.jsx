import { useState } from "react";
import Sidebar from "../components/common/Sidebar";

function FacultyLayout({
  children
}) {

  const [isOpen, setIsOpen] =
    useState(false);

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f3f4f6"
      }}
    >

      <Sidebar
        role="faculty"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div
        style={{
          flex: 1,
          marginLeft:
            isOpen ? "260px" : "0",
          transition:
            "0.3s ease"
        }}
      >

        {/* Top Navbar */}

        <div
          style={{
            height: "70px",
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            padding: "0 25px",
            color: "white",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)"
          }}
        >

          <button
            onClick={() =>
              setIsOpen(!isOpen)
            }
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              marginRight: "15px"
            }}
          >
            ☰
          </button>

          <h2
            style={{
              margin: 0
            }}
          >
            SRIHER IQAC Portal
          </h2>

        </div>

        <div
          style={{
            padding: "30px"
          }}
        >
          {children}
        </div>

      </div>

    </div>

  );
}

export default FacultyLayout;