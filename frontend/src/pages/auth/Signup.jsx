import { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "candidate",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
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
            Create Account 🚀
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join HireGenie AI Platform
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <input
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="First Name"
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />

            <input
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Last Name"
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />
          </div>

          <input
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Email"
            type="email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Phone"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have account?{" "}
          <Link className="text-indigo-600 font-medium" to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;