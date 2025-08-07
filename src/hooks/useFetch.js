import { useState, useEffect } from "react";
import apiClient from "../config/api";

const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await apiClient(url, { params: options });
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, dependencies); // Fetch again if dependencies change

  return { data, loading, error };
};

export default useFetch;
