import apiClient from "../config/api";

export const markerService = {
  getMarkers: async (filters = {}) => {
    const response = await apiClient.get("/markers", { params: filters });
    return response.data;
  },

  getMarker: async (id) => {
    const response = await apiClient.get(`/markers/${id}`);
    return response.data;
  },

  createMarker: async (markerData) => {
    const response = await apiClient.post("/markers", markerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateMarker: async (id, markerData) => {
    const response = await apiClient.put(`/markers/${id}`, markerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteMarker: async (id) => {
    const response = await apiClient.delete(`/markers/${id}`);
    return response.data;
  },

  deleteMarkers: async (ids) => {
    const response = await apiClient.delete("/markers/bulk", {
      data: { ids },
    });
    return response.data;
  },
};
