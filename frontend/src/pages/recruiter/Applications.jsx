import { useSearchParams } from "react-router-dom";

function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();

  const applications = [
    {
      id: 1,
      name: "Amit Sharma",
      role: "Frontend Developer",
      jobId: "1",
      jobTitle: "React Developer",
      score: 88,
      skills: "React, JavaScript, CSS",
      status: "Shortlisted",
      review: "ok",
    },
    {
      id: 2,
      name: "Neha Singh",
      role: "Backend Developer",
      jobId: "2",
      jobTitle: "Python Backend Engineer",
      score: 76,
      skills: "Python, FastAPI, PostgreSQL",
      status: "Applied",
      review: "ok",
    },
    {
      id: 3,
      name: "Rahul Mehta",
      role: "AI Engineer",
      jobId: "3",
      jobTitle: "AI/ML Engineer",
      score: 91,
      skills: "Python, PyTorch, NLP",
      status: "Shortlisted",
      review: "ok",
    },
    {
      id: 4,
      name: "Priya Verma",
      role: "Full Stack Developer",
      jobId: "1",
      jobTitle: "React Developer",
      score: 62,
      skills: "React, Node.js",
      status: "Applied",
      review: "manual",
    },
    {
      id: 5,
      name: "Karan Patel",
      role: "AI Engineer",
      jobId: "3",
      jobTitle: "AI/ML Engineer",
      score: 58,
      skills: "Python, ML",
      status: "Rejected",
      review: "manual",
    },
  ];

  const status = searchParams.get("status");
  const minScore = searchParams.get("minScore");
  const skill = searchParams.get("skill");
  const review = searchParams.get("review");
  const jobId = searchParams.get("jobId");

  const filteredApplications = applications.filter((app) => {
    if (status && app.status !== status) return false;
    if (minScore && app.score < Number(minScore)) return false;
    if (skill && !app.skills.toLowerCase().includes(skill.toLowerCase())) return false;
    if (review && app.review !== review) return false;
    if (jobId && app.jobId !== jobId) return false;
    return true;
  });

  const statusClass = {
    Shortlisted: "bg-green-50 text-green-700 border-green-200",
    Applied: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Interview: "bg-purple-50 text-purple-700 border-purple-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-6 lg:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 blur-3xl"/>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              Applications
            </h1>
            <p className="text-sm text-indigo-100 mt-2 max-w-2xl">
              Review candidates, ATS scores, job matches and hiring stages.
            </p>
          </div>

          <button className="bg-white text-slate-950 px-4 py-2.5 font-semibold hover:bg-slate-100 transition">
            Export CSV
          </button>
        </div>
      </div>

      {(status || minScore || skill || review || jobId) && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm text-indigo-700">
            Showing filtered candidates{" "}
            {status && <b>Status: {status}</b>}
            {minScore && <b> ATS Score ≥ {minScore}</b>}
            {skill && <b> Skill: {skill}</b>}
            {review && <b> Review: {review}</b>}
            {jobId && <b> Job ID: {jobId}</b>}
          </p>

          <button
            onClick={clearFilters}
            className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
          >
            Clear filter
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            placeholder="Search candidates..."
            className="w-full sm:max-w-sm px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setSearchParams({ status: "Shortlisted" })}
              className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
            >
              Shortlisted
            </button>
            <button
              onClick={() => setSearchParams({ minScore: "85" })}
              className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
            >
              ATS 85+
            </button>
            <button
              onClick={() => setSearchParams({ review: "manual" })}
              className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
            >
              Manual Review
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">Candidate</th>
                <th className="px-5 py-4 font-medium">Job</th>
                <th className="px-5 py-4 font-medium">Skills</th>
                <th className="px-5 py-4 font-medium">ATS Score</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                        {a.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.role}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">{a.jobTitle}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{a.skills}</td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800">{a.score}%</span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border font-medium ${
                        statusClass[a.status]
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}

              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-gray-500">
                    No candidates found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Applications;