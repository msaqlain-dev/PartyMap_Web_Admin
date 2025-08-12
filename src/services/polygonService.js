import apiClient from "../config/api";

export const polygonService = {
  // Get all polygons with pagination
  getPolygons: (filters = {}) => {
    return apiClient
      .get("/polygons", { params: filters })
      .then((res) => res.data);
  },

  // Get all polygons without pagination
  getAllPolygonsWithoutPagination: (filters = {}) => {
    return apiClient
      .get("/polygons/all", { params: filters })
      .then((res) => res.data);
  },

  // Get polygons as GeoJSON
  getPolygonsAsGeoJSON: (filters = {}) => {
    return apiClient
      .get("/polygons/geojson", { params: filters })
      .then((res) => res.data);
  },

  // Get single polygon by ID
  getPolygon: (id) => apiClient.get(`/polygons/${id}`).then((res) => res.data),

  // Create new polygon
  createPolygon: (polygonData) =>
    apiClient.post("/polygons", polygonData).then((res) => res.data),

  // Update existing polygon
  updatePolygon: (id, polygonData) =>
    apiClient.put(`/polygons/${id}`, polygonData).then((res) => res.data),

  // Delete single polygon
  deletePolygon: (id) =>
    apiClient.delete(`/polygons/${id}`).then((res) => res.data),

  // Delete multiple polygons
  deletePolygons: (ids) =>
    apiClient
      .post("/polygons/delete-multiple", { ids })
      .then((res) => res.data),

  // Delete all polygons
  deleteAllPolygons: () =>
    apiClient.delete("/polygons").then((res) => res.data),

  // Create multiple polygons
  createMultiplePolygons: (polygons) =>
    apiClient.post("/polygons/bulk", { polygons }).then((res) => res.data),

  // Bulk update polygons
  bulkUpdatePolygons: (ids, updateData) =>
    apiClient
      .put("/polygons/bulk-update", { ids, updateData })
      .then((res) => res.data),

  // Get polygons by marker
  getPolygonsByMarker: (markerId) =>
    apiClient.get(`/polygons/marker/${markerId}`).then((res) => res.data),

  // Associate polygon with marker
  associateWithMarker: (polygonId, markerId) =>
    apiClient
      .post(`/polygons/${polygonId}/associate-marker`, { markerId })
      .then((res) => res.data),

  // Dissociate polygon from marker
  dissociateFromMarker: (polygonId) =>
    apiClient
      .delete(`/polygons/${polygonId}/dissociate-marker`)
      .then((res) => res.data),

  // Get polygons within bounds
  getPolygonsWithinBounds: (bounds) =>
    apiClient
      .post("/polygons/within-bounds", { bounds })
      .then((res) => res.data),

  // Get intersecting polygons
  getPolygonsIntersecting: (geometry) =>
    apiClient
      .post("/polygons/intersects", { geometry })
      .then((res) => res.data),
};
