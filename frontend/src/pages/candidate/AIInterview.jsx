import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function AIInterview() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [answerResults, setAnswerResults] = useState({});
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/jobs/");
    setJobs(res.data);
  };

  const startInterview = async () => {
    if (!selectedJobId) {
      alert("Please select a job first");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/interviews/start/${selectedJobId}`);
      setInterviewId(res.data.interview_id);

      const questionRes = await api.get(
        `/interviews/${res.data.interview_id}/questions`
      );

      setQuestions(questionRes.data);
      setReport(null);
      setAnswerResults({});
      setAnswers({});
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId) => {
    const answerText = answers[questionId];

    if (!answerText) {
      alert("Please write your answer");
      return;
    }

    try {
      const res = await api.post(`/interviews/${interviewId}/answer`, {
        question_id: questionId,
        answer_text: answerText,
      });

      setAnswerResults({
        ...answerResults,
        [questionId]: res.data,
      });
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to submit answer");
    }
  };

  const generateReport = async () => {
    try {
      const res = await api.get(`/interviews/${interviewId}/report`);
      setReport(res.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to generate report");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Interview"
        subtitle="Practice role-based interviews and get AI scoring feedback."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Interview Status" value={interviewId ? "Started" : "Not Started"} />
        <StatsCard title="Questions" value={questions.length} />
        <StatsCard title="Answered" value={Object.keys(answerResults).length} />
      </div>

      <div className="bg-white border p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Start New Interview
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="border px-4 py-2 w-full md:w-1/2"
          >
            <option value="">Select Job</option>

            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          <button
            onClick={startInterview}
            disabled={loading}
            className="bg-gray-900 text-white px-5 py-2 hover:bg-gray-800"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white border p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">
                Question {index + 1}
              </p>

              <h3 className="font-semibold text-gray-900 mb-4">
                {question.question_text}
              </h3>

              <textarea
                rows="5"
                placeholder="Write your answer here..."
                value={answers[question.id] || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [question.id]: e.target.value,
                  })
                }
                className="w-full border px-4 py-3 text-sm"
              />

              <button
                onClick={() => submitAnswer(question.id)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
              >
                Submit Answer
              </button>

              {answerResults[question.id] && (
                <div className="mt-4 bg-gray-50 border p-4">
                  <p className="text-sm">
                    <span className="font-semibold">Score:</span>{" "}
                    {answerResults[question.id].score}%
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Feedback:</span>{" "}
                    {answerResults[question.id].feedback}
                  </p>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={generateReport}
            className="bg-green-600 text-white px-5 py-2 hover:bg-green-700"
          >
            Generate Final Report
          </button>
        </div>
      )}

      {report && (
        <div className="bg-white border p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">
            Final Interview Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4">
              <p className="text-sm text-gray-500">Total Score</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {report.total_score}%
              </h3>
            </div>

            <div className="border p-4">
              <p className="text-sm text-gray-500">Final Feedback</p>
              <p className="text-gray-700 mt-2">{report.final_feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value }) {
  return (
    <div className="bg-white border p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2>
    </div>
  );
}

export default AIInterview;