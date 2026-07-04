import { useState } from "react";
import { Routes, Route, Navigate, Outlet ,useLocation} from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import AIInsights from "./pages/AIInsights.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Layout used ONLY for authenticated app pages (Navbar + Sidebar + scrollable content)
const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location=useLocation();

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
      <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-4 md:p-6">
            <div key={location.pathname} className="page-fade"></div>

            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public routes - full-width pages, no Navbar/Sidebar chrome */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated app routes - wrapped in Navbar/Sidebar layout */}
      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-insights"
          element={
            <ProtectedRoute>
              <AIInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
