import { defineConfig, envField } from "astro/config";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",

  security: {
    checkOrigin: true,
  },

  adapter: cloudflare(),

  experimental: {
    env: {
      schema: {
        RESEND_API_KEY: envField.string({
          context: "server",
          access: "secret",
        }),
      },
    },
  },

  integrations: [
    sanity({
      projectId: "elfb3wn1",
      dataset: "production",
      useCdn: true,
      studioBasePath: "/cms",
    }),
    react(),
    tailwind(),
  ],
});
