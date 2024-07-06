/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL where `renderer` web page is running.
   * This variable is initialized in main/scripts/watch.ts
   */
  readonly VITE_DEV_SERVER_URL: undefined | string;

  /** Current app version */
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
