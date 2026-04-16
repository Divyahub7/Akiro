import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("akiro_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const uploadResumeAPI = (formData) =>
  API.post("/resumes/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const analyzeResumeAPI = (id) => API.post(`/resumes/${id}/analyze`);
export const getUserResumesAPI = () => API.get("/resumes");
export const getResumeByIdAPI = (id) => API.get(`/resumes/${id}`);
export const deleteResumeAPI = (id) => API.delete(`/resumes/${id}`);
