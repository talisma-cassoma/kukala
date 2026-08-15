import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import vercel from "@astrojs/vercel/serverless";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: vercel(),//netlify(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  resolve: {
    tsconfigPaths: true
  }
});