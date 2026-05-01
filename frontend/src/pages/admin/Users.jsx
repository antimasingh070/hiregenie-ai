import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/common/PageHeader";

function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = searchParams.get("role");

  useEffect(() => {
    setLoading(true);

    const url = role ? `/admin/users?role=${role}` : "/admin/users";

    api
      .get(url)
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, [role]);

  const roleClass = {
    admin: "bg-red-50 text-red-700 border-red-100",
    recruiter: "bg-indigo-50 text-indigo-700 border-indigo-100",
    candidate: "bg-green-50 text-green-700 border-green-100",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        subtitle="View candidates, recruiters and admins across the platform."
      />

      <div className="bg-white border p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 border text-sm ${
              !role ? "bg-slate-900 text-white" : "bg-white"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setSearchParams({ role: "candidate" })}
            className={`px-4 py-2 border text-sm ${
              role === "candidate" ? "bg-slate-900 text-white" : "bg-white"
            }`}
          >
            Candidates
          </button>

          <button
            onClick={() => setSearchParams({ role: "recruiter" })}
            className={`px-4 py-2 border text-sm ${
              role === "recruiter" ? "bg-slate-900 text-white" : "bg-white"
            }`}
          >
            Recruiters
          </button>

          <button
            onClick={() => setSearchParams({ role: "admin" })}
            className={`px-4 py-2 border text-sm ${
              role === "admin" ? "bg-slate-900 text-white" : "bg-white"
            }`}
          >
            Admins
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Total: <b>{users.length}</b>
        </p>
      </div>

      <div className="bg-white border overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : (
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-4">User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold">
                        {user.name?.[0] || "U"}
                      </div>

                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="text-sm text-gray-600">{user.email}</td>
                  <td className="text-sm text-gray-600">{user.phone || "-"}</td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs border capitalize ${
                        roleClass[user.role] || "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs border ${
                        user.is_active
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Users;