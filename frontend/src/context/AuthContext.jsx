import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, check if a token already exists (e.g., user refreshed the page)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // Optimistically restore from localStorage immediately (fast UI)
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ---------- REGISTER ----------
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    const { token, ...userData } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // ---------- LOGIN ----------
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, ...userData } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access anywhere: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);