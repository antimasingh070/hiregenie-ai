import { Search, Bell } from "lucide-react";

function Navbar() {
  const role = localStorage.getItem("role") || "candidate";

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="h-16 px-6 lg:px-8 flex items-center justify-end">
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              placeholder="Search..."
              className="pl-9 pr-3 py-2 border border-slate-200 text-sm w-56 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>

          <button className="w-9 h-9 border border-slate-200 flex items-center justify-center hover:bg-slate-50">
            <Bell size={16} />
          </button>

          <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
            {role[0]}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;