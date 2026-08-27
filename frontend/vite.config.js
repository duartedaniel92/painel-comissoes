import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    // o front chama "/api/..." e o Vite repassa para a API, então não
    // existe URL absoluta espalhada pelo código nem CORS em desenvolvimento
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
});
