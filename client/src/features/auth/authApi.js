import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("akiro_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerAPI = (data) => API.post("/auth/register", data);
export const loginAPI = (data) => API.post("/auth/login", data);
export const verifyMfaAPI = (data) => API.post("/auth/verify-mfa", data);
export const enableMfaAPI = () => API.post("/auth/enable-mfa");
export const disableMfaAPI = () => API.post("/auth/disable-mfa");
