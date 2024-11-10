import { fileTree, Node } from "#preload";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiFileTextLine,
} from "react-icons/ri";
import { Route } from "./routes";

export const FileTree = ({ rootPath }: { rootPath: string }) => {
  const navigate = Route.useNavigate();

  const handleFileSelect = (filePath: string) => {
    navigate({ search: { editorFilePath: filePath } });
  };

  console.log("filetree before");
  const { data: files } = useSuspenseQuery({
    queryKey: ["filetree", rootPath],
    queryFn: () => fileTree(rootPath),
  });
  console.log("filetree after");

  if (!files) {
    return null;
  }

  return <FileNode node={files} defaultOpen onFileClick={handleFileSelect} />;
};

const FileNode = ({
  node,
  defaultOpen,
  onFileClick,
}: {
  node: Node;
  defaultOpen?: boolean;
  onFileClick: (file: string) => void;
}) => {
  const [open, setOpen] = useState(defaultOpen ?? false);

  if (node.type === "file") {
    return (
      <button
        onClick={() => onFileClick(node.path)}
        className="flex items-center gap-1 flex-nowrap whitespace-nowrap"
        title={node.path}
      >
        <RiFileTextLine size={20} />
        {node.name}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex gap-1 items-center flex-nowrap whitespace-nowrap"
        title={node.path}
      >
        {open ? (
          <RiArrowDownSLine size={20} />
        ) : (
          <RiArrowRightSLine size={20} />
        )}
        {node.name}
      </button>
      {open &&
        node.files
          ?.filter((f) => !!f)
          .sort((a) => {
            if (a.type === "directory") return -1;
            return 1;
          })
          .map((file) => (
            <FileNode key={file.name} node={file} onFileClick={onFileClick} />
          ))}
    </>
  );
};
