import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Left Brand Panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-10 text-white">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm">
              AI Hiring Platform
            </div>

            <h1 className="text-4xl font-bold mt-8 leading-tight">
              Hire smarter with <br /> HireGenie AI
            </h1>

            <p className="text-indigo-100 mt-5 text-lg leading-relaxed">
              Manage jobs, candidates, applications, resume scoring and AI interviews from one modern dashboard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold">AI</p>
              <p className="text-xs text-indigo-100 mt-1">Resume Score</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold">ATS</p>
              <p className="text-xs text-indigo-100 mt-1">Pipeline</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-indigo-100 mt-1">AI Assist</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;