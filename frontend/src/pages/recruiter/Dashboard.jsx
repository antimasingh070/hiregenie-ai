import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Users,
  Sparkles,
  ArrowRight,
  Bot,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setDashboard(res.data);
    } catch (error) {
      console.error(error);
      alert("Dashboard data load nahi hua");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading recruiter dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8 text-center text-gray-500">
        Dashboard data not found.
      </div>
    );
  }

  const stats = [
    {
      title: "Total Jobs",
      value: dashboard.stats.total_jobs,
      subtitle: "Active job postings",
      icon: Briefcase,
      action: () => navigate("/jobs"),
    },
    {
      title: "Applications",
      value: dashboard.stats.total_applications,
      subtitle: "Across all jobs",
      icon: FileText,
      action: () => navigate("/applications"),
    },
    {
      title: "Shortlisted",
      value: dashboard.stats.shortlisted,
      subtitle: "Ready for next round",
      icon: Users,
      action: () => navigate("/applications?status=shortlisted"),
    },
    {
      title: "Avg ATS Score",
      value: `${dashboard.stats.avg_ats_score}%`,
      subtitle: "Candidate match quality",
      icon: Sparkles,
      action: () => navigate("/applications?minScore=80"),
    },
  ];

  const pipeline = [
    ["Applied", dashboard.pipeline.applied],
    ["Shortlisted", dashboard.pipeline.shortlisted],
    ["Interview", dashboard.pipeline.interview],
    ["Rejected", dashboard.pipeline.rejected],
  ];

  const totalPipeline =
    dashboard.pipeline.applied +
    dashboard.pipeline.shortlisted +
    dashboard.pipeline.interview +
    dashboard.pipeline.rejected;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruiter Dashboard"
        subtitle="Track jobs, applications, AI screening and hiring pipeline."
        action={
          <button
            onClick={() => navigate("/create-job")}
            className="bg-white text-black px-4 py-2 font-semibold hover:bg-slate-100 transition"
          >
            Create Job
          </button>
        }
      />

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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 bg-white border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">Hiring Pipeline</h2>
              <p className="text-xs text-gray-500 mt-1">
                Stage-wise application movement
              </p>
            </div>

            <button
              onClick={() => navigate("/applications")}
              className="text-sm font-semibold text-indigo-600"
            >
              View all
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {pipeline.map(([label, value]) => {
              const width =
                totalPipeline === 0 ? 0 : Math.round((value / totalPipeline) * 100);

              return (
                <div key={label}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="text-gray-500">
                      {value} candidate{value !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-100 mt-2 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {width}% of total applications
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-5 bg-white border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-800">Recent Activity</h2>
              <p className="text-xs text-gray-500 mt-1">
                Latest candidate updates
              </p>
            </div>

            <Clock size={18} className="text-gray-400" />
          </div>

          {dashboard.recent_activity.length === 0 ? (
            <div className="text-sm text-gray-500 py-8 text-center">
              No recent activity yet.
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.recent_activity.map((activity) => (
                <button
                  key={activity.application_id}
                  onClick={() =>
                    navigate(`/applications/${activity.application_id}/ai-report`)
                  }
                  className="w-full text-left flex gap-3 hover:bg-gray-50 p-2 transition"
                >
                  <ActivityIcon activity={activity} />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {activity.status}
                      {activity.ats_score !== null &&
                        ` • ATS: ${activity.ats_score}%`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bot size={20} className="text-indigo-600" />
          <h2 className="font-semibold text-gray-800">AI Insights</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {dashboard.ai_insights.map((item) => (
            <div key={item.title} className="bg-indigo-50 p-4 border border-indigo-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-indigo-800">
                  {item.title}
                </p>

                <TrendingUp size={16} className="text-indigo-600" />
              </div>

              <h3 className="text-2xl font-bold text-indigo-900 mt-3">
                {item.value}
                {item.title.toLowerCase().includes("score") ? "%" : ""}
              </h3>

              <p className="text-xs text-indigo-700 mt-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ activity }) {
  if (activity.ats_score >= 85) {
    return (
      <div className="w-9 h-9 bg-indigo-50 text-indigo-600 flex items-center justify-center">
        <Sparkles size={16} />
      </div>
    );
  }

  if (activity.status === "shortlisted") {
    return (
      <div className="w-9 h-9 bg-green-50 text-green-600 flex items-center justify-center">
        <CheckCircle2 size={16} />
      </div>
    );
  }

  if (activity.status === "rejected") {
    return (
      <div className="w-9 h-9 bg-red-50 text-red-600 flex items-center justify-center">
        <AlertCircle size={16} />
      </div>
    );
  }

  return (
    <div className="w-9 h-9 bg-blue-50 text-blue-600 flex items-center justify-center">
      <FileText size={16} />
    </div>
  );
}

export default Dashboard;