import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

// Fix for "global is not defined" in Vite
if (typeof global === "undefined") {
  window.global = window;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div
      style={{ backgroundColor: "#000", minHeight: "100vh", color: "#f5f5f5" }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </div>
  </React.StrictMode>
);
