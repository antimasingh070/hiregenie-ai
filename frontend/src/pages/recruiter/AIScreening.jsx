import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function AIScreening() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert("AI screening data load nahi hua");
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score) => {
    if (score === null || score === undefined) return "Pending";
    if (score >= 85) return "Strong Match";
    if (score >= 70) return "Good Match";
    if (score >= 50) return "Manual Review";
    return "Low Match";
  };

  const getRecommendation = (app) => {
    if (app.ai_recommendation) return app.ai_recommendation;

    const score = app.ats_score ?? null;

    if (score === null) return "AI screening pending";
    if (score >= 85) return "Strongly recommended for shortlist";
    if (score >= 70) return "Good candidate, recruiter review suggested";
    if (score >= 50) return "Partial match, manual review required";
    return "Not recommended currently";
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const text = `${app.candidate_name} ${app.candidate_email} ${app.job_title} ${app.company} ${app.required_skills}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [applications, search]);

  const sortedApplications = [...filteredApplications].sort(
    (a, b) => (b.ats_score ?? -1) - (a.ats_score ?? -1)
  );

  const stats = {
    total: applications.length,
    strong: applications.filter((a) => (a.ats_score ?? 0) >= 85).length,
    review: applications.filter(
      (a) => (a.ats_score ?? 0) >= 50 && (a.ats_score ?? 0) < 70
    ).length,
    pending: applications.filter(
      (a) => a.ats_score === null || a.ats_score === undefined
    ).length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Screening"
        subtitle="AI-ranked candidates based on ATS score, skills match and recommendation."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Candidates" value={stats.total} icon={Sparkles} />
        <StatCard title="Strong Match" value={stats.strong} icon={CheckCircle2} />
        <StatCard title="Manual Review" value={stats.review} icon={AlertTriangle} />
        <StatCard title="Pending AI" value={stats.pending} icon={Clock} />
      </div>

      <div className="bg-white border border-gray-100 p-4 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate, job, company, skill..."
            className="w-full pl-9 pr-4 py-2.5 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Loading AI screening candidates...
        </div>
      ) : sortedApplications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No candidates found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedApplications.map((app) => {
            const score = app.ats_score ?? 0;
            const scoreLabel = getScoreLabel(app.ats_score);
            const recommendation = getRecommendation(app);

            return (
              <div
                key={app.id}
                className="bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {app.candidate_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {app.candidate_email}
                    </p>
                  </div>

                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-full">
                    <Sparkles size={18} />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-400">Applied For</p>
                  <p className="text-sm font-medium text-gray-800">
                    {app.job_title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {app.company} • {app.location}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">ATS Score</span>
                    <b>{score}%</b>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <p className="mt-2 text-sm font-semibold text-indigo-700">
                    {scoreLabel}
                  </p>
                </div>

                <div className="mt-4 bg-gray-50 border p-3">
                  <p className="text-xs text-gray-400">AI Recommendation</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {recommendation}
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-3 line-clamp-2">
                  {app.ai_summary ||
                    "AI summary pending. Report generate hone ke baad detailed reason dikhega."}
                </p>

                <div className="mt-5 flex justify-between items-center">
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700">
                    {app.status}
                  </span>

                  <Link
                    to={`/applications/${app.id}/ai-report`}
                    className="inline-flex items-center gap-1 text-indigo-600 text-sm font-semibold"
                  >
                    <Eye size={14} />
                    View Full Report
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm">
      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-full">
        <Icon size={18} />
      </div>

      <p className="text-sm text-gray-500 mt-4">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}

export default AIScreening;