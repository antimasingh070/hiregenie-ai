function Topbar() {
  const role = localStorage.getItem("role");

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h2 className="text-lg font-semibold capitalize">{role} Dashboard</h2>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Topbar;