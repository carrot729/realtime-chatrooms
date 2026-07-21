import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * Response interceptor — catches 429 (Too Many Requests) from the rate limiter
 * and surfaces a user-friendly alert so the UI does not silently fail.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const message =
        error.response.data?.message;
      alert(message);
    }
    return Promise.reject(error);
  },
);

export default api;
