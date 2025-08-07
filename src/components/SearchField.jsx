import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";

const SearchField = ({
  value,
  onChange,
  mobilePlaceholder = "",
  placeholder = "",
  onClear,
  disabled = false,
  size = "default", // "small", "default", "large"
  className = "",
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const [isFocused, setIsFocused] = useState(false);

  // Update placeholder based on screen width
  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth < 1024) {
        setCurrentPlaceholder(mobilePlaceholder || placeholder);
      } else {
        setCurrentPlaceholder(placeholder);
      }
    };

    updatePlaceholder(); // Set the initial placeholder
    window.addEventListener("resize", updatePlaceholder); // Listen to window resize

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, [placeholder, mobilePlaceholder]);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      // Create a synthetic event for onChange
      const syntheticEvent = {
        target: { value: "" },
      };
      onChange(syntheticEvent);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-8 py-1 px-3 pl-9 text-sm";
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
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={currentPlaceholder}
          className={`
            w-full border rounded-lg transition-all duration-200 ease-in-out bg-white
            ${getSizeClasses()}
            ${
              isFocused
                ? "border-primary ring-2 ring-primary ring-opacity-20 shadow-md"
                : "border-gray-300 hover:border-gray-400"
            }
            ${
              disabled
                ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                : "focus:outline-none"
            }
            placeholder:text-gray-400
          `}
          onChange={onChange}
          value={value}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Search Icon */}
        <SearchOutlined
          className={`
            absolute top-1/2 transform -translate-y-1/2 transition-colors duration-200
            ${getIconSize()}
            ${isFocused ? "text-primary" : "text-gray-400"}
            ${disabled ? "text-gray-300" : ""}
          `}
        />

        {/* Clear Button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 
              text-gray-400 hover:text-gray-600 transition-colors duration-200
              w-4 h-4 flex items-center justify-center
              hover:bg-gray-100 rounded-full p-0.5
            `}
          >
            <svg
              className="w-3 h-3"
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
      </div>

      {/* Loading indicator (optional) */}
      {/* You can add a loading prop and show a spinner here */}
    </div>
  );
};

export default SearchField;
