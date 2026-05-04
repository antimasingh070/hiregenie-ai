import { useEffect, useState } from "react";
import {
  BarChart3,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/reports/")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        alert("Reports data load nahi hua");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading reports...</div>;
  if (!data) return <div className="p-8 text-center text-gray-500">No report data found.</div>;

  const buckets = [
    ["Excellent Fit", data.score_distribution.excellent, "85%+"],
    ["Good Fit", data.score_distribution.good, "70-84%"],
    ["Partial Fit", data.score_distribution.partial, "50-69%"],
    ["Low Fit", data.score_distribution.low, "<50%"],
    ["Pending AI", data.score_distribution.pending, "Not screened"],
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Deep hiring analytics, job-wise performance and AI score quality."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <ReportCard icon={Briefcase} title="Jobs" value={data.summary.total_jobs} />
        <ReportCard icon={Users} title="Applications" value={data.summary.total_applications} />
        <ReportCard icon={Sparkles} title="Avg Score" value={`${data.summary.avg_score}%`} />
        <ReportCard icon={CheckCircle2} title="Shortlist Rate" value={`${data.summary.shortlist_rate}%`} />
        <ReportCard icon={TrendingUp} title="Interview Rate" value={`${data.summary.interview_rate}%`} />
        <ReportCard icon={XCircle} title="Rejection Rate" value={`${data.summary.rejection_rate}%`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 bg-white border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={20} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-800">ATS Score Distribution</h2>
          </div>

          <div className="space-y-4">
            {buckets.map(([label, value, range]) => {
              const total = data.summary.total_applications || 1;
              const percent = Math.round((value / total) * 100);

              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="text-gray-500">{value} • {range}</span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1">{percent}% of candidates</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-7 bg-white border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-5">Job-wise Performance</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Applications</th>
                  <th className="px-4 py-3 font-medium">Avg Score</th>
                  <th className="px-4 py-3 font-medium">Shortlisted</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.job_performance.map((job) => (
                  <tr key={job.job_id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {job.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.applications}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                      {job.avg_score}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.shortlisted}</td>
                  </tr>
                ))}

                {data.job_performance.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No job performance data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Recruiter Recommendations</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {data.recommendations.map((item) => (
            <div key={item} className="bg-indigo-50 border border-indigo-100 p-4">
              <p className="text-sm text-indigo-800">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm">
      <Icon size={20} className="text-indigo-600" />
      <p className="text-sm text-gray-500 mt-3">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}

export default Reports;