import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./app/layouts/AppLayout";
import ProtectedRoute from "./app/guards/ProtectedRoute";
import RoleRoute from "./app/guards/RoleRoute";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Recruiter
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import CreateJob from "./pages/recruiter/CreateJob";
import RecruiterJobs from "./pages/recruiter/Jobs";
import RecruiterApplications from "./pages/recruiter/Applications";

// Candidate
import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateJobs from "./pages/candidate/Jobs";
import CandidateApplications from "./pages/candidate/Applications";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminJobs from "./pages/admin/Jobs";
import AdminApplications from "./pages/admin/Applications";
import AIInterview from "./pages/admin/AIInterview";
import AdminUsers from "./pages/admin/Users";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function DashboardRedirect() {
  const role = localStorage.getItem("role");

  if (role === "recruiter") return <RecruiterDashboard />;
  if (role === "candidate") return <CandidateDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return <Navigate to="/" replace />;
}

function JobsRedirect() {
  const role = localStorage.getItem("role");

  if (role === "recruiter") return <RecruiterJobs />;
  if (role === "candidate") return <CandidateJobs />;
  if (role === "admin") return <AdminJobs />;

  return <Navigate to="/dashboard" replace />;
}

function ApplicationsRedirect() {
  const role = localStorage.getItem("role");

  if (role === "recruiter") return <RecruiterApplications />;
  if (role === "candidate") return <CandidateApplications />;
  if (role === "admin") return <AdminApplications />;

  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* App pages with sidebar + navbar */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/jobs" element={<JobsRedirect />} />
          <Route path="/applications" element={<ApplicationsRedirect />} />
          <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />

          <Route
            path="/create-job"
            element={
              <RoleRoute allowedRoles={["recruiter"]}>
                <CreateJob />
              </RoleRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/jobs"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminJobs />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/applications"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminApplications />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/ai-interview"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AIInterview />
              </RoleRoute>
            }
          />
            <Route
              path="/admin/users"
              element={
                  <RoleRoute allowedRoles={["admin"]}>
                      <AdminUsers/>
                  </RoleRoute>
              }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;