// filepath: c:\Users\mouss\Coding\PFE\Remote-WEB-APP\frontend\src\main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Add this missing import
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);