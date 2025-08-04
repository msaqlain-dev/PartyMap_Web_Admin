import React, { useState, useEffect } from "react";
// import { Search } from "@mui/icons-material";

const SearchField = ({
  value,
  onChange,
  mobilePlaceholder = "",
  placeholder = "",
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);

  // Update placeholder based on screen width
  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth < 1024) {
        setCurrentPlaceholder(mobilePlaceholder);
      } else {
        setCurrentPlaceholder(placeholder);
      }
    };

    updatePlaceholder(); // Set the initial placeholder
    window.addEventListener("resize", updatePlaceholder); // Listen to window resize

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, [placeholder, mobilePlaceholder]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={currentPlaceholder}
        className={`w-full pl-10 border h-0 py-[19px] rounded-lg focus:border-[#2397a5] focus:ring-1 focus:ring-[#2397a5] focus:outline-none border-gray-300 bg-white`}
        onChange={onChange}
        value={value}
      />
      {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> */}
    </div>
  );
};

export default SearchField;
