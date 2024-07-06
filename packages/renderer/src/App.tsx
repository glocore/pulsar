import { versions } from "#preload";
function App() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
      {JSON.stringify(versions)}
    </>
  );
}

export default App;
