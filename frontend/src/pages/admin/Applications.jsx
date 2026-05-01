import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/admin/applications").then((res) => setApps(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Applications"
        subtitle="Admin monitoring for every candidate application."
      />

      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-left min-w-[650px]">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="px-5 py-4">Application ID</th>
              <th>User</th>
              <th>Job</th>
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">{app.id}</td>
                <td>{app.candidate_name}</td>
                <td>{app.job_title}</td>
                  <td>{app.company}</td>
                <td>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs border border-indigo-100">
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}

            {apps.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-8 text-center text-gray-500">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applications;