/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { chrome } from "../ide/.electron-vendors.cache.json";

const WORKSPACE_ROOT = __dirname;
const REPO_ROOT = join(WORKSPACE_ROOT, "../..");

export default defineConfig({
  mode: process.env.MODE,
  plugins: [react(), tsconfigPaths()],
  root: WORKSPACE_ROOT,
  envDir: REPO_ROOT,
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
