import { KnipConfig } from "knip";

export default {
  workspaces: {
    "packages/main": {
      entry: "src/index.ts",
      project: "**/*.ts",
    },
    "packages/renderer": {
      entry: ["src/main.tsx", "testSetup.ts"],
      project: "**/*.{ts,tsx}",
      ignore: ["src/routeTree.gen.ts"],
      ignoreDependencies: ["postcss-load-config"],
    },
    "packages/preload": {
      entry: "src/index.ts",
      project: "**/*.ts",
    },
  },
} satisfies KnipConfig;
