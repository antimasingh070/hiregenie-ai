import { useEffect, useState } from "react";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/admin/jobs").then((res) => setJobs(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Jobs"
        subtitle="Admin view of all job postings across the platform."
      />

      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-left min-w-[750px]">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="px-5 py-4">ID</th>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Skills</th>
              <th>Created By</th>
                <th>Total Application</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">{job.id}</td>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.skills}</td>
                <td>{job.created_by}</td>
                  <td>{job.total_applications}</td>
              </tr>
            ))}

            {jobs.length === 0 && (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Jobs;