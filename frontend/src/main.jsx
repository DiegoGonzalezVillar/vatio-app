import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#111827",
          color: "#fff",
          borderRadius: "14px",
          padding: "14px 18px",
          fontWeight: "600",
        },
      }}
    />
  </StrictMode>,
);
