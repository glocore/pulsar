import { getAccentColor, onAccentColorChange, versions } from "@pulsar/preload";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="rounded-xl bg-gray-800 p-4 m-4 border-2 border-gray-600">
        <code>{JSON.stringify(versions, null, 2)}</code>
      </div>
      <SystemColors />
    </QueryClientProvider>
  );
}

const SystemColors = () => {
  const { data: accentColor } = useQuery({
    queryKey: ["system-colors"],
    queryFn: () => getAccentColor(),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const off = onAccentColorChange(() =>
      queryClient.invalidateQueries({ queryKey: ["system-colors"] }),
    );

    return off;
  }, [queryClient]);

  return (
    <div className="rounded-xl bg-gray-800 p-4 m-4 border-2 border-gray-600">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div
            className="aspect-square w-10 shrink-0 rounded-md border-gray-700 border-2 whitespace-nowrap truncate"
            style={{ backgroundColor: `#${accentColor}` }}
          />
          <span className="truncate" title={accentColor}>
            <span>accent color: #{accentColor}</span>&nbsp;
          </span>
        </div>
        {Object.entries({
          "control-background": "#1E1E1EFF",
          control: "#FFFFFF3F",
          "control-text": "#FFFFFFD8",
          "disabled-control-text": "#FFFFFF3F",
          "find-highlight": "#FFFF00FF",
          grid: "#1A1A1AFF",
          "header-text": "#FFFFFFFF",
          highlight: "#B4B4B4FF",
          "keyboard-focus-indicator": "#1AA9FF7F",
          label: "#FFFFFFD8",
          link: "#419CFFFF",
          "placeholder-text": "#FFFFFF3F",
          "quaternary-label": "#FFFFFF19",
          "scrubber-textured-background": "#FFFFFFFF",
          "secondary-label": "#FFFFFF8C",
          "selected-content-background": "#0059D1FF",
          "selected-control": "#3F638BFF",
          "selected-control-text": "#FFFFFFD8",
          "selected-menu-item-text": "#FFFFFFFF",
          "selected-text-background": "#3F638BFF",
          "selected-text": "#FFFFFFFF",
          separator: "#FFFFFF19",
          shadow: "#000000FF",
          "tertiary-label": "#FFFFFF3F",
          "text-background": "#1E1E1EFF",
          text: "#FFFFFFFF",
          "under-page-background": "#282828FF",
          "unemphasized-selected-content-background": "#464646FF",
          "unemphasized-selected-text-background": "#464646FF",
          "unemphasized-selected-text": "#FFFFFFFF",
          "window-background": "#323232FF",
          "window-frame-text": "#FFFFFFD8",
        }).map(([name, hex]) => (
          <div className="flex items-center gap-4">
            <div
              className="aspect-square w-10 shrink-0 rounded-md border-gray-700 border-2 whitespace-nowrap truncate"
              style={{ backgroundColor: `${hex}` }}
            />
            <span className="truncate" title={hex}>
              <span>
                {name}: {hex}
              </span>
              &nbsp;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
