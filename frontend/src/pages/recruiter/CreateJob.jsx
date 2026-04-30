import { useState } from "react";
import api from "../../services/api";

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
    alert("Job created successfully");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Create Job</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          className="w-full p-3 border rounded"
          placeholder="Job Title"
          onChange={(e)=>setJob({...job,title:e.target.value})}
        />

        <input
          className="w-full p-3 border rounded"
          placeholder="Skills (comma separated)"
          onChange={(e)=>setJob({...job,skills:e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            className="p-3 border rounded"
            placeholder="Company"
            onChange={(e)=>setJob({...job,company:e.target.value})}
          />

          <input
            className="p-3 border rounded"
            placeholder="Location"
            onChange={(e)=>setJob({...job,location:e.target.value})}
          />

        </div>

        <textarea
          className="w-full p-3 border rounded h-32"
          placeholder="Job Description"
          onChange={(e)=>setJob({...job,description:e.target.value})}
        />

        <button
          onClick={submit}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Job
        </button>

      </div>
    </div>
  );
}

export default CreateJob;