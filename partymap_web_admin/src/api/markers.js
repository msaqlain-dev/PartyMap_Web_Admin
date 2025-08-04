import api from "./config";

export const markersAPI = {
  // Get all markers
  getAll: () => api.get("/api/markers"),

  // Get marker by ID
  getById: (id) => api.get(`/api/markers/${id}`),

  // Create new marker
  create: (formData) => {
    return api.post("/api/markers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update marker
  update: (id, formData) => {
    return api.put(`/api/markers/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete marker
  delete: (id) => api.delete(`/api/markers/${id}`),
};
