import axios from "axios";

// Centralized Axios instance — every API call in the app routes through this,
// so the base URL and auth header logic only need to be defined once.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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