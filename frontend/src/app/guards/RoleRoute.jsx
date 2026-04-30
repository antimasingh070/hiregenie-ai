import { Navigate } from "react-router-dom";

/**
 * Role-based access control (RBAC)
 * Example:
 * <RoleRoute role="recruiter">...</RoleRoute>
 */

function RoleRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ❌ Wrong role
  if (userRole !== role) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied 🚫
          </h1>
          <p className="text-gray-500 mt-2">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default RoleRoute;