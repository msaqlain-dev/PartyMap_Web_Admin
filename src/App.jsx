"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CustomerManagement from "./pages/CustomerManagement";
import Settings from "./pages/Settings";
import Markers from "./pages/markers/Markers";
import AddMarker from "./pages/markers/AddMarker";
import EditMarker from "./pages/markers/EditMarker";
import ViewMarker from "./pages/markers/ViewMarker";
import Polygons from "./pages/polygons/Polygons";
import AddPolygon from "./pages/polygons/AddPolygon";
import EditPolygon from "./pages/polygons/EditPolygon";
import ViewPolygon from "./pages/polygons/ViewPolygon";

// Ant Design theme configuration
const antdTheme = {
  token: {
    colorPrimary: "#e10098",
    colorLink: "#e10098",
    colorLinkHover: "#c1007a",
    borderRadius: 8,
    fontFamily: '"Nunito", sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
      paddingBlock: 12,
    },
    Select: {
      borderRadius: 8,
    },
    DatePicker: {
      borderRadius: 8,
    },
    Upload: {
      borderRadius: 8,
    },
    Form: {
      labelFontSize: 14,
      labelColor: "#374151",
    },
    Typography: {
      fontFamily: '"Nunito", sans-serif',
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Router>
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />

              {/* Markers Routes */}
              <Route path="/markers" element={<Markers />} />
              <Route path="/markers/add" element={<AddMarker />} />
              <Route path="/markers/edit/:id" element={<EditMarker />} />
              <Route path="/markers/view/:id" element={<ViewMarker />} />

              {/* Polygons Routes */}
              <Route path="/polygons" element={<Polygons />} />
              <Route path="/polygons/add" element={<AddPolygon />} />
              <Route path="/polygons/edit/:id" element={<EditPolygon />} />
              <Route path="/polygons/view/:id" element={<ViewPolygon />} />

              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/settings" element={<Settings />} />

              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      </Router>
    </ConfigProvider>
  );
}

export default App;
