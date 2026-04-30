function Applications() {

  const apps = [
    { job: "AI Engineer", status: "Under Review" },
    { job: "Backend Dev", status: "Interview" }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-xl font-bold mb-6">My Applications</h1>

      <div className="space-y-4">

        {apps.map((a, i) => (
          <div key={i} className="bg-white p-4 rounded shadow flex justify-between">

            <span>{a.job}</span>
            <span className="text-gray-500">{a.status}</span>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Applications;