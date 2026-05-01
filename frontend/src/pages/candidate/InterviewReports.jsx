import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import { Link } from "react-router-dom";

function InterviewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await api.get("/interviews/my-reports");
    setReports(res.data);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Interview Performance"
        subtitle="Track your AI interview scores, feedback and progress."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Total Interviews" value={reports.length}/>

          <div className="bg-white border p-5 shadow-sm">
              <p className="text-sm text-gray-500">Average Score</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {reports.length
                      ? `${Math.round(
                          reports.reduce((sum, r) => sum + Number(r.total_score || 0), 0) /
                          reports.length
                      )}%`
                      : "0%"}
              </h2>

              {/* Button yaha sahi jagah hai */}
              {reports[0] && (
                  <Link
                      to={`/candidate/interview-reports/${reports[0].interview_id}`}
                      className="inline-block mt-4 bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800"
                  >
                      View Latest Report
                  </Link>
              )}
          </div>

          <Card
              title="Completed"
              value={reports.filter((r) => r.status === "completed").length}
          />
      </div>

      <div className="bg-white border shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-gray-800">Interview Reports</h2>
        </div>

        <div className="divide-y">
          {reports.map((report) => (
            <div key={report.interview_id} className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Interview #{report.interview_id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Job ID: {report.job_id} | Questions: {report.total_questions}
                  </p>
                </div>

                <span className="text-xl font-bold text-gray-900">
                  {report.total_score || 0}%
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                {report.final_feedback || "Report not generated yet."}
              </p>

              <span className="inline-block mt-3 text-xs px-3 py-1 bg-gray-100 text-gray-700">
                {report.status}
              </span>
            </div>
          ))}

          {reports.length === 0 && (
            <p className="p-5 text-gray-500 text-sm">
              No interview reports yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white border p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2>
    </div>
  );
}

export default InterviewReports;