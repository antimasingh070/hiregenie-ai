import { useState } from "react";
import api from "../services/api";

function CreateJob() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    skills: "",
    company: "",
    location: ""
  });

  const submit = async () => {
    await api.post("/jobs", job);
    alert("Job created");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Create Job Posting
        </h1>

        <div className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Job Title"
            onChange={(e)=>setJob({...job,title:e.target.value})}
          />

          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Required Skills"
            onChange={(e)=>setJob({...job,skills:e.target.value})}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Company"
              onChange={(e)=>setJob({...job,company:e.target.value})}
            />

            <input
              className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Location"
              onChange={(e)=>setJob({...job,location:e.target.value})}
            />
          </div>

          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
            placeholder="Job Description"
            onChange={(e)=>setJob({...job,description:e.target.value})}
          />

          <button
            onClick={submit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Create Job
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;