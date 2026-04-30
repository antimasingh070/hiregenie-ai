import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token) return setStatus({ ...status, error: "Invalid reset link." });

    setStatus({ loading: true, error: "" });

    try {
      await api.post("/auth/reset-password", {
        token: token,
        new_password: newPassword
      });

      alert("Success! Your password has been updated.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Session expired. Please request a new link.";
      setStatus({ loading: false, error: msg });
    }
  };

  return (
    <div style={{ maxWidth: "380px", margin: "100px auto", fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: "20px" }}>Secure Password Reset</h2>

      {status.error && (
        <div style={{ color: "#d32f2f", backgroundColor: "#fdecea", padding: "10px", borderRadius: "4px", marginBottom: "20px" }}>
          {status.error}
        </div>
      )}

      <form onSubmit={handleReset}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>New Password</label>
          <input
            type="password"
            placeholder="Min. 8 characters"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "12px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <button
          type="submit"
          disabled={status.loading || !token}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: status.loading ? "not-allowed" : "pointer"
          }}
        >
          {status.loading ? "Processing..." : "Confirm New Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;