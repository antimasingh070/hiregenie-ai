function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6 ml-64">

      <h2 className="font-semibold text-gray-700">
        {role === "recruiter" ? "Recruiter Panel" : "Candidate Panel"}
      </h2>

      <div className="flex items-center gap-4">

        <div className="text-sm text-gray-500">
          Logged in as: {role}
        </div>

        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
          U
        </div>

      </div>

    </div>
  );
}

export default Navbar;