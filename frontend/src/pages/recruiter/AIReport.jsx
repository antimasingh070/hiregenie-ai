import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  User,
  Briefcase,
} from "lucide-react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function AIReport() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/applications/${id}/ai-report`)
      .then((res) => setReport(res.data))
      .catch((err) => {
        console.error(err);
        alert("AI report load nahi hua");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading AI report...</div>;
  }

  if (!report) {
    return <div className="p-8 text-center text-gray-500">Report not found.</div>;
  }

  const score = report.screening.ats_score;

  const scoreType =
    score >= 85
      ? "Excellent Fit"
      : score >= 70
      ? "Good Fit"
      : score >= 50
      ? "Partial Fit"
      : "Low Fit";

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Screening Report"
        subtitle="Understand candidate fit, score reason and recruiter decision support."
        action={
          <Link
            to="/applications"
            className="bg-white text-black px-4 py-2 font-semibold hover:bg-slate-100 inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-gray-100 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Overall ATS Score</p>
              <h2 className="text-5xl font-bold text-gray-900 mt-2">
                {score}%
              </h2>
              <p className="text-indigo-600 font-semibold mt-2">{scoreType}</p>
            </div>

            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-full">
              <Sparkles size={26} />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-3 bg-gray-100 rounded-full">
              <div
                className="h-3 bg-indigo-600 rounded-full"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4">
            <h3 className="font-semibold text-indigo-900">
              Why this score?
            </h3>
            <p className="text-sm text-indigo-800 mt-2">
              {report.screening.reason}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">AI Summary</h3>
            <p className="text-sm text-gray-600 mt-2 leading-6">
              {report.screening.summary}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">AI Recommendation</h3>
            <div className="mt-3 flex items-start gap-3 bg-gray-50 border p-4">
              {score >= 70 ? (
                <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
              ) : (
                <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
              )}

              <p className="text-sm text-gray-700">
                {report.screening.recommendation}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <InfoCard
            icon={User}
            title="Candidate"
            items={[
              ["Name", report.candidate.name],
              ["Email", report.candidate.email],
            ]}
          />

          <InfoCard
            icon={Briefcase}
            title="Job Details"
            items={[
              ["Title", report.job.title],
              ["Company", report.job.company],
              ["Required Skills", report.job.skills],
            ]}
          />

          <div className="bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Recruiter Decision Help</h3>

            <div className="mt-4 space-y-3 text-sm">
              <DecisionRow label="85%+" text="Strong shortlist candidate" />
              <DecisionRow label="70-84%" text="Good, but verify manually" />
              <DecisionRow label="50-69%" text="Partial match, review carefully" />
              <DecisionRow label="<50%" text="Usually not suitable" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, items }) {
  return (
    <div className="bg-white border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-indigo-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecisionRow({ label, text }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-500">{text}</span>
    </div>
  );
}

export default AIReport;