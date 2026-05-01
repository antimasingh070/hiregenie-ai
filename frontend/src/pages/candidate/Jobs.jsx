import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = () => {
    setLoading(true);

    api
      .get("/candidate/jobs")
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const applyJob = async (jobId) => {
    try {
      await api.post(`/candidate/jobs/${jobId}/apply`);
      alert("Applied successfully");
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to apply");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Jobs"
        subtitle="Explore open roles and apply directly from your candidate dashboard."
      />

      {loading ? (
        <div className="text-gray-500">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border p-5 shadow-sm">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.company} • {job.location}
                  </p>
                </div>

                <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 h-fit border border-indigo-100">
                  Open
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                {job.description || "No description added."}
              </p>

              <div className="mt-4">
                <p className="text-xs text-gray-400">Required Skills</p>
                <p className="text-sm font-medium text-gray-700">
                  {job.skills}
                </p>
              </div>

              <button
                disabled={job.already_applied}
                onClick={() => applyJob(job.id)}
                className={`mt-5 px-4 py-2 font-medium ${
                  job.already_applied
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {job.already_applied ? "Already Applied" : "Apply Now"}
              </button>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="bg-white border p-8 text-center text-gray-500">
              No jobs available.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Jobs;