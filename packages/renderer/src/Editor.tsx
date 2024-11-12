import { getFileAsString } from "@pulsar/preload";
import { tsxLanguage } from "@codemirror/lang-javascript";
import { useQuery } from "@tanstack/react-query";
import { basicSetup, EditorView } from "codemirror";
import { useRef } from "react";

export function Editor({ filePath }: { filePath: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useQuery({
    queryKey: ["file", filePath],
    queryFn: async () => {
      const contents = !filePath ? "" : await getFileAsString(filePath);

      editorViewRef.current?.destroy();

      if (wrapperRef.current) {
        const editorView = new EditorView({
          extensions: [basicSetup, tsxLanguage],
          parent: wrapperRef.current,
          doc: contents ?? undefined,
        });

        editorViewRef.current = editorView;
      }

      return contents;
    },
  });

  return <div ref={wrapperRef} />;
}
