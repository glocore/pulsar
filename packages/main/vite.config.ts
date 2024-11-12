import { ChildProcess, spawn } from "child_process";
import electron from "electron";
import { join } from "path";
import type { Plugin, UserConfig, ViteDevServer } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getNodeMajorVersion } from "./electron-versions";

const config = {
  build: {
    ssr: true,
    sourcemap: "inline",
    target: `node${getNodeMajorVersion()}`,
    outDir: "dist",
    assetsDir: ".",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [tsconfigPaths() as Plugin, handleHotReload()],
  resolve: {
    alias: {
      "/@/": join(__dirname, "src") + "/",
    },
  },
} satisfies UserConfig;

function handleHotReload(): Plugin {
  let electronApp: ChildProcess | null;
  let rendererWatchServer: ViteDevServer | null;

  return {
    name: "@vite-electron-builder/main-process-hot-reload",

    config(config, env) {
      if (env.mode !== "development") {
        return;
      }

      if (!config.plugins) {
        return;
      }

      const rendererWatchServerProvider = config.plugins.find((p) => {
        if (p && "name" in p) {
          return (
            p.name === "@pulsar/renderer-watch-server-provider"
          );
        }

        return false;
      }) as Plugin;

      if (!rendererWatchServerProvider) {
        throw new Error("Renderer watch server provider not found");
      }

      rendererWatchServer =
        rendererWatchServerProvider.api.provideRendererWatchServer();

      process.env.VITE_DEV_SERVER_URL =
        rendererWatchServer?.resolvedUrls?.local[0];

      return {
        build: {
          watch: {},
        },
      };
    },

    writeBundle() {
      if (process.env.NODE_ENV !== "development") {
        return;
      }

      /** Kill electron if a process already exists */
      if (electronApp != null) {
        electronApp.removeListener("exit", process.exit);
        electronApp.kill("SIGINT");
        electronApp = null;
      }

      /** Spawn a new electron process */
      electronApp = spawn(String(electron), ["--inspect", "."], {
        stdio: "inherit",
      });

      /** Stops the watch script when the application has been quit */
      electronApp.addListener("exit", process.exit);
    },
  };
}

export default config;
