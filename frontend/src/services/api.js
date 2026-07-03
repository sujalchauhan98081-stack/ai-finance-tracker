import axios from "axios";

// Centralized Axios instance — every API call in the app routes through this,
// so the base URL and auth header logic only need to be defined once.
const api = axios.create({
  baseURL: "https://ai-finance-tracker-production-3dft.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: automatically attaches the JWT (if one exists) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;