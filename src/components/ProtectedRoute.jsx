"use client";

import { useEffect } from "react";
import { Spin } from "antd";
import useAuthStore from "../store/authStore";
import Login from "./Login";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, initialized, initializeAuth } =
    useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initializeAuth();
    }
  }, [initialized, initializeAuth]);

  // Show loading only when not initialized or during auth operations
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show protected content
  return children;
};

export default ProtectedRoute;
