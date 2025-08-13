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

// Utility functions for polygon coordinates
export const validatePolygonCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { isValid: false, error: "Coordinates must be a non-empty array" };
  }

  // Check outer ring
  const outerRing = coordinates[0];
  if (!Array.isArray(outerRing) || outerRing.length < 4) {
    return {
      isValid: false,
      error: "Outer ring must have at least 4 coordinates",
    };
  }

  // Check if polygon is closed
  const first = outerRing[0];
  const last = outerRing[outerRing.length - 1];

  if (
    !Array.isArray(first) ||
    !Array.isArray(last) ||
    first.length !== 2 ||
    last.length !== 2 ||
    first[0] !== last[0] ||
    first[1] !== last[1]
  ) {
    return {
      isValid: false,
      error:
        "Polygon must be closed (first and last coordinates must be the same)",
    };
  }

  // Validate coordinate values
  for (let i = 0; i < outerRing.length; i++) {
    const coord = outerRing[i];
    if (
      !Array.isArray(coord) ||
      coord.length !== 2 ||
      typeof coord[0] !== "number" ||
      typeof coord[1] !== "number"
    ) {
      return {
        isValid: false,
        error: `Invalid coordinate at position ${i}: must be [longitude, latitude]`,
      };
    }

    // Check coordinate bounds
    if (coord[0] < -180 || coord[0] > 180) {
      return {
        isValid: false,
        error: `Longitude at position ${i} must be between -180 and 180`,
      };
    }

    if (coord[1] < -90 || coord[1] > 90) {
      return {
        isValid: false,
        error: `Latitude at position ${i} must be between -90 and 90`,
      };
    }
  }

  return { isValid: true };
};

// Convert coordinate objects to GeoJSON format
export const convertCoordsToGeoJSON = (coordObjects) => {
  return coordObjects.map((coord) => {
    if (
      typeof coord === "object" &&
      coord.longitude !== undefined &&
      coord.latitude !== undefined
    ) {
      return [coord.longitude, coord.latitude];
    }
    return coord; // Already in correct format
  });
};

// Convert GeoJSON coordinates back to coordinate objects for editing
export const convertGeoJSONToCoordObjects = (geoJSONCoords) => {
  if (!Array.isArray(geoJSONCoords) || geoJSONCoords.length === 0) {
    return [];
  }

  return geoJSONCoords.map((coord) => {
    if (Array.isArray(coord) && coord.length === 2) {
      return {
        longitude: coord[0],
        latitude: coord[1],
      };
    }
    return coord; // Already in object format
  });
};
