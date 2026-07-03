import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    // Optimize build output
    minify: "terser",
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          react: ["react", "react-dom"],
          charts: ["chart.js", "react-chartjs-2"],
        },
      },
    },
  },
});