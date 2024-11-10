import fs from "node:fs/promises";
import path from "node:path";

export type Node = {
  path: string;
  name: string;
  type: "file" | "directory";
  files?: Node[];
};

const ignoreFiles = [".DS_Store"];

export const fileTree = async (inputPath: string) => {
  const name = path.basename(inputPath);
  const stat = await fs.stat(inputPath);

  const node: Node = { path: inputPath, name, type: "file" };

  if (stat.isDirectory()) {
    node.type = "directory";
    try {
      const files = await Promise.all(
        (await fs.readdir(inputPath, { withFileTypes: true }))
          .filter((file) => !ignoreFiles.includes(file.name))
          .map((file) => fileTree(path.join(file.parentPath, file.name))),
      );

      node.files = files as Node[];
    } catch (error) {
      return null;
    }
  } else if (stat.isFile()) {
    node.type = "file";
  } else {
    return null;
  }

  return node;
};
