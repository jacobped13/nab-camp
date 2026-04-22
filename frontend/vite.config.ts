import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";

const shouldAnalyze = process.env.ANALYZE === "true";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      plugins: shouldAnalyze
        ? [
            visualizer({
              open: true,
              openOptions: { app: { name: "Google Chrome" } },
            }),
          ]
        : [],
    },
  },
});
