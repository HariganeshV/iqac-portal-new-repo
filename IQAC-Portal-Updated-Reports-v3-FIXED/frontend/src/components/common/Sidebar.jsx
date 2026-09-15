import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({
  role,
  isOpen,
  setIsOpen
}) {

  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  const menuItems = {

    faculty: [
      {
        name: "Dashboard",
        path: "/faculty/dashboard"
      },
      {
        name: "Questionnaire",
        path: "/faculty/questionnaire"
      },
      {
        name: "My Submissions",
        path: "/faculty/submissions"
      }
    ],

  hod: [
  {
    name: "Dashboard",
    path: "/hod/dashboard"
  },
  {
    name: "Faculty Reviews",
    path: "/hod/faculty-review"
  },
  {
    name: "HOD Questionnaire",
    path: "/hod/questionnaire"
  },
  {
    name: "My HOD Submissions",
    path: "/hod/submissions"
  },
  {
  name: "Analytics",
  path: "/hod/analytics"
}
],

    dean: [
  {
    name: "Dashboard",
    path: "/dean/dashboard"
  },
  {
    name: "Faculty Review",
    path: "/dean/faculty-review"
  },
  {
    name: "HOD Review",
    path: "/dean/hod-review"
  },
  {
    name: "Dean Questionnaire",
    path: "/dean/questionnaire"
  },
  {
    name: "My Dean Submissions",
    path: "/dean/submissions"
  },
  {
    name: "Analytics",
    path: "/dean/analytics"
  }
],

    admin: [
  {
    name:"Dashboard",
    path:"/admin/dashboard"
  },
  {
    name:"Analytics",
    path:"/admin/analytics"
  },
  {
    name:"User Management",
    path:"/admin/users"
  },
  {
    name:"Submissions",
    path:"/admin/submissions"
  },
  {
    name:"Reports",
    path:"/admin/reports"
  },
  {
    name:"Approved Reports",
    path:"/admin/approved-reports"
  }
]
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={() =>
            setIsOpen(false)
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(249, 250, 251, 0.4)",
            zIndex: 998
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "260px",
          height: "100vh",
          background: "#083daf",
          color: "white",
          padding: "20px",
          transition: "0.3s ease",
          transform: isOpen
            ? "translateX(0)"
            : "translateX(-100%)",
          zIndex: 999
        }}
      >
        <h2
  style={{
    textAlign:"center",
    marginBottom:"25px"
  }}
>
  SRIHER IQAC
</h2>

        <hr />

        {
          menuItems[role]?.map(
            (item) => (
              <div
                key={item.path}
                style={{
                  margin:
                    "15px 0"
                }}
              >
                <Link
                  to={item.path}
                  onClick={() =>
                    setIsOpen(false)
                  }
                  style={{
                     color:"#e5e7eb",
                     textDecoration:"none",
                     display:"block",
                     padding:"12px",
                     borderRadius:"8px",
                     background: "#2685f9"
                    }}
                >
                  {item.name}
                </Link>
              </div>
            )
          )
        }

        <hr />

        <button
          onClick={
            handleLogout
          }
          style={{
            width: "100%",
            padding: "10px"
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;