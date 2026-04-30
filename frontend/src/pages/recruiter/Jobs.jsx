import { useEffect, useState } from "react";
import api from "../../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Jobs</h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Skills</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.skills}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Jobs;