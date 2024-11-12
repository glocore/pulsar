import path from "node:path";
import { build, createServer, Plugin } from "vite";

const mode = "development";
process.env.NODE_ENV = mode;
process.env.MODE = mode;

const rendererWatchServer = await createServer({
  mode,
  root: path.resolve("packages/renderer"),
});

await rendererWatchServer.listen();

const rendererWatchServerProvider: Plugin = {
  name: "@pulsar/renderer-watch-server-provider",
  api: {
    provideRendererWatchServer() {
      return rendererWatchServer;
    },
  },
};

const packagesToStart = ["packages/preload", "packages/main"] as const;

for (const pkg of packagesToStart) {
  await build({
    mode,
    root: path.resolve(pkg),
    plugins: [rendererWatchServerProvider],
  });
}
