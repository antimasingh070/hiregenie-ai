import { Outlet, useNavigate } from "react-router-dom";

function AppLayout() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-6">HireGenie AI</h1>

        <p className="text-sm text-gray-400 mb-6">
          Role: {role}
        </p>

        <div className="space-y-3">

          <button onClick={() => navigate("/app/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/app/jobs")}>
            Jobs
          </button>

          {role === "recruiter" && (
            <button onClick={() => navigate("/app/create-job")}>
              Create Job
            </button>
          )}

          <button onClick={() => navigate("/app/applications")}>
            Applications
          </button>

          <button onClick={() => navigate("/app/profile")}>
            Profile
          </button>

        </div>

        <button
          onClick={logout}
          className="mt-10 text-red-400"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}

export default AppLayout;