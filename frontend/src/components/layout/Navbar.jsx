import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 md:px-6 py-3 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <Link
        to="/dashboard"
        className="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
      >
        💰 Finance Tracker Platform
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Only show user info + logout if logged in */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">
              Hi, {user.name?.split(" ")[0]}
            </span>

            {/* Profile Link */}
            <Link
              to="/profile"
              className="hidden sm:inline rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-600 dark:text-gray-300 text-sm font-medium px-3 py-1.5 transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300 text-sm font-medium px-3 py-1.5 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;