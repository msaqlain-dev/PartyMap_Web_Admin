"use client";

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MapManagement from "./pages/MapManagement";
import CustomerManagement from "./pages/CustomerManagement";
import Settings from "./pages/Settings";
import useAuthStore from "./store/authStore";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <ProtectedRoute>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map-management" element={<MapManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </ProtectedRoute>
    </Router>
  );
}

export default App;
