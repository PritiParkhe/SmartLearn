import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useLoadUserQuery } from "@/features/api/authapi";

// Blocks unauthenticated users
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);
  const { isLoading } = useLoadUserQuery({}, { skip: isAuthenticated });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Blocks logged-in users from seeing login/register pages
export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Blocks non-instructors from instructor pages
export const InstructorRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "instructor") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Blocks non-admins from admin pages
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};
