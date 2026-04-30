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
    await api.post("/jobs/", job);
    alert("Job created");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

      <div className="w-full max-w-xl bg-white shadow-xl rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-6">Create Job</h1>

        <div className="space-y-4">

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Title"
            onChange={(e)=>setJob({...job,title:e.target.value})}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Skills"
            onChange={(e)=>setJob({...job,skills:e.target.value})}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Company"
            onChange={(e)=>setJob({...job,company:e.target.value})}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Location"
            onChange={(e)=>setJob({...job,location:e.target.value})}
          />

          <textarea
            className="w-full border p-3 rounded-lg h-28"
            placeholder="Description"
            onChange={(e)=>setJob({...job,description:e.target.value})}
          />

          <button
            onClick={submit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            Create Job
          </button>

        </div>
      </div>
    </div>
  );
}

export default CreateJob;