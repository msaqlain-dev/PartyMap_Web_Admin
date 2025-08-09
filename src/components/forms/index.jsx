// components/forms/FormikFields.jsx
import React from "react";
import { Field, ErrorMessage } from "formik";
import {
  Upload,
  Button,
  InputNumber as AntInputNumber,
  Select as AntSelect,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;

// Generic Input Component for Formik
export const FormikInput = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  className = "",
  size = "large",
  prefix,
  suffix,
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-8 py-1 px-3 text-sm";
      case "large":
        return "h-12 py-3 px-4 text-base";
      default:
        return "h-10 py-2 px-3 text-sm";
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Field name={name}>
          {({ field, meta }) => (
            <>
              {prefix && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                  {prefix}
                </div>
              )}
              <input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={`
                  w-full border rounded-lg transition-all duration-200 ease-in-out bg-white
                  ${getSizeClasses()}
                  ${prefix ? "pl-10" : ""}
                  ${suffix ? "pr-10" : ""}
                  ${
                    meta.touched && meta.error
                      ? "border-red-500 ring-2 ring-red-200 focus:ring-red-300"
                      : "border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  }
                  ${
                    disabled
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "focus:outline-none"
                  }
                  placeholder:text-gray-400
                `}
                {...props}
              />
              {suffix && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {suffix}
                </div>
              )}
            </>
          )}
        </Field>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

// Generic TextArea Component for Formik
export const FormikTextArea = ({
  name,
  label,
  placeholder,
  rows = 4,
  disabled = false,
  className = "",
  maxLength,
  showCount = false,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <Field name={name}>
        {({ field, meta, form }) => (
          <>
            <textarea
              {...field}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              className={`
                w-full border rounded-lg transition-all duration-200 ease-in-out bg-white
                py-3 px-4 text-sm resize-none
                ${
                  meta.touched && meta.error
                    ? "border-red-500 ring-2 ring-red-200 focus:ring-red-300"
                    : "border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                }
                ${
                  disabled
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "focus:outline-none"
                }
                placeholder:text-gray-400
              `}
              {...props}
            />
            <div className="flex justify-between items-center mt-1">
              <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm"
              />
              {showCount && maxLength && (
                <span className="text-xs text-gray-500">
                  {field.value?.length || 0}/{maxLength}
                </span>
              )}
            </div>
          </>
        )}
      </Field>
    </div>
  );
};

