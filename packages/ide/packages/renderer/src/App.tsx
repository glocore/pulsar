import { sha256sum, versions } from "#preload";
import { useMemo, useState } from "react";

function App() {
  const [text, setText] = useState("Hello world");

  const hashedText = useMemo(() => sha256sum(text), [text]);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
      <br />
      <br />
      <input value={text} onChange={(e) => setText(e.target.value)} />
      Hashed: {hashedText}
      <hr />
      <br />
      <br />
      Versions:
      <ul>
        {Object.entries(versions).map(([lib, version], index) => (
          <li key={index}>
            {lib}: {version}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
