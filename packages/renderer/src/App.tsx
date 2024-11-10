import { useState } from "react";
import { Editor } from "./Editor";
import { FileTree } from "./FileTree";

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen grid grid-cols-2">
      <div className="overflow-auto">
        <FileTree
          rootPath="/Users/ashwin/Documents/projects/pulsar"
          onFileSelect={(file: string) => setSelectedFile(file)}
        />
      </div>
      <Editor filePath={selectedFile} />
    </div>
  );
}

export default App;