// Generic Select Component for Formik
export const FormikSelect = ({
  name,
  label,
  placeholder = "Please select",
  options = [],
  disabled = false,
  className = "",
  size = "large",
  allowClear = true,
  showSearch = false,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <Field name={name}>
        {({ field, meta, form }) => (
          <>
            <AntSelect
              {...field}
              id={name}
              placeholder={placeholder}
              options={options}
              disabled={disabled}
              size={size}
              allowClear={allowClear}
              showSearch={showSearch}
              style={{ width: "100%" }}
              status={meta.touched && meta.error ? "error" : ""}
              onChange={(value) => form.setFieldValue(name, value)}
              onBlur={() => form.setFieldTouched(name, true)}
              filterOption={(input, option) =>
                showSearch
                  ? (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  : true
              }
              {...props}
            />
            <ErrorMessage
              name={name}
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </>
        )}
      </Field>
    </div>
  );
};

// Generic Upload Component for Formik
export const FormikUpload = ({
  name,
  label,
  accept = "image/*",
  maxCount = 1,
  uploadType = "drag", // "drag" or "button"
  buttonText = "Click to Upload",
  dragText = "Click or drag file to this area to upload",
  hint = "Support for a single or bulk upload.",
  disabled = false,
  className = "",
  listType = "picture",
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Field name={name}>
        {({ field, meta, form }) => {
          const uploadProps = {
            accept,
            maxCount,
            listType,
            disabled,
            fileList: field.value || [],
            beforeUpload: () => false, // Prevent auto upload
            onChange: ({ fileList }) => {
              form.setFieldValue(name, fileList.slice(-maxCount));
            },
            onRemove: (file) => {
              const newFileList = (field.value || []).filter(
                (item) => item.uid !== file.uid
              );
              form.setFieldValue(name, newFileList);
            },
            ...props,
          };

          return (
            <>
              {uploadType === "drag" ? (
                <Dragger
                  {...uploadProps}
                  className={meta.touched && meta.error ? "border-red-500" : ""}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{dragText}</p>
                  <p className="ant-upload-hint">{hint}</p>
                </Dragger>
              ) : (
                <Upload {...uploadProps}>
                  <Button
                    icon={<UploadOutlined />}
                    disabled={disabled}
                    className={
                      meta.touched && meta.error ? "border-red-500" : ""
                    }
                  >
                    {buttonText}
                  </Button>
                </Upload>
              )}
              <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </>
          );
        }}
      </Field>
    </div>
  );
};

// Generic InputNumber Component for Formik
export const FormikInputNumber = ({
  name,
  label,
  placeholder,
  min,
  max,
  step = 1,
  disabled = false,
  className = "",
  size = "large",
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <Field name={name}>
        {({ field, meta, form }) => (
          <>
            <AntInputNumber
              {...field}
              id={name}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              size={size}
              disabled={disabled}
              style={{ width: "100%" }}
              status={meta.touched && meta.error ? "error" : ""}
              onChange={(value) => form.setFieldValue(name, value)}
              onBlur={() => form.setFieldTouched(name, true)}
              {...props}
            />
            <ErrorMessage
              name={name}
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </>
        )}
      </Field>
    </div>
  );
};

// Search Input Component for Formik
export const FormikSearchInput = ({
  name,
  label,
  placeholder,
  disabled = false,
  className = "",
  size = "large",
  onSearch,
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-8 py-1 px-3 pl-10 text-sm";
      case "large":
        return "h-12 py-3 px-4 pl-12 text-base";
      default:
        return "h-10 py-2 px-3 pl-10 text-sm";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return "w-4 h-4 left-2.5";
      case "large":
        return "w-5 h-5 left-4";
      default:
        return "w-4 h-4 left-3";
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Field name={name}>
          {({ field, meta, form }) => (
            <>
              <input
                {...field}
                id={name}
                type="text"
                placeholder={placeholder}
                disabled={disabled}
                className={`
                  w-full border rounded-lg transition-all duration-200 ease-in-out bg-white
                  ${getSizeClasses()}
                  ${
                    meta.touched && meta.error
                      ? "border-red-500 ring-2 ring-red-200 focus:ring-red-300"
                      : "border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                  }
                  ${
                    disabled
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "focus:outline-none"
                  }
                  placeholder:text-gray-400
                `}
                onChange={(e) => {
                  form.setFieldValue(name, e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                {...props}
              />
              <SearchOutlined
                className={`
                  absolute top-1/2 transform -translate-y-1/2 text-gray-400
                  ${getIconSize()}
                `}
              />
              {field.value && (
                <button
                  type="button"
                  onClick={() => {
                    form.setFieldValue(name, "");
                    if (onSearch) onSearch("");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </Field>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

// Validation helper for common rules
export const validationRules = {
  required:
    (message = "This field is required") =>
    (value) =>
      !value ? message : undefined,

  email:
    (message = "Please enter a valid email") =>
    (value) =>
      value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ? message
        : undefined,

  minLength: (min, message) => (value) =>
    value && value.length < min
      ? message || `Minimum ${min} characters required`
      : undefined,

  maxLength: (max, message) => (value) =>
    value && value.length > max
      ? message || `Maximum ${max} characters allowed`
      : undefined,

  pattern: (pattern, message) => (value) =>
    value && !pattern.test(value) ? message : undefined,

  url:
    (message = "Please enter a valid URL") =>
    (value) =>
      value && !/^https?:\/\/.+/.test(value) ? message : undefined,

  number:
    (message = "Please enter a valid number") =>
    (value) =>
      value && isNaN(Number(value)) ? message : undefined,

  latitude:
    (message = "Please enter a valid latitude") =>
    (value) =>
      value && !/^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/.test(value)
        ? message
        : undefined,

  longitude:
    (message = "Please enter a valid longitude") =>
    (value) =>
      value &&
      !/^-?([1-9]?[0-9]\.{1}\d{1,6}$|1[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$)/.test(
        value
      )
        ? message
        : undefined,
};
