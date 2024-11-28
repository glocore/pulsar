import { ipcRenderer } from "electron";
import { IpcChannels } from "./ipcChannels.js";
import { sha256sum } from "./nodeCrypto.js";
import { versions } from "./versions.js";

function invoke<Response = any>(channel: IpcChannels, ...args: any[]) {
  return ipcRenderer.invoke(channel, ...args) as Promise<Response>;
}

function getAccentColor() {
  return invoke<string>("accent-color:get");
}

function onAccentColorChange(callback: Parameters<typeof ipcRenderer.on>[1]) {
  ipcRenderer.on("accent-color:changed" satisfies IpcChannels, callback);
  return () => {
    ipcRenderer.off("accent-color:changed" satisfies IpcChannels, callback);
  };
}

export { getAccentColor, invoke, onAccentColorChange, sha256sum, versions };

export type { IpcChannels };
