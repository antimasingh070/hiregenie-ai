import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function InterviewReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const res = await api.get(`/interviews/${id}/details`);
    setReport(res.data);
  };

  if (!report) return <div className="text-gray-500">Loading report...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Interview Report #${report.interview_id}`}
        subtitle="Detailed feedback, correct answers and study suggestions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Score" value={`${report.total_score || 0}%`} />
        <Card title="Status" value={report.status} />
        <Card title="Questions" value={report.answers.length} />
      </div>

      <div className="bg-white border p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-2">Final Feedback</h2>
        <p className="text-sm text-gray-600">{report.final_feedback}</p>
      </div>

      {report.answers.map((item, index) => (
        <div key={index} className="bg-white border p-6 shadow-sm space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold text-gray-900">
              Question {index + 1}
            </h3>
            <span className="font-bold text-gray-900">{item.score}%</span>
          </div>

          <p className="text-sm text-gray-800">{item.question}</p>

          <div>
            <p className="font-semibold text-sm">Your Answer</p>
            <p className="text-sm text-gray-600 mt-1">{item.candidate_answer}</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-4">
            <p className="font-semibold text-sm text-green-800">
              Correct / Ideal Answer
            </p>
            <p className="text-sm text-green-700 mt-1">
              {item.correct_answer}
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm">AI Feedback</p>
            <p className="text-sm text-gray-600 mt-1">{item.feedback}</p>
          </div>

          <div>
            <p className="font-semibold text-sm">Topics to Study</p>
            <ul className="list-disc ml-5 text-sm text-gray-600 mt-1">
              {item.topics_to_study.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm">Improvement Tips</p>
            <ul className="list-disc ml-5 text-sm text-gray-600 mt-1">
              {item.improvement_tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white border p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 mt-2 capitalize">{value}</h2>
    </div>
  );
}

export default InterviewReportDetail;