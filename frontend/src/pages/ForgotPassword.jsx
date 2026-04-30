import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("If email exists, reset link sent");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 className="text-xl font-semibold mb-4">
          Forgot Password
        </h2>

        <input
          className="input mb-4"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={submit} className="btn-primary">
          Send Reset Link
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;