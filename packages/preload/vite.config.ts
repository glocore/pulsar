import { join } from "node:path";
import { preload } from "unplugin-auto-expose";
import { defineConfig } from "vite";
import { chrome } from "../ide/.electron-vendors.cache.json";

const WORKSPACE_ROOT = __dirname;
const REPO_ROOT = join(WORKSPACE_ROOT, "../..");

const config = defineConfig({
  mode: process.env.MODE,
  root: WORKSPACE_ROOT,
  envDir: REPO_ROOT,
  build: {
    ssr: true,
    sourcemap: "inline",
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        // ESM preload scripts must have the .mjs extension
        // https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
        entryFileNames: "[name].mjs",
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },

  plugins: [preload.vite()],
});

export default config;
