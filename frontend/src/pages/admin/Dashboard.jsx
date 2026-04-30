function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mt-6">

        <div className="bg-white p-5 rounded shadow">
          Users: 120
        </div>

        <div className="bg-white p-5 rounded shadow">
          Recruiters: 40
        </div>

        <div className="bg-white p-5 rounded shadow">
          Jobs: 300
        </div>

      </div>

    </div>
  );
}

export default Dashboard;