import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    // A fake, same-origin backend: tests never read .env or reach the real API.
    env: { VITE_BACKEND_URL: "http://localhost:3000/api" },
  },
});
