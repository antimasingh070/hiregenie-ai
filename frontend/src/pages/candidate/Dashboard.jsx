function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">Candidate Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mt-6">

        <div className="bg-white p-5 rounded shadow">
          Applications: 5
        </div>

        <div className="bg-white p-5 rounded shadow">
          Interviews: 2
        </div>

        <div className="bg-white p-5 rounded shadow">
          ATS Score: 78
        </div>

      </div>

    </div>
  );
}

export default Dashboard;