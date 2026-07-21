import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/jd-health-job-poster/",
  build: { outDir: "docs", emptyOutDir: true }
});
