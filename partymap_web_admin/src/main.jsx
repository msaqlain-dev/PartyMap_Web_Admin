import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App.jsx";
import "./index.css";

const theme = {
  token: {
    colorPrimary: "#E10098",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",
    borderRadius: 6,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      siderBg: "#202020",
      headerBg: "#ffffff",
    },
    Menu: {
      darkItemBg: "#202020",
      darkItemSelectedBg: "#E10098",
      darkItemHoverBg: "rgba(225, 0, 152, 0.1)",
    },
    Button: {
      primaryColor: "#ffffff",
      primaryBg: "#E10098",
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
