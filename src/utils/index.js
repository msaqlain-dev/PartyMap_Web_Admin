import axios from "axios";

export const getInitials = (fullName) => {
  const names = fullName.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (
    names[0].charAt(0).toUpperCase() +
    names[names.length - 1].charAt(0).toUpperCase()
  );
};

// Debounce function
export const debounce = (func, delay) => {
  let timer;

  const debouncedFunction = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };

  debouncedFunction.cancel = () => {
    clearTimeout(timer);
  };

  return debouncedFunction;
};

// Enhanced debounce with useRef for React components
export const createDebouncedCallback = (callback, delay) => {
  let timeoutRef = null;

  const debouncedCallback = (...args) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    timeoutRef = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  debouncedCallback.cancel = () => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
  };

  return debouncedCallback;
};

// Search utilities
export const createSearchFilter = (searchTerm, fields) => {
  if (!searchTerm || !searchTerm.trim()) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: searchTerm.trim(), $options: "i" },
    })),
  };
};

export const buildQueryParams = (filters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object") {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  return params.toString();
};

// Statistics utilities for markers
export const calculateMarkerStats = (markers) => {
  if (!Array.isArray(markers)) return getDefaultStats();

  const stats = {
    total: markers.length,
    active: 0,
    inactive: 0,
    party: 0,
    bar: 0,
    restaurant: 0,
    club: 0,
    event_hall: 0,
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
    late_night: 0,
    totalTickets: 0,
    avgTicketsPerMarker: 0,
  };

  markers.forEach((marker) => {
    // Count by status
    const status = marker.status || "active";
    if (status === "active") stats.active++;
    else stats.inactive++;

    // Count by marker type
    const markerType = marker.markerType?.toLowerCase();
    if (stats.hasOwnProperty(markerType)) {
      stats[markerType]++;
    }

    // Count by party time
    const partyTime = marker.partyTime?.toLowerCase();
    if (stats.hasOwnProperty(partyTime)) {
      stats[partyTime]++;
    }

    // Calculate total tickets
    if (marker.tickets && Array.isArray(marker.tickets)) {
      const markerTickets = marker.tickets.reduce((sum, ticket) => {
        return sum + (ticket.availableTickets || 0);
      }, 0);
      stats.totalTickets += markerTickets;
    }
  });

  // Calculate average tickets per marker
  stats.avgTicketsPerMarker =
    stats.total > 0 ? Math.round(stats.totalTickets / stats.total) : 0;

  return stats;
};

export const getDefaultStats = () => ({
  total: 0,
  active: 0,
  inactive: 0,
  party: 0,
  bar: 0,
  restaurant: 0,
  club: 0,
  event_hall: 0,
  morning: 0,
  afternoon: 0,
  evening: 0,
  night: 0,
  late_night: 0,
  totalTickets: 0,
  avgTicketsPerMarker: 0,
});

// Color utilities for markers
export const getMarkerTypeColor = (type) => {
  const colors = {
    party: "#e10098",
    bar: "#722ed1",
    restaurant: "#fa541c",
    club: "#1890ff",
    event_hall: "#52c41a",
  };
  return colors[type?.toLowerCase()] || "#d9d9d9";
};

export const getPartyTimeColor = (time) => {
  const colors = {
    morning: "#faad14",
    afternoon: "#1890ff",
    evening: "#722ed1",
    night: "#262626",
    late_night: "#000000",
  };
  return colors[time?.toLowerCase()] || "#d9d9d9";
};

export const getStatusColor = (status) => {
  const colors = {
    active: "#52c41a",
    inactive: "#d9d9d9",
    pending: "#faad14",
    suspended: "#ff4d4f",
  };
  return colors[status?.toLowerCase()] || "#d9d9d9";
};

// Format utilities
export const formatMarkerType = (type) => {
  if (!type) return "";
  return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatPartyTime = (time) => {
  if (!time) return "";
  return time.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatCoordinate = (coord, decimals = 4) => {
  if (!coord) return "0.0000";
  return parseFloat(coord).toFixed(decimals);
};

// Pagination utilities
export const calculatePagination = (currentPage, pageSize, totalRecords) => {
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return {
    totalPages,
    startRecord,
    endRecord,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

// Validation utilities for markers
export const validateMarkerData = (markerData) => {
  const errors = {};

  if (!markerData.markerType) {
    errors.markerType = "Marker type is required";
  }

  if (!markerData.placeName || markerData.placeName.trim() === "") {
    errors.placeName = "Place name is required";
  }

  if (!markerData.markerLabel || markerData.markerLabel.trim() === "") {
    errors.markerLabel = "Marker label is required";
  }

  if (!markerData.latitude) {
    errors.latitude = "Latitude is required";
  } else if (
    !/^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/.test(markerData.latitude)
  ) {
    errors.latitude = "Invalid latitude format";
  }

  if (!markerData.longitude) {
    errors.longitude = "Longitude is required";
  } else if (
    !/^-?([1-9]?[0-9]\.{1}\d{1,6}$|1[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$)/.test(
      markerData.longitude
    )
  ) {
    errors.longitude = "Invalid longitude format";
  }

  if (markerData.website && !/^https?:\/\/.+/.test(markerData.website)) {
    errors.website = "Website must be a valid URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// File utilities
const getBlob = async (url) => {
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

export const downloadFile = async (url, fileName) => {
  const blob = await getBlob(url);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download =
    fileName ||
    url.split("/").pop().split("?")[0].split("_").slice(1).join("_");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  return true;
};

export const urlToFile = async (url, index, googlecheck) => {
  const blob = await getBlob(url);
  let fileName = "";
  if (googlecheck) {
    fileName = fileName.concat(index, url.split("/").pop().split("?")[0]);
  } else {
    fileName = url.split("/").pop().split("?")[0].split("_").slice(1).join("_");
  }
  return new File([blob], fileName, { type: blob.type });
};

// Convert each URL in the files array to a File object
export const convertFileUrlsToFiles = async (
  fileUrls = [],
  googlecheck = false
) => {
  return Promise.all(fileUrls.map((url, i) => urlToFile(url, i, googlecheck)));
};

// parse address component
export const parseAddressComponents = (components) => {
  let address = "";
  let state = "";
  let city = "";
  let zip = "";

  components.forEach((component) => {
    const types = component.types;
    if (types.includes("street_number")) address = component.long_name;
    if (types.includes("route")) address += ` ${component.long_name}`;
    if (types.includes("administrative_area_level_1"))
      state = component.long_name;
    if (types.includes("locality")) city = component.long_name;
    if (types.includes("postal_code")) zip = component.long_name;
  });

  return { address, state, city, zip };
};

// thousand seperator
export const formatThousandSeparator = (input) => {
  const isValidNumber = !isNaN(parseFloat(input)) && isFinite(input);
  if (!isValidNumber) {
    throw new Error("Invalid input: The provided value is not a valid number.");
  }

  const number = parseFloat(input);
  return number.toLocaleString("en-US");
};

export const formatToUSDate = (isoDateString) => {
  if (!isoDateString) return ""; // Handle empty or undefined input

  const date = new Date(isoDateString);

  // Check if the input date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero to month if necessary
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero to day if necessary
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

export const capitalizeCase = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const truncateText = (text, limit) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

export function downloadBlob(blob, fileName) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

export const detectDevice = () => {
  const userAgent = window.navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  return { isAndroid, isIOS };
};

export const getTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return d.toLocaleTimeString([], options);
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || "An error occurred";
  } else if (error.request) {
    // Request was made but no response received
    return "Network error. Please check your connection.";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred";
  }
};

// Local storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};
