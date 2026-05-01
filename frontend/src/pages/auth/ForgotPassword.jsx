import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we’ll send reset instructions
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {sent && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            If this email exists, reset link has been sent.
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">

          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-5">
          <Link to="/" className="text-indigo-600 font-medium">
            Back to login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;