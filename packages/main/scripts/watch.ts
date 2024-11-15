#!/usr/bin/env bun

import { ChildProcess, spawn } from "child_process";
import electronPath from "electron";
import { build, createServer, LogLevel, ViteDevServer } from "vite";

const mode = (process.env.MODE = process.env.MODE || "development") as
  | "production"
  | "development";

const logLevel: LogLevel = "warn";

/**
 * Setup watcher for `main` package
 * On file changed it totally re-launch electron app.
 * Needs to set up `VITE_DEV_SERVER_URL` environment variable from {@link import('vite').ViteDevServer.resolvedUrls}
 */
function setupMainPackageWatcher({ resolvedUrls }: ViteDevServer) {
  if (!resolvedUrls) throw Error("Did not receive resolvedUrls");

  process.env.VITE_DEV_SERVER_URL = resolvedUrls.local[0];

  /** @type {ChildProcess | null} */
  let electronApp: ChildProcess | null = null;

  return build({
    mode,
    logLevel,
    configFile: "vite.config.ts",
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: "reload-app-on-main-package-change",
        writeBundle() {
          /** Kill electron if process already exist */
          if (electronApp !== null) {
            electronApp.removeListener("exit", process.exit);
            electronApp.kill("SIGINT");
            electronApp = null;
          }

          /** Spawn new electron process */
          electronApp = spawn(String(electronPath), ["--inspect", "."], {
            stdio: "inherit",
          });

          /** Stops the watch script when the application has been quit */
          electronApp.addListener("exit", process.exit);
        },
      },
    ],
  });
}

/**
 * Setup watcher for `preload` package
 * On file changed it reload web page.
 * Required to access the web socket of the page. By sending the `full-reload` command to the socket, it reloads the web page.
 */
function setupPreloadPackageWatcher({ ws }: ViteDevServer) {
  return build({
    mode,
    logLevel,
    configFile: "../preload/vite.config.ts",
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: "reload-page-on-preload-package-change",
        writeBundle() {
          ws.send({
            type: "full-reload",
          });
        },
      },
    ],
  });
}

/**
 * Dev server for Renderer package
 * This must be the first,
 * because the {@link setupMainPackageWatcher} and {@link setupPreloadPackageWatcher}
 * depend on the dev server properties
 */
const rendererWatchServer = await createServer({
  mode,
  logLevel,
  configFile: "../renderer/vite.config.ts",
}).then((s) => s.listen());

await setupPreloadPackageWatcher(rendererWatchServer);
await setupMainPackageWatcher(rendererWatchServer);
