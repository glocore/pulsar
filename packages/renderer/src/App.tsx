import { versions } from "@pulsar/preload";

function App() {
  return (
    <>
      <code>{JSON.stringify(versions, null, 2)}</code>
    </>
  );
}

export default App;
