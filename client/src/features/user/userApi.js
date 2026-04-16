import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("akiro_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProfileAPI = () => API.get("/users/profile");
export const updateProfileAPI = (data) => API.put("/users/profile", data);
export const uploadAvatarAPI = (formData) =>
  API.post("/users/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const getDashboardAPI = () => API.get("/users/dashboard");
