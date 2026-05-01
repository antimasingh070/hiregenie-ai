import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import { Briefcase, CalendarCheck, Star, FileText } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/candidate/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return <div className="text-gray-500">Loading candidate dashboard...</div>;
  }

  const stats = [
    {
      title: "Applications",
      value: data.applications,
      icon: FileText,
      path: "/applications",
    },
    {
      title: "Interviews",
      value: data.interviews,
      icon: CalendarCheck,
      path: "/applications",
    },
    {
      title: "Shortlisted",
      value: data.shortlisted,
      icon: Star,
      path: "/applications",
    },
    {
      title: "ATS Score",
      value: `${data.ats_score}%`,
      icon: Briefcase,
      path: "/jobs",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Dashboard"
        subtitle="Track your applications, interviews and recommended opportunities."
        action={
          <button
            onClick={() => navigate("/jobs")}
            className="bg-white text-black px-4 py-2 font-semibold hover:bg-slate-100"
          >
            Browse Jobs
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="bg-white border p-5 text-left hover:shadow-md transition"
            >
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon size={18} />
              </div>

              <p className="text-sm text-gray-500 mt-4">{item.title}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {item.value}
              </h2>
            </button>
          );
        })}
      </div>

      <div className="bg-white border p-6">
        <h2 className="font-semibold text-gray-800">Next Steps</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <button
            onClick={() => navigate("/jobs")}
            className="bg-slate-50 p-4 text-left hover:bg-slate-100"
          >
            <p className="font-medium">Browse Jobs</p>
            <p className="text-xs text-gray-500 mt-1">
              Find roles matching your skills.
            </p>
          </button>

          <button
            onClick={() => navigate("/applications")}
            className="bg-slate-50 p-4 text-left hover:bg-slate-100"
          >
            <p className="font-medium">Track Applications</p>
            <p className="text-xs text-gray-500 mt-1">
              Check your latest application status.
            </p>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-slate-50 p-4 text-left hover:bg-slate-100"
          >
            <p className="font-medium">Improve Profile</p>
            <p className="text-xs text-gray-500 mt-1">
              Keep profile details updated.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;