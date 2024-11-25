import { initApp } from "@pulsar/main";
import { fileURLToPath } from "node:url";

if (
  process.env.NODE_ENV === "development" ||
  process.env.PLAYWRIGHT_TEST === "true" ||
  !!process.env.CI
) {
  function showAndExit(...args) {
    console.error(...args);
    process.exit(1);
  }

  process.on("uncaughtException", showAndExit);
  process.on("unhandledRejection", showAndExit);
}

// noinspection JSIgnoredPromiseFromCall
/**
 * We resolve '@pulsar/renderer' and '@pulsar/preload'
 * here and not in '@pulsar/main'
 * to observe good practices of modular design.
 * This allows fewer dependencies and better separation of concerns in '@pulsar/main'.
 * Thus,
 * the main module remains simplistic and efficient
 * as it receives initialization instructions rather than direct module imports.
 */
initApp({
  renderer:
    process.env.MODE === "development" && !!process.env.VITE_DEV_SERVER_URL
      ? new URL(process.env.VITE_DEV_SERVER_URL)
      : {
          path: fileURLToPath(import.meta.resolve("@pulsar/renderer")),
        },

  preload: {
    path: fileURLToPath(import.meta.resolve("@pulsar/preload/exposed.mjs")),
  },
});
