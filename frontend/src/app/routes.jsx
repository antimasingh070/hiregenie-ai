import { Routes, Route } from "react-router-dom";

// Layouts
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

// Guards
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Recruiter Pages
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import CreateJob from "../pages/recruiter/CreateJob";
import Jobs from "../pages/recruiter/Jobs";
import Applications from "../pages/recruiter/Applications";

// Candidate Pages
import CandidateDashboard from "../pages/candidate/Dashboard";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= AUTH ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ================= PROTECTED APP ================= */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        {/* ===== RECRUITER ROUTES ===== */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute role="recruiter">
              <RecruiterDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <RoleRoute role="recruiter">
              <CreateJob />
            </RoleRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <RoleRoute role="recruiter">
              <Jobs />
            </RoleRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <RoleRoute role="recruiter">
              <Applications />
            </RoleRoute>
          }
        />

        {/* ===== CANDIDATE DASHBOARD ===== */}
        <Route
          path="/candidate/dashboard"
          element={
            <RoleRoute role="candidate">
              <CandidateDashboard />
            </RoleRoute>
          }
        />

        {/* ===== ADMIN ===== */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;