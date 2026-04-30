function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">
        Recruiter Dashboard
      </h1>

      <p className="text-gray-500 mb-6">
        Overview of your hiring pipeline
      </p>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="text-gray-500 text-sm">Total Jobs</h2>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="text-gray-500 text-sm">Applications</h2>
          <p className="text-2xl font-bold">48</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="text-gray-500 text-sm">Shortlisted</h2>
          <p className="text-2xl font-bold">9</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;