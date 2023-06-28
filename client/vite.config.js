import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://mappin-7xjq.onrender.com/",
    },
  },
  plugins: [react()],
});
