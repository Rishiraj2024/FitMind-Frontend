import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Dashboard Layout & Core
import DashboardLayout from "../components/layout/DashboardLayout";
import ErrorBoundary from "../components/layout/ErrorBoundary";
import { DashboardSkeleton } from "../components/layout/Skeleton";

// Lazy Loaded Pages
const Overview = lazy(() => import("../pages/dashboard/Overview"));
const Workouts = lazy(() => import("../pages/dashboard/Workouts"));
const Analytics = lazy(() => import("../pages/dashboard/Analytics"));
const DietPlan = lazy(() => import("../pages/dashboard/DietPlan"));
const Schedule = lazy(() => import("../pages/dashboard/Schedule"));
const Achievements = lazy(() => import("../pages/dashboard/Achievements"));
const Settings = lazy(() => import("../pages/dashboard/Settings"));
const Profile = lazy(() => import("../pages/dashboard/Profile"));
const Resources = lazy(() => import("../pages/dashboard/Resources"));
// (Removed Placeholder as it is no longer needed)

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return children;
};

const DashboardRoot = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout onLogout={handleLogout} />
    </ProtectedRoute>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Nested Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardRoot />}>
        <Route index element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Overview />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="analytics" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Analytics />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="workouts" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Workouts />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="diet" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <DietPlan />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="schedule" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Schedule />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="achievements" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Achievements />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="settings" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Settings />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="profile" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Profile />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="resources" element={
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <Resources />
            </Suspense>
          </ErrorBoundary>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
