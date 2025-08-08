import apiClient from "../config/api";

const multipartConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};

export const markerService = {
  getMarkers: (filters = {}) =>
    apiClient.get("/markers", { params: filters }).then((res) => res.data),

  getMarker: (id) => apiClient.get(`/markers/${id}`).then((res) => res.data),

  createMarker: (markerData) =>
    apiClient
      .post("/markers", markerData, multipartConfig)
      .then((res) => res.data),

  updateMarker: (id, markerData) =>
    apiClient
      .put(`/markers/${id}`, markerData, multipartConfig)
      .then((res) => res.data),

  deleteMarker: (id) =>
    apiClient.delete(`/markers/${id}`).then((res) => res.data),

  deleteMarkers: (ids) =>
    apiClient.post("/markers/bulk-delete", { ids }).then((res) => res.data),
};
