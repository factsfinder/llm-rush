import { useAppContext } from "./context";
import ModelsDropdown from "./ModelsDropdown";
import ChatScreen from "./Chat";
import Loading from "./Loading";

function App() {
  const { state } = useAppContext();
  return (
    <div className="bg-white py-8 w-screen h-screen">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row-reverse items-center justify-between py-4">
          <h1 className="font-extrabold text-2xl mx-auto text-black">
            LLM Rush
          </h1>
          {!!state.engine && <ModelsDropdown />}
        </div>

        <ChatScreen />
      </div>
      {state.loading && <Loading />}
    </div>
  );
}

export default App;
