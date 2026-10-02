import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

/**
 * Axios instance yang sudah dikonfigurasi untuk berkomunikasi dengan backend.
 *
 * - baseURL mengarah ke Express API.
 * - Interceptor request menambahkan JWT token dari localStorage (jika ada).
 * - Interceptor response menangani 401 (token expired/invalid).
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: tambahkan Authorization header jika token ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: tangani 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
      // Redirect ke login jika bukan di halaman login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
