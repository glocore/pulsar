/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { renderer } from "unplugin-auto-expose";
import { defineConfig } from "vite";
import { chrome } from "../main/vendors.json";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const WORKSPACE_ROOT = __dirname;
const REPO_ROOT = join(WORKSPACE_ROOT, "../..");

export default defineConfig({
  mode: process.env.MODE,
  plugins: [
    renderer.vite({
      preloadEntry: join(REPO_ROOT, "packages/preload/src/index.ts"),
    }),
    TanStackRouterVite(),
    react(),
  ],
  root: WORKSPACE_ROOT,
  envDir: REPO_ROOT,
  resolve: {
    alias: {
      "@/": join(WORKSPACE_ROOT, "src") + "/",
    },
  },
  base: "",
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    rollupOptions: {
      input: join(WORKSPACE_ROOT, "index.html"),
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: "happy-dom",
  },
});
