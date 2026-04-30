function Jobs() {

  const jobs = [
    { title: "AI Engineer", company: "OpenAI" },
    { title: "Backend Dev", company: "Meta" }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-xl font-bold mb-6">Browse Jobs</h1>

      <div className="grid gap-4">

        {jobs.map((job, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">

            <h2 className="font-bold">{job.title}</h2>
            <p className="text-gray-500">{job.company}</p>

            <button className="mt-3 bg-black text-white px-4 py-2 rounded">
              Apply
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Jobs;