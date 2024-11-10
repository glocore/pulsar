import fs from "node:fs/promises";

export const getFileAsString = async (filePath: string) => {
  try {
    const contents = await fs.readFile(filePath, { encoding: "utf8" });
    return contents;
  } catch (error) {
    console.error(error);
    return null;
  }
};
