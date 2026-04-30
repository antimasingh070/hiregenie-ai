function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">HireGenie</h2>

        <ul className="space-y-4 text-gray-300">
          <li className="hover:text-white cursor-pointer">Dashboard</li>
          <li className="hover:text-white cursor-pointer">Create Job</li>
          <li className="hover:text-white cursor-pointer">Candidates</li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">

        <h1 className="text-3xl font-semibold text-gray-800">
          Recruiter Dashboard
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Jobs</p>
            <h2 className="text-2xl font-bold mt-2">5</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Applicants</p>
            <h2 className="text-2xl font-bold mt-2">20</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Shortlisted</p>
            <h2 className="text-2xl font-bold mt-2">8</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;