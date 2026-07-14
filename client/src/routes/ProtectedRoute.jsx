import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin should use admin routes
  if (user.role === "admin") {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  // Logged-in normal user
  return <Outlet />;
}

export default ProtectedRoute;