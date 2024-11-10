import { Editor } from "@/Editor";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/editor")({
  component: EditorPage,
});

function EditorPage() {
  const { filePath } = Route.useSearch();

  return <Editor filePath={filePath} />;
}
