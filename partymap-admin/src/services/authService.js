import apiClient from "../config/api";

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/admin/login", {
      email,
      password,
      role: "admin",
    });
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/admin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  refreshToken: async () => {
    const response = await apiClient.post("/auth/admin/refresh");
    return response.data;
  },

  verifyToken: async () => {
    const response = await apiClient.get("/auth/admin/verify");
    return response.data;
  },
};
