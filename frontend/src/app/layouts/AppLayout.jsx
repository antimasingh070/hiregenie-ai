import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Users,
  Bot,
  BarChart3,
  User,
  LogOut,
  Shield,
  Menu
} from "lucide-react";

function AppLayout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "candidate";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const recruiterLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Jobs", path: "/jobs", icon: Briefcase },
    { label: "Create Job", path: "/create-job", icon: PlusCircle },
    { label: "Applications", path: "/applications", icon: FileText },
    { label: "Candidates", path: "/candidates", icon: Users },
    { label: "AI Resume Score", path: "/ai-score", icon: Bot },
    { label: "Reports", path: "/reports", icon: BarChart3 },
    { label: "Profile", path: "/profile", icon: User }
  ];

  const candidateLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Browse Jobs", path: "/jobs", icon: Briefcase },
    { label: "My Applications", path: "/applications", icon: FileText },
    { label: "AI Interview", path: "/ai-interview", icon: Bot },
    { label: "Profile", path: "/profile", icon: User }
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Jobs Overview", path: "/admin/jobs", icon: Briefcase },
    { label: "AI Usage Logs", path: "/admin/ai-logs", icon: Bot },
    { label: "Audit Logs", path: "/admin/audit", icon: Shield }
  ];

  const links =
    role === "recruiter"
      ? recruiterLinks
      : role === "admin"
      ? adminLinks
      : candidateLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-slate-950 text-white flex-col fixed inset-y-0 left-0">
        <div className="h-20 px-6 flex items-center border-b border-white/10">
          <div>
            <h1 className="text-xl font-bold">HireGenie AI</h1>
            <p className="text-xs text-slate-400 capitalize">{role} workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
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

      {/* Main */}
      <div className="flex-1 lg:ml-72">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 border rounded-xl">
              <Menu size={20} />
            </button>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 capitalize">
                {role} Dashboard
              </h2>
              <p className="text-sm text-slate-500">
                Welcome back, manage your workflow from here.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-slate-500 capitalize">
              {role}
            </span>

            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {role[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;