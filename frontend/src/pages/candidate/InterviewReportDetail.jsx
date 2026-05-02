import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function InterviewReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/interviews/${id}/report`);
      setReport(res.data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading report...</div>;
  }

  if (!report) {
    return <div className="text-red-500">Report not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/candidate/interview-reports"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to Reports
      </Link>

      <PageHeader
        title={`Interview Report #${report.interview_id}`}
        subtitle="Detailed feedback, score proof, correct answers and study suggestions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Score" value={`${report.total_score || 0}%`} />
        <Card title="Status" value={report.status || "N/A"} />
        <Card title="Questions" value={report.answers?.length || 0} />
      </div>

      <div className="bg-white border p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Final Feedback</h2>
        <p className="text-sm text-gray-600">
          {report.final_feedback || "No final feedback available yet."}
        </p>
      </div>

      {report.answers?.map((item, index) => (
        <div key={index} className="bg-white border p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">
              Question {index + 1}
            </h3>

            <span className="text-lg font-bold text-gray-900">
              {item.score || 0}%
            </span>
          </div>

          <div>
            <p className="font-semibold text-sm text-gray-800">Question</p>
            <p className="text-sm text-gray-600 mt-1">{item.question}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4">
            <p className="font-semibold text-sm text-blue-800">Your Answer</p>
            <p className="text-sm text-blue-700 mt-1">
              {item.candidate_answer || "No answer submitted."}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-4">
            <p className="font-semibold text-sm text-green-800">
              Correct / Ideal Answer
            </p>
            <p className="text-sm text-green-700 mt-1">
              {item.correct_answer || item.ideal_answer || "Not available."}
            </p>
          </div>

          <div className="bg-gray-50 border p-4">
            <p className="font-semibold text-sm text-gray-800">
              Why this score?
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Final score is calculated using answer similarity and AI
              evaluation. This helps avoid random scoring.
            </p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white border p-3">
                <p className="text-gray-500">Similarity Weight</p>
                <p className="font-semibold">
                  {item.score_explanation?.similarity_weight || "40%"}
                </p>
              </div>

              <div className="bg-white border p-3">
                <p className="text-gray-500">AI Evaluation Weight</p>
                <p className="font-semibold">
                  {item.score_explanation?.ai_evaluation_weight || "60%"}
                </p>
              </div>

              <div className="bg-white border p-3">
                <p className="text-gray-500">Question Score</p>
                <p className="font-semibold">{item.score || 0}%</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm">AI Feedback</p>
            <p className="text-sm text-gray-600 mt-1">
              {item.feedback || "No feedback available."}
            </p>
          </div>

          {item.topics_to_study?.length > 0 && (
            <div>
              <p className="font-semibold text-sm">Topics to Study</p>
              <ul className="list-disc ml-5 text-sm text-gray-600 mt-1">
                {item.topics_to_study.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {item.improvement_tips?.length > 0 && (
            <div>
              <p className="font-semibold text-sm">Improvement Tips</p>
              <ul className="list-disc ml-5 text-sm text-gray-600 mt-1">
                {item.improvement_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white border p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 mt-2 capitalize">
        {value}
      </h2>
    </div>
  );
}

export default InterviewReportDetail;