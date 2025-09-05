// 🛠 Fix for SockJS + Node polyfills
import { Buffer } from "buffer";
import process from "process";

window.global ||= window;
window.process = process;
window.Buffer = Buffer;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
