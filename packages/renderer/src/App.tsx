import { versions } from "@pulsar/preload";

function App() {
  return (
    <div className="rounded-xl bg-gray-800 p-4 m-4 border-2 border-gray-600">
      <code>{JSON.stringify(versions, null, 2)}</code>
    </div>
  );
}

export default App;
