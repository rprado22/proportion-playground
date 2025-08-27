import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: Set `base` to "/{REPO_NAME}/" for GitHub Pages.
// If your repo name changes, update it here.
export default defineConfig({
  plugins: [react()],
  base: "/proportion-playground/"
});
