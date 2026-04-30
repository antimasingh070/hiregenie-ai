import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "candidate"
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7fa",
    padding: "20px",
    fontFamily: "'Inter', sans-serif"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    margin: "10px 0",
    border: "1px solid #e1e4e8",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "20px",
    opacity: loading ? 0.7 : 1
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", color: "#1a202c", margin: "0" }}>Join HireGenie AI</h2>
          <p style={{ color: "#718096", marginTop: "8px" }}>Create your account to get started</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: "flex", gap: "15px" }}>
            <input
              style={inputStyle}
              placeholder="First Name"
              required
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Last Name"
              required
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>

          <input
            style={inputStyle}
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            style={inputStyle}
            type="tel"
            placeholder="Phone Number (e.g. +91...)"
            required
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div style={{ marginTop: "10px" }}>
            <label style={{ fontSize: "13px", color: "#4a5568", marginLeft: "2px" }}>Register as:</label>
            <select
              style={inputStyle}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", fontSize: "14px", color: "#718096" }}>
          Already have an account? <Link to="/" style={{ color: "#007bff", textDecoration: "none", fontWeight: "500" }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;