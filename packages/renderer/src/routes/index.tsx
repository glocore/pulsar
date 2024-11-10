import { createFileRoute } from "@tanstack/react-router";

type Options = {
  editorFilePath: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (options: Options): Options => options,
});
