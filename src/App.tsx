import Dropdown from "./Dropdown";

function App() {
  return (
    <div className=" bg-white text-black py-8 w-screen h-screen">
      <div className="container mx-auto">
        <h1 className="font-bold text-2xl text-center">LLM Rush</h1>

        <Dropdown />
      </div>
    </div>
  );
}

export default App;
