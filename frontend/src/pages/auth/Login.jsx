import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back 👋</h1>
        <p className="text-sm text-slate-500 mt-1">Login to your HireGenie account</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email address"
          className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          required
          placeholder="Password"
          className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex justify-between mt-5 text-sm">
        <Link to="/signup" className="text-indigo-600 font-medium">
          Create account
        </Link>
        <Link to="/forgot-password" className="text-slate-500 hover:text-indigo-600">
          Forgot password??
        </Link>
      </div>
    </>
  );
}

export default Login;