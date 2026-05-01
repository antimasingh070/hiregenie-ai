import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs")
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Jobs"
        subtitle="Manage job postings, review applicants and track hiring performance."
        action={
          <button
            onClick={() => navigate("/create-job")}
            className="bg-white text-black px-4 py-2 font-semibold hover:bg-slate-100 transition"
          >
            Create Job
          </button>
        }
      />

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            placeholder="Search jobs..."
            className="w-full sm:max-w-sm px-4 py-2.5 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select className="px-4 py-2.5 border text-sm text-gray-600">
            <option>All jobs</option>
            <option>Remote</option>
            <option>On-site</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center">
            <h2 className="font-semibold text-gray-800">No jobs found</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create your first job posting to start receiving applications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[750px]">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Title</th>
                  <th className="px-5 py-4 font-medium">Company</th>
                  <th className="px-5 py-4 font-medium">Location</th>
                  <th className="px-5 py-4 font-medium">Skills</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {jobs.map((job, i) => (
                  <tr key={job.id || i} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{job.title}</p>
                      <p className="text-xs text-gray-400">Open role</p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {job.company}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {job.location}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {job.skills}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/applications?jobId=${job.id}`}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                      >
                        View Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;