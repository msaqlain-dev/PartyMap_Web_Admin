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

export const getValueFromPath = (obj, path) => {
  return path
    .split(".")
    .reduce((o, key) => (o && o[key] !== undefined ? o[key] : ""), obj);
};

export const mapRouteToModule = {
  "/": "application",
  "/properties": "property",
  "/tenants": "tenant",
  "/invoices": "invoice",
  "/prospects": "prospect",
  "/tasks": "task",
  "/vendors": "vendor",
  "/reports": "report",
  "/tenants": "tenant",
  "/chat": "chat",
  "/transactions": "transaction",
  "/leases": "lease",
  "/accounts": "account",
  "/settings": "setting",
};

// Debounce function
export const debounce = (func, delay) => {
  let timer;

  class debouncedFunction {
    constructor(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    }
    static cancel() {
      clearTimeout(timer);
    }
  }

  return debouncedFunction;
};

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

export const mapFeedbackRating = (str) => {
  switch (str) {
    case "Disappointed":
      return "1";
    case "Poor":
      return "2";
    case "Average":
      return "3";
    case "Good":
      return "4";
    case "Fantastic":
      return "5";
    default:
      return "-1";
  }
};

export const daysName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

export const getUnreadNotifications = (data) => {
  return data.reduce((acc, i) => {
    if (i.isRead === false) {
      return acc + 1;
    }
    return acc;
  }, 0);
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
