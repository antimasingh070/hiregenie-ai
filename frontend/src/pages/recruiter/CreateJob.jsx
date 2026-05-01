import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function CreateJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    description: "",
    skills: "",
    company: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/jobs", job);
      alert("Job created successfully");
      setJob({
        title: "",
        description: "",
        skills: "",
        company: "",
        location: "",
      });
      navigate("/jobs");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Job"
        subtitle="Publish a new role and let HireGenie AI start matching candidates."
        action={
          <button
            onClick={() => navigate("/jobs")}
            className="bg-white text-black px-4 py-2 font-semibold hover:bg-slate-100 transition"
          >
            View Jobs
          </button>
        }
      />

      <form
        onSubmit={submit}
        className="bg-white border border-gray-100 shadow-sm p-6 space-y-5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="AI/ML Engineer"
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Required Skills
            </label>
            <input
              className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Python, React, PyTorch, FastAPI"
              value={job.skills}
              onChange={(e) => setJob({ ...job, skills: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="HireGenie"
              value={job.company}
              onChange={(e) => setJob({ ...job, company: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Remote / Bangalore / Mumbai"
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-40"
            placeholder="Describe responsibilities, experience, expectations and interview process..."
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
          />
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-4">
          <p className="text-sm font-semibold text-indigo-700">
            AI matching will use skills, description and location to rank candidates.
          </p>
          <p className="text-xs text-indigo-500 mt-1">
            Add clear skills and responsibilities for better ATS scoring.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() =>
              setJob({
                title: "",
                description: "",
                skills: "",
                company: "",
                location: "",
              })
            }
            className="px-5 py-2.5 border text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJob;