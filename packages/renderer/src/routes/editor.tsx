import { createFileRoute } from "@tanstack/react-router";

type EditorOptions = {
  filePath: string;
};

export const Route = createFileRoute("/editor")({
  validateSearch: (options: EditorOptions): EditorOptions => options,
});
