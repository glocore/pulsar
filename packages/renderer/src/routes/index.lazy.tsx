import { Editor } from "@/Editor";
import { FileTree } from "@/FileTree";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  disableGlobalCursorStyles,
} from "react-resizable-panels";

disableGlobalCursorStyles();

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

export function HomePage() {
  const { editorFilePath } = Route.useSearch();

  return (
    <div className="h-screen w-screen">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15}>
          <div className="overflow-auto h-full overscroll-contain">
            <FileTree rootPath="/Users/ashwin/Documents/projects/pulsar" />
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 border-r border-gray-900 cursor-ew-resize" />
        <Panel minSize={30}>
          <div className="overflow-auto h-full">
            <Editor filePath={editorFilePath} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
