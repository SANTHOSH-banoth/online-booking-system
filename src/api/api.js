import axios from "axios";

// Replace localhost with your deployed backend URL
const API = axios.create({
  baseURL: "https://online-booking-system-xzz5.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
