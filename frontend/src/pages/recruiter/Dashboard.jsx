import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Users,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Bot,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Jobs",
      value: "12",
      subtitle: "Active job postings",
      icon: Briefcase,
      action: () => navigate("/jobs"),
    },
    {
      title: "Applications",
      value: "48",
      subtitle: "Across open roles",
      icon: FileText,
      action: () => navigate("/applications"),
    },
    {
      title: "Shortlisted",
      value: "9",
      subtitle: "Ready for interview",
      icon: Users,
      action: () => navigate("/applications?status=Shortlisted"),
    },
    {
      title: "Avg ATS Score",
      value: "82%",
      subtitle: "Match quality",
      icon: Sparkles,
      action: () => navigate("/applications?minScore=80"),
    },
  ];

  const activities = [
    {
      title: "Rahul Mehta scored 91%",
      desc: "AI/ML Engineer ranked high-fit.",
      time: "2 min ago",
      icon: Sparkles,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Amit Sharma applied",
      desc: "Frontend Developer role",
      time: "12 min ago",
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Neha shortlisted",
      desc: "Moved to shortlist stage",
      time: "34 min ago",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "3 resumes need review",
      desc: "Incomplete experience data",
      time: "1 hr ago",
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ✅ NEW STANDARD HEADER */}
      <PageHeader
        title="Recruiter Dashboard"
        subtitle="Track jobs, evaluate candidates and manage hiring pipeline"
        action={
          <button
            onClick={() => navigate("/create-job")}
            className="bg-white text-black px-4 py-2 font-semibold"
          >
            Create Job
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={item.action}
              className="text-left bg-white border border-gray-100 p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={18} />
                </div>

                <ArrowRight size={16} className="text-gray-300" />
              </div>

              <p className="text-sm text-gray-500 mt-4">{item.title}</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {item.value}
              </h2>
              <p className="text-xs text-gray-400">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Pipeline */}
        <div className="xl:col-span-7 bg-white border p-6">
          <h2 className="font-semibold text-gray-800">Hiring Pipeline</h2>

          <div className="mt-5 space-y-4">
            {[
              ["Applied", "48"],
              ["Shortlisted", "9"],
              ["Interview", "4"],
              ["Rejected", "6"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 bg-gray-100 mt-1">
                  <div className="h-2 bg-indigo-600 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="xl:col-span-5 bg-white border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {activities.map((a) => {
              const Icon = a.icon;

              return (
                <div key={a.title} className="flex gap-3">
                  <div className={`w-9 h-9 flex items-center justify-center ${a.color}`}>
                    <Icon size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI */}
      <div className="bg-white border p-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          AI Insights
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            "Top candidates ATS > 85%",
            "Python + React trending",
            "Manual review needed",
          ].map((text) => (
            <div key={text} className="bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-700">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;