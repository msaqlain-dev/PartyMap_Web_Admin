import axios from "axios";
import errorMapper from "../utils/errorMapper";
import { config } from ".";
import useAuthStore from "../store/authStore";

// Create axios instance
const apiClient = axios.create({
  baseURL: config.backendUrl + "/api",
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const authToken = useAuthStore.getState().token;
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/admin/login";
    }
    return Promise.reject(errorMapper(error));
  }
);

export default apiClient;
