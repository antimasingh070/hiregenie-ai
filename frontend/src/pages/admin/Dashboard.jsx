import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import { Users, Briefcase, FileText, Shield, UserCheck, UserRound } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return <div className="text-gray-500">Loading admin dashboard...</div>;
  }

  const stats = [
    {
      title: "Total Users",
      value: data.total_users,
      icon: Users,
      path: "/admin/users",
      subtitle: "View all platform users",
    },
    {
      title: "Recruiters",
      value: data.recruiters,
      icon: UserCheck,
      path: "/admin/users?role=recruiter",
      subtitle: "View recruiter accounts",
    },
    {
      title: "Candidates",
      value: data.candidates,
      icon: UserRound,
      path: "/admin/users?role=candidate",
      subtitle: "View candidate accounts",
    },
    {
      title: "Admins",
      value: data.admins,
      icon: Shield,
      path: "/admin/users?role=admin",
      subtitle: "View admin accounts",
    },
    {
      title: "Jobs",
      value: data.jobs,
      icon: Briefcase,
      path: "/admin/jobs",
      subtitle: "View all job postings",
    },
    {
      title: "Applications",
      value: data.applications,
      icon: FileText,
      path: "/admin/applications",
      subtitle: "View all applications",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor users, recruiters, candidates, jobs, applications and system health."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="bg-white border p-5 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={20} />
                </div>

                <span className="text-xs text-indigo-600 font-medium">
                  View
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-4">{item.title}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {item.value}
              </h2>
              <p className="text-xs text-gray-400 mt-2">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white border p-6">
        <h2 className="font-semibold text-gray-800">Admin Quick Actions</h2>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="p-4 bg-slate-50 hover:bg-slate-100 text-left"
          >
            <p className="font-medium text-gray-800">Manage Users</p>
            <p className="text-xs text-gray-500 mt-1">
              View candidates, recruiters and admins.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/jobs")}
            className="p-4 bg-slate-50 hover:bg-slate-100 text-left"
          >
            <p className="font-medium text-gray-800">Review Jobs</p>
            <p className="text-xs text-gray-500 mt-1">
              See jobs with recruiter and application count.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/applications")}
            className="p-4 bg-slate-50 hover:bg-slate-100 text-left"
          >
            <p className="font-medium text-gray-800">Track Applications</p>
            <p className="text-xs text-gray-500 mt-1">
              View candidate-wise applications.
            </p>
          </button>
        </div>
      </div>

      <div className="bg-white border p-6">
        <h2 className="font-semibold text-gray-800">System Health</h2>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-green-50 text-green-700 p-4">API: Active</div>
          <div className="bg-green-50 text-green-700 p-4">Database: Connected</div>
          <div className="bg-indigo-50 text-indigo-700 p-4">RBAC: Enabled</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;