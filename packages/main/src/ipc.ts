import { IpcChannels } from "@pulsar/preload";
import { ipcMain } from "electron";
import { getAccentColor } from "./systemColors.js";

export const handleIpc = (
  channel: IpcChannels,
  listener: Parameters<typeof ipcMain.handle>[1],
) => {
  return ipcMain.handle(channel, listener);
};

export const registerIpcHandlers = () => {
  handleIpc("accent-color:get", getAccentColor);
};
