import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Bot,
  BarChart3,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "candidate";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const recruiterMenu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Create Job", path: "/create-job", icon: PlusCircle },
    { name: "Applications", path: "/applications", icon: FileText },
    { name: "AI Screening", path: "/applications?minScore=85", icon: Bot },
    { name: "Reports", path: "/applications", icon: BarChart3 },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const candidateMenu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Browse Jobs", path: "/jobs", icon: Briefcase },
    { name: "My Applications", path: "/applications", icon: FileText },
    { name: "AI Interview", path: "/applications", icon: Bot },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const adminMenu = [
    {name: "Dashboard", path: "/admin", icon: LayoutDashboard},
    {name: "Jobs Overview", path: "/admin/jobs", icon: Briefcase},
    {name: "Applications", path: "/admin/applications", icon: FileText},
    {name: "AI Interview Logs", path: "/admin/ai-interview", icon: Bot},
    {name: "Profile", path: "/profile", icon: User},
  ];

  const menu =
      role === "recruiter"
          ? recruiterMenu
          : role === "admin"
              ? adminMenu
              : candidateMenu;

  return (
    <aside className="hidden lg:flex w-72 bg-slate-950 text-white flex-col fixed inset-y-0 left-0">
      <div className="h-20 px-6 flex items-center border-b border-white/10">
        <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center font-bold mr-3">
          HG
        </div>

        <div>
          <h1 className="text-lg font-bold">HireGenie AI</h1>
          <p className="text-xs text-slate-400 capitalize">{role} workspace</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;