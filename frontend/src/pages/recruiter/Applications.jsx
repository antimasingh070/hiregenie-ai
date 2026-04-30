function Applications() {
  const applications = [
    { name: "Amit", role: "Frontend Dev", status: "Shortlisted" },
    { name: "Neha", role: "Backend Dev", status: "Applied" },
    { name: "Rahul", role: "AI Engineer", status: "Rejected" }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Applications</h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Candidate</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{a.name}</td>
                <td>{a.role}</td>
                <td>
                  <span className="px-2 py-1 text-sm rounded bg-indigo-100 text-indigo-700">
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Applications;