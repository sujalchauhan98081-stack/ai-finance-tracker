import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    // sticky + top-0 + z-50: navbar never scrolls out of view
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white dark:bg-gray-800 px-4 md:px-6 py-3 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        {/* Hamburger - only visible on small screens */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        <Link
          to="/dashboard"
          className="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
        >
          💰 Finance Tracker Platform
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">
              Hi, {user.name?.split(" ")[0]}
            </span>

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
