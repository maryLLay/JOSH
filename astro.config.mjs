import { defineConfig } from "astro/config";
import icon from "astro-icon";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Placeholder: set to the final domain (and update public/CNAME) once decided.
  site: "https://janelia-josh.example.org",
  integrations: [
    icon(),
    react(),
  ],
  vite: {
    resolve: {
      noExternal: ["@mui/utils", "@mui/base"],
    },
  },
});
