import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/candidate/applications")
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusClass = {
    applied: "bg-indigo-50 text-indigo-700 border-indigo-100",
    shortlisted: "bg-green-50 text-green-700 border-green-100",
    interview: "bg-purple-50 text-purple-700 border-purple-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track your application status across all jobs."
      />

      <div className="bg-white border overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading applications...
          </div>
        ) : (
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-4">Job</th>
                <th>Company</th>
                <th>Location</th>
                <th>Skills</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {apps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {app.job_title}
                  </td>
                  <td className="text-sm text-gray-600">{app.company}</td>
                  <td className="text-sm text-gray-600">{app.location}</td>
                  <td className="text-sm text-gray-600">{app.skills}</td>
                  <td>
                    <span
                      className={`px-3 py-1 text-xs border capitalize ${
                        statusClass[app.status] ||
                        "bg-gray-50 text-gray-700 border-gray-100"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}

              {apps.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                    You have not applied to any jobs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Applications;