// validation/schemas.js
import * as Yup from "yup";

// Marker validation schema
export const markerValidationSchema = Yup.object({
  // Basic Information
  markerType: Yup.string()
    .required("Marker type is required")
    .oneOf(
      ["party", "bar", "restaurant", "club", "event_hall"],
      "Invalid marker type"
    ),

  markerLabel: Yup.string()
    .required("Marker label is required")
    .min(2, "Marker label must be at least 2 characters")
    .max(100, "Marker label cannot exceed 100 characters"),

  placeName: Yup.string()
    .required("Place name is required")
    .min(2, "Place name must be at least 2 characters")
    .max(200, "Place name cannot exceed 200 characters"),

  latitude: Yup.string()
    .required("Latitude is required")
    .matches(
      /^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/,
      "Please enter a valid latitude (e.g., 40.7128)"
    ),

  longitude: Yup.string()
    .required("Longitude is required")
    .matches(
      /^-?([1-9]?[0-9]\.{1}\d{1,6}$|1[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$)/,
      "Please enter a valid longitude (e.g., -74.0060)"
    ),

  website: Yup.string()
    .url("Please enter a valid URL (e.g., https://example.com)")
    .nullable(),

  // Party Information
  partyTime: Yup.string().oneOf(
    ["morning", "afternoon", "evening", "night", "late_night"],
    "Invalid party time"
  ),

  partyDescription: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable(),

  // Files (optional validation)
  partyIcon: Yup.array().nullable(),

  placeImage: Yup.array().nullable(),

  partyImage: Yup.array().nullable(),

  // Tickets array validation
  tickets: Yup.array()
    .of(
      Yup.number()
        .min(0, "Tickets cannot be negative")
        .max(9999, "Maximum 9999 tickets allowed")
        .integer("Tickets must be a whole number")
    )
    .length(24, "Must have exactly 24 hour entries")
    .required("Ticket data is required"),
});

// Login validation schema
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Customer validation schema
export const customerValidationSchema = Yup.object({
  name: Yup.string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name cannot exceed 200 characters"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  plan: Yup.string()
    .required("Subscription plan is required")
    .oneOf(
      ["Basic", "Professional", "Enterprise"],
      "Invalid subscription plan"
    ),

  status: Yup.string().oneOf(
    ["Active", "Trial", "Expired", "Suspended"],
    "Invalid status"
  ),
});

// Settings validation schema
export const settingsValidationSchema = Yup.object({
  // Profile Settings
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  // Password Management (when changing password)
  currentPassword: Yup.string().when("newPassword", {
    is: (val) => val && val.length > 0,
    then: (schema) =>
      schema.required("Current password is required when setting new password"),
    otherwise: (schema) => schema.notRequired(),
  }),

  newPassword: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .notRequired(),

  confirmPassword: Yup.string().when("newPassword", {
    is: (val) => val && val.length > 0,
    then: (schema) =>
      schema
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // System Settings
  defaultMapView: Yup.string().oneOf(
    ["Interactive", "Satellite", "Street View"],
    "Invalid map view"
  ),

  sessionTimeout: Yup.number()
    .min(5, "Session timeout must be at least 5 minutes")
    .max(120, "Session timeout cannot exceed 120 minutes")
    .integer("Session timeout must be a whole number"),

  autoSaveInterval: Yup.number()
    .min(10, "Auto-save interval must be at least 10 seconds")
    .max(300, "Auto-save interval cannot exceed 300 seconds")
    .integer("Auto-save interval must be a whole number"),
});

// Search validation schema
export const searchValidationSchema = Yup.object({
  query: Yup.string()
    .max(100, "Search query cannot exceed 100 characters")
    .nullable(),

  filters: Yup.object({
    type: Yup.string().nullable(),
    status: Yup.string().nullable(),
    dateRange: Yup.object({
      start: Yup.date().nullable(),
      end: Yup.date()
        .nullable()
        .when("start", {
          is: (val) => val != null,
          then: (schema) =>
            schema.min(Yup.ref("start"), "End date must be after start date"),
        }),
    }).nullable(),
  }).nullable(),
});

// File upload validation helpers
export const fileValidationHelpers = {
  // Image file validation
  imageFile: (maxSizeInMB = 5) =>
    Yup.mixed()
      .test("fileSize", `File size cannot exceed ${maxSizeInMB}MB`, (value) => {
        if (!value || !value[0]) return true;
        return value[0].size <= maxSizeInMB * 1024 * 1024;
      })
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value || !value[0]) return true;
        return value[0].type.startsWith("image/");
      }),

  // Document file validation
  documentFile: (maxSizeInMB = 10, allowedTypes = ["pdf", "doc", "docx"]) =>
    Yup.mixed()
      .test("fileSize", `File size cannot exceed ${maxSizeInMB}MB`, (value) => {
        if (!value || !value[0]) return true;
        return value[0].size <= maxSizeInMB * 1024 * 1024;
      })
      .test(
        "fileType",
        `Only ${allowedTypes.join(", ")} files are allowed`,
        (value) => {
          if (!value || !value[0]) return true;
          const fileExtension = value[0].name.split(".").pop().toLowerCase();
          return allowedTypes.includes(fileExtension);
        }
      ),
};

// Dynamic validation schema builder
export const createDynamicSchema = (fields) => {
  const schemaObject = {};

  fields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case "string":
        fieldSchema = Yup.string();
        break;
      case "number":
        fieldSchema = Yup.number();
        break;
      case "email":
        fieldSchema = Yup.string().email("Invalid email address");
        break;
      case "url":
        fieldSchema = Yup.string().url("Invalid URL");
        break;
      case "array":
        fieldSchema = Yup.array();
        break;
      default:
        fieldSchema = Yup.mixed();
    }

    // Apply common validations
    if (field.required) {
      fieldSchema = fieldSchema.required(
        field.requiredMessage || `${field.label} is required`
      );
    }

    if (field.min) {
      fieldSchema = fieldSchema.min(
        field.min,
        field.minMessage || `Minimum ${field.min} characters required`
      );
    }

    if (field.max) {
      fieldSchema = fieldSchema.max(
        field.max,
        field.maxMessage || `Maximum ${field.max} characters allowed`
      );
    }

    if (field.pattern) {
      fieldSchema = fieldSchema.matches(
        field.pattern,
        field.patternMessage || "Invalid format"
      );
    }

    schemaObject[field.name] = fieldSchema;
  });

  return Yup.object(schemaObject);
};

// Form step validation schemas for multi-step forms
export const markerStepValidationSchemas = {
  step1: Yup.object({
    markerType: Yup.string().required("Marker type is required"),
    markerLabel: Yup.string().required("Marker label is required"),
    latitude: Yup.string()
      .required("Latitude is required")
      .matches(
        /^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/,
        "Invalid latitude format"
      ),
    longitude: Yup.string()
      .required("Longitude is required")
      .matches(
        /^-?([1-9]?[0-9]\.{1}\d{1,6}$|1[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$)/,
        "Invalid longitude format"
      ),
    placeName: Yup.string().required("Place name is required"),
  }),

  step2: Yup.object({
    // Media files are optional, so no required validation
    partyIcon: Yup.array().nullable(),
    placeImage: Yup.array().nullable(),
    partyImage: Yup.array().nullable(),
  }),

  step3: Yup.object({
    partyTime: Yup.string().required("Party time is required"),
    partyDescription: Yup.string().max(
      500,
      "Description cannot exceed 500 characters"
    ),
    tickets: Yup.array().of(Yup.number().min(0).max(9999)),
  }),
};

// Polygon validation schema

// Coordinate validation schema
const coordinateSchema = Yup.object({
  longitude: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  latitude: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
});

// Ring validation schema
const ringSchema = Yup.object({
  coordinates: Yup.array()
    .of(coordinateSchema)
    .min(4, "Ring must have at least 4 coordinates")
    .test(
      "is-closed",
      "Ring must be closed (first and last coordinates must be the same)",
      function (coordinates) {
        if (!coordinates || coordinates.length < 4) return true; // Let min validation handle this

        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];

        return (
          first.longitude === last.longitude && first.latitude === last.latitude
        );
      }
    )
    .required("Coordinates are required"),
});

// Geometry validation schema
const geometrySchema = Yup.object({
  outerRing: ringSchema.required("Outer ring is required"),
  holes: Yup.array().of(ringSchema).default([]),
});

// Style validation schema
const styleSchema = Yup.object({
  fillColor: Yup.string()
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Fill color must be a valid hex color"
    )
    .default("#0000FF"),
  fillOpacity: Yup.number().min(0).max(1).default(0.8),
  strokeColor: Yup.string()
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Stroke color must be a valid hex color"
    )
    .default("#000000"),
  strokeWidth: Yup.number().min(0).max(10).default(1),
  strokeOpacity: Yup.number().min(0).max(1).default(1),
});

// Extrusion validation schema
const extrusionSchema = Yup.object({
  height: Yup.number().min(0).max(1000).default(50),
  base: Yup.number().min(0).default(0),
  color: Yup.string()
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Extrusion color must be a valid hex color"
    )
    .default("#0000FF"),
  opacity: Yup.number().min(0).max(1).default(0.8),
});

// Main polygon validation schema
export const polygonValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name cannot exceed 200 characters"),

  description: Yup.string().max(
    500,
    "Description cannot exceed 500 characters"
  ),

  polygonType: Yup.string()
    .required("Polygon type is required")
    .oneOf(
      [
        "building",
        "area",
        "zone",
        "boundary",
        "venue",
        "park",
        "parking",
        "other",
      ],
      "Invalid polygon type"
    ),

  geometry: geometrySchema.required("Geometry is required"),

  style: styleSchema.default({}),

  extrusion: extrusionSchema.default({}),

  marker: Yup.string().nullable(),

  properties: Yup.object().default({}),

  isVisible: Yup.boolean().default(true),

  isInteractive: Yup.boolean().default(true),

  minZoom: Yup.number().min(0).max(24).default(0),

  maxZoom: Yup.number().min(0).max(24).default(24),
});

// Quick polygon validation (for basic forms)
export const quickPolygonSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  polygonType: Yup.string().required("Type is required"),
  geometry: Yup.object({
    outerRing: Yup.object({
      coordinates: Yup.array()
        .min(4, "At least 4 coordinates required")
        .required(),
    }).required(),
  }).required(),
});

// Bulk operations schema
export const bulkPolygonSchema = Yup.object({
  polygons: Yup.array()
    .of(polygonValidationSchema)
    .min(1, "At least one polygon is required")
    .required("Polygons array is required"),
});

// Bounds validation schema
export const boundsSchema = Yup.object({
  north: Yup.number().required("North bound is required"),
  south: Yup.number().required("South bound is required"),
  east: Yup.number().required("East bound is required"),
  west: Yup.number().required("West bound is required"),
}).test("valid-bounds", "Invalid bounds", function (bounds) {
  if (!bounds) return true;

  const { north, south, east, west } = bounds;

  if (north <= south) {
    return this.createError({ message: "North must be greater than south" });
  }

  if (east <= west) {
    return this.createError({ message: "East must be greater than west" });
  }

  return true;
});

// Step validation schemas for multi-step forms
export const polygonStepValidationSchemas = {
  step1: Yup.object({
    name: Yup.string().required("Name is required"),
    polygonType: Yup.string().required("Type is required"),
    description: Yup.string().max(500),
  }),

  step2: Yup.object({
    geometry: geometrySchema.required("Geometry is required"),
  }),

  step3: Yup.object({
    style: styleSchema,
    extrusion: extrusionSchema,
    isVisible: Yup.boolean(),
    isInteractive: Yup.boolean(),
  }),
};
