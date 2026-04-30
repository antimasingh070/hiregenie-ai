import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Recruiter
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import CreateJob from "./pages/recruiter/CreateJob";
import RecruiterJobs from "./pages/recruiter/Jobs";
import Applications from "./pages/recruiter/Applications";

// Candidate
import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateJobs from "./pages/candidate/Jobs";
import CandidateApplications from "./pages/candidate/Applications";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RoleRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const role = localStorage.getItem("role");

  const getDashboard = () => {
    if (role === "recruiter") return <RecruiterDashboard />;
    if (role === "candidate") return <CandidateDashboard />;
    if (role === "admin") return <AdminDashboard />;
    return <Login />;
  };

  return (
    <BrowserRouter>

      <Routes>

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= DASHBOARD (ROLE BASED) ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {getDashboard()}
            </ProtectedRoute>
          }
        />

        {/* ================= RECRUITER ROUTES ================= */}
        <Route
          path="/create-job"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <CreateJob />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              {role === "recruiter" ? (
                <RecruiterJobs />
              ) : (
                <CandidateJobs />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              {role === "recruiter" ? (
                <Applications />
              ) : (
                <CandidateApplications />
              )}
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;