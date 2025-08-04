// hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value.
 * @param {any} value - The value you want to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {any} - The debounced value.
 */
const useDebounce = (value, delay=500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to delay the update of debouncedValue
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout if value changes before the delay
    return () => clearTimeout(timer);
  }, [value, delay]); // Effect runs whenever value or delay changes

  return debouncedValue;
};

export default useDebounce;
