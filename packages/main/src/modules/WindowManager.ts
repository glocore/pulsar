import type {AppModule} from '../AppModule.js';
import {ModuleContext} from '../ModuleContext.js';
import { BrowserWindow, Menu, MenuItem, nativeTheme } from "electron";
import type { AppInitConfig } from "../AppInitConfig.js";

class WindowManager implements AppModule {
  readonly #preload: { path: string };
  readonly #renderer: { path: string } | URL;
  readonly #openDevTools;

  constructor({
    initConfig,
    openDevTools = false,
  }: {
    initConfig: AppInitConfig;
    openDevTools?: boolean;
  }) {
    this.#preload = initConfig.preload;
    this.#renderer = initConfig.renderer;
    this.#openDevTools = openDevTools;
  }

  async enable({ app }: ModuleContext): Promise<void> {
    await app.whenReady();
    await this.restoreOrCreateWindow(true);
    app.on("second-instance", () => this.restoreOrCreateWindow(true));
    app.on("activate", () => this.restoreOrCreateWindow(true));
  }

  async createWindow(): Promise<BrowserWindow> {
    const browserWindow = new BrowserWindow({
      show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
      webPreferences: {
        contextIsolation: true,
        sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
        preload: this.#preload.path,
      },
      backgroundColor: nativeTheme.shouldUseDarkColors ? "black" : "white",
    });

    if (this.#renderer instanceof URL) {
      await browserWindow.loadURL(this.#renderer.href);
    } else {
      await browserWindow.loadFile(this.#renderer.path);
    }

    const menu = Menu.getApplicationMenu();

    menu?.items
      .find((i) => i.role === ("windowmenu" as "windowMenu"))
      ?.submenu?.append(
        new MenuItem({
          label: "Toggle DevTools",
          click() {
            browserWindow.webContents.toggleDevTools();
          },
          accelerator: "f12",
          acceleratorWorksWhenHidden: false,
        }),
      );

    const appMenu = menu?.items.find(
      (i) => i.role === ("appmenu" as "appMenu"),
    )?.submenu;

    [
      new MenuItem({ type: "separator" }),
      new MenuItem({
        type: "normal",
        label: "Settings",
        click() {
          browserWindow.webContents.toggleDevTools();
        },
        accelerator: "CommandOrControl+,",
        acceleratorWorksWhenHidden: false,
      }),
    ].forEach((menuItem: MenuItem) => appMenu?.insert(2, menuItem));

    Menu.setApplicationMenu(menu);

    nativeTheme.on("updated", () => {
      const backgroundColor = nativeTheme.shouldUseDarkColors
        ? "black"
        : "white";

      browserWindow.setBackgroundColor(backgroundColor);
    });

    return browserWindow;
  }

  async restoreOrCreateWindow(show = false) {
    let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

    if (window === undefined) {
      window = await this.createWindow();
    }

    if (!show) {
      return window;
    }

    if (window.isMinimized()) {
      window.restore();
    }

    window?.show();

    if (this.#openDevTools) {
      window?.webContents.openDevTools();
    }

    window.focus();

    return window;
  }
}

export function createWindowManagerModule(...args: ConstructorParameters<typeof WindowManager>) {
  return new WindowManager(...args);
}
