import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While we're still checking localStorage on initial load, show nothing (or a spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-500">
        Loading...
      </div>
    );
  }

  // No user after loading finished → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User exists → render the protected page
  return children;
};

export default ProtectedRoute;