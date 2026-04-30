import { useEffect, useState } from "react";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    setJobs(res.data);
  };

  const apply = async (id) => {
    await api.post(`/applications/${id}`);
    alert("Applied!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Available Jobs</h1>

      {jobs.map((job) => (
        <div key={job.id} className="border p-4 mb-3">
          <h2 className="font-bold">{job.title}</h2>
          <p>{job.company}</p>
          <p>{job.location}</p>

          <button
            className="bg-blue-500 text-white px-3 py-1 mt-2"
            onClick={() => apply(job.id)}
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}

export default Jobs;