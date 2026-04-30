import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const recruiterMenu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Jobs", path: "/jobs" },
    { name: "Create Job", path: "/create-job" },
    { name: "Applications", path: "/applications" }
  ];

  const candidateMenu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Browse Jobs", path: "/jobs" },
    { name: "My Applications", path: "/applications" }
  ];

  const menu = role === "recruiter" ? recruiterMenu : candidateMenu;

  return (
    <div className="w-64 h-screen bg-[#0f172a] text-white fixed left-0 top-0 p-5">

      <h1 className="text-xl font-bold mb-8">
        HireGenie AI
      </h1>

      <div className="space-y-2">

        {menu.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}

      </div>

    </div>
  );
}

export default Sidebar;