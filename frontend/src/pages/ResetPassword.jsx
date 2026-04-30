import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: ""
  });

  const handleReset = async (e) => {
    e.preventDefault();

    if (!token) {
      return setStatus({
        loading: false,
        error: "Invalid or expired reset link.",
        success: ""
      });
    }

    setStatus({ loading: true, error: "", success: "" });

    try {
      await api.post("/auth/reset-password", {
        token: token,
        new_password: newPassword
      });

      setStatus({
        loading: false,
        error: "",
        success: "Password updated successfully!"
      });

      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setStatus({
        loading: false,
        error:
          err.response?.data?.detail ||
          "Session expired. Please request a new link.",
        success: ""
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Reset Your Password
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter a new secure password to continue
          </p>
        </div>

        {/* Error Message */}
        {status.error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {status.error}
          </div>
        )}

        {/* Success Message */}
        {status.success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4 text-sm">
            {status.success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              New Password
            </label>

            <input
              type="password"
              placeholder="Minimum 8 characters"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading || !token}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              status.loading || !token
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {status.loading ? "Updating..." : "Update Password"}
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-5 text-sm text-gray-500">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;