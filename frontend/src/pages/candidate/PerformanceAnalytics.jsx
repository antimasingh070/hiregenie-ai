import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function PerformanceAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await api.get("/interviews/my-analytics");
    setData(res.data);
  };

  if (!data) return <div className="text-gray-500">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Analytics"
        subtitle="Analyze your AI interview performance and learning gaps."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Interviews" value={data.total_interviews} />
        <Card title="Average Score" value={`${data.average_score}%`} />
        <Card title="Best Score" value={`${data.best_score}%`} />
        <Card title="Job Readiness" value={`${data.readiness}%`} />
      </div>

      <div className="bg-white border p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Weak Topics to Study
        </h2>

        {data.weak_topics.length === 0 ? (
          <p className="text-sm text-gray-500">No weak topics found yet.</p>
        ) : (
          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-2">
            {data.weak_topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Strong Areas
        </h2>

        {data.strong_topics.length === 0 ? (
          <p className="text-sm text-gray-500">
            Complete more interviews to detect strong areas.
          </p>
        ) : (
          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-2">
            {data.strong_topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 p-5">
        <p className="text-sm text-blue-800">{data.message}</p>
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

export default PerformanceAnalytics;