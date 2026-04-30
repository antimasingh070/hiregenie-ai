import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            type="email"
            placeholder="Email"
            required
            onChange={(e)=>setForm({...form,email:e.target.value})}
          />

          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Password"
            required
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />

          <button
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <p>
            No account? <Link to="/signup" className="text-indigo-600">Signup</Link>
          </p>
          <Link to="/forgot-password" className="text-indigo-600">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;