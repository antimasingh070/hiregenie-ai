import { Link } from "react-router-dom";
import { Home, Briefcase, User, FileText } from "lucide-react";

function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-8">HireGenie</h1>

      <nav className="space-y-4">

        <Link to="/dashboard" className="flex items-center gap-2 hover:text-indigo-400">
          <Home size={18}/> Dashboard
        </Link>

        {role === "recruiter" && (
          <>
            <Link to="/create-job" className="flex gap-2 hover:text-indigo-400">
              <Briefcase size={18}/> Create Job
            </Link>
            <Link to="/applications" className="flex gap-2 hover:text-indigo-400">
              <FileText size={18}/> Applications
            </Link>
          </>
        )}

        {role === "candidate" && (
          <>
            <Link to="/jobs" className="flex gap-2 hover:text-indigo-400">
              <Briefcase size={18}/> Browse Jobs
            </Link>
            <Link to="/my-applications" className="flex gap-2 hover:text-indigo-400">
              <FileText size={18}/> My Applications
            </Link>
          </>
        )}

        <Link to="/profile" className="flex gap-2 hover:text-indigo-400">
          <User size={18}/> Profile
        </Link>

      </nav>
    </div>
  );
}

export default Sidebar;