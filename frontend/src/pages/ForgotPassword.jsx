function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await api.post("/auth/forgot-password", {email});
    alert("If email exists, reset link sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

        <input
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Enter Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}