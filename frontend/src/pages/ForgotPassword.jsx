import { useState } from "react";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
      try {
          await api.post("/auth/forgot-password", {email});
          alert("Agar ye email registered hai, toh aapko reset link bhej diya gaya hai.");
      } catch (err) {
          alert("Kuch error aaya, dobara koshish karein.");
      }
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      <input
        placeholder="Enter Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <button onClick={submit}>Verify</button>
    </div>
  );
}

export default ForgotPassword;