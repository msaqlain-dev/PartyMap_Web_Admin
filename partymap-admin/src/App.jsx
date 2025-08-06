"use client";

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CustomerManagement from "./pages/CustomerManagement";
import Settings from "./pages/Settings";
import useAuthStore from "./store/authStore";
import AddMarker from "./pages/markers/AddMarkers";
import Markers from "./pages/markers/Markers";

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

            {/*Markers Routes  */}
            <Route path="/markers" element={<Markers />} />
            <Route path="/markers/add" element={<AddMarker />} />
            {/* <Route path="/markers/edit/:id" element={<EditMarker />} />
            <Route path="/markers/view/:id" element={<ViewMarker />} /> */}

            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </ProtectedRoute>
    </Router>
  );
}

export default App;
