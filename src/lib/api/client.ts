import axios from "axios";

// Usa NEXT_PUBLIC_API_BASE_URL en el cliente; API_BASE_URL es útil en server code
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptores opcionales (puedes personalizarlos más adelante)
api.interceptors.request.use((config: import("axios").InternalAxiosRequestConfig) => {
  // Ej: adjuntar token si lo guardas en cookies/localStorage
  // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : undefined;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response: import("axios").AxiosResponse) => response,
  (error: unknown) => {
    // Centraliza manejo de errores si quieres (logging, toasts globales, etc.)
    return Promise.reject(error as any);
  }
);
