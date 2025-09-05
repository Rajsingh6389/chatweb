import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Use Railway backend URL in production
  const backendUrl =
    mode === "production"
      ? "https://chatweb-production-91d6.up.railway.app"
      : "http://localhost:8080";

  return {
    plugins: [react()],
    define: {
      global: "window", // Fix for sockjs-client
    },
    resolve: {
      alias: {
        process: "process/browser",
        buffer: "buffer",
      },
    },
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
