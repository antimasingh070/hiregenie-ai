import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  UserCheck,
  AlertTriangle,
  Eye,
  Filter,
} from "lucide-react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const jobId = searchParams.get("jobId");
  const status = searchParams.get("status");
  const minScore = searchParams.get("minScore");

  useEffect(() => {
    fetchApplications();
  }, [jobId, status, minScore]);

  const fetchApplications = async () => {
    setLoading(true);

    try {
      const params = {};

      if (jobId) params.job_id = jobId;
      if (status) params.status = status;
      if (minScore) params.min_score = minScore;

      const res = await api.get("/applications", { params });
      setApplications(res.data);
    } catch (error) {
      console.error(error);
      alert("Applications load nahi ho paayi");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/applications/${id}/status`, null, {
        params: { status: newStatus },
      });

      fetchApplications();
    } catch (error) {
      console.error(error);
      alert("Status update nahi hua");
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const text = `${app.candidate_name} ${app.candidate_email} ${app.job_title} ${app.required_skills}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [applications, search]);

  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    manual: applications.filter((a) => (a.ats_score || 0) < 70).length,
    highFit: applications.filter((a) => (a.ats_score || 0) >= 85).length,
  };

  const statusClass = {
    applied: "bg-indigo-50 text-indigo-700 border-indigo-200",
    shortlisted: "bg-green-50 text-green-700 border-green-200",
    interview: "bg-purple-50 text-purple-700 border-purple-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const getScoreLabel = (score) => {
    if (score === null || score === undefined) return "Pending";
    if (score >= 85) return "Strong Match";
    if (score >= 70) return "Good Match";
    if (score >= 50) return "Partial Match";
    return "Low Match";
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        subtitle="Review candidates, ATS score, AI screening and hiring status."
        action={
          <button className="bg-white text-black px-4 py-2 font-semibold hover:bg-slate-100">
            Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={stats.total} icon={Filter} />
        <StatCard title="High Fit Candidates" value={stats.highFit} icon={Sparkles} />
        <StatCard title="Shortlisted" value={stats.shortlisted} icon={UserCheck} />
        <StatCard title="Manual Review" value={stats.manual} icon={AlertTriangle} />
      </div>

      {(jobId || status || minScore) && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 flex items-center justify-between">
          <p className="text-sm text-indigo-700">
            Active filters:
            {jobId && <b> Job ID: {jobId}</b>}
            {status && <b> Status: {status}</b>}
            {minScore && <b> ATS Score ≥ {minScore}</b>}
          </p>

          <button
            onClick={clearFilters}
            className="text-sm font-semibold text-indigo-700"
          >
            Clear Filter
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate, job, skill..."
              className="w-full pl-9 pr-4 py-2.5 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({ status: "shortlisted" })}
              className="px-3 py-2 border text-sm hover:bg-gray-50"
            >
              Shortlisted
            </button>

            <button
              onClick={() => setSearchParams({ minScore: "85" })}
              className="px-3 py-2 border text-sm hover:bg-gray-50"
            >
              ATS 85+
            </button>

            <button
              onClick={() => setSearchParams({ status: "applied" })}
              className="px-3 py-2 border text-sm hover:bg-gray-50"
            >
              New Applied
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading applications...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1050px]">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Candidate</th>
                  <th className="px-5 py-4 font-medium">Job</th>
                  <th className="px-5 py-4 font-medium">ATS Score</th>
                  <th className="px-5 py-4 font-medium">Why this score?</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold rounded-full">
                          {app.candidate_name?.[0] || "C"}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {app.candidate_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.candidate_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {app.job_title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.company} • {app.location}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="w-40">
                        <div className="flex justify-between text-sm mb-1">
                          <b>{app.ats_score ?? 0}%</b>
                          <span className="text-gray-500">
                            {getScoreLabel(app.ats_score)}
                          </span>
                        </div>

                        <div className="h-2 bg-gray-100 rounded">
                          <div
                            className="h-2 bg-indigo-600 rounded"
                            style={{ width: `${app.ats_score ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600 max-w-xs">
                      {app.ai_summary || "AI screening pending. Report generate hone ke baad reason dikhega."}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`px-3 py-2 border text-xs font-semibold ${statusClass[app.status]}`}
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/applications/${app.id}/ai-report`}
                        className="inline-flex items-center gap-1 text-indigo-600 text-sm font-semibold"
                      >
                        <Eye size={15} />
                        View AI Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm">
      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center">
        <Icon size={18} />
      </div>

      <p className="text-sm text-gray-500 mt-4">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}

export default Applications;