import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        new_password: password,
      });

      alert("Password updated successfully");
      navigate("/");
    } catch {
      alert("Reset failed or link expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a new secure password.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <input
          required
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading || !token}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default ResetPassword;