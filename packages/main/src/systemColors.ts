import { systemPreferences } from "electron";

(
  [
    "control-background",
    "control",
    "control-text",
    "disabled-control-text",
    "find-highlight",
    "grid",
    "header-text",
    "highlight",
    "keyboard-focus-indicator",
    "label",
    "link",
    "placeholder-text",
    "quaternary-label",
    "scrubber-textured-background",
    "secondary-label",
    "selected-content-background",
    "selected-control",
    "selected-control-text",
    "selected-menu-item-text",
    "selected-text-background",
    "selected-text",
    "separator",
    "shadow",
    "tertiary-label",
    "text-background",
    "text",
    "under-page-background",
    "unemphasized-selected-content-background",
    "unemphasized-selected-text-background",
    "unemphasized-selected-text",
    "window-background",
    "window-frame-text",
  ] as const
).forEach((c) => console.log(c, systemPreferences.getColor(c)));

export const getAccentColor = () => {
  console.log("here");
  return systemPreferences.getAccentColor();
};

systemPreferences.subscribeLocalNotification(
  "NSSystemColorsDidChangeNotification",
  getAccentColor,
);
