import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function AIInterview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/ai-interviews").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="text-gray-500">Loading AI interview data...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Interview Monitoring"
        subtitle="Track AI interview usage, scores and system activity."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Interviews Conducted" value={data.interviews_conducted} />
        <Card title="Average Score" value={`${data.avg_score}%`} />
        <Card title="Active Sessions" value={data.active_sessions} />
      </div>

      <div className="bg-white border p-6">
        <h2 className="font-semibold text-gray-800 mb-4">System Logs</h2>

        <ul className="space-y-3">
          {data.logs.map((log, index) => (
            <li key={index} className="text-sm text-gray-600 border-b pb-3 last:border-0">
              {log}
            </li>
          ))}
        </ul>
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

export default AIInterview;