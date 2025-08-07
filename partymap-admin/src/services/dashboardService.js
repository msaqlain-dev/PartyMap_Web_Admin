import apiClient from "../config/api";

export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },

  getRecentActivity: async (limit = 10) => {
    const response = await apiClient.get("/dashboard/activity", {
      params: { limit },
    });
    return response.data;
  },

  getAnalytics: async (period = "7d") => {
    const response = await apiClient.get("/dashboard/analytics", {
      params: { period },
    });
    return response.data;
  },
};
