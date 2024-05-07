import { useAppContext } from "./context";
import ModelsDropdown from "./ModelsDropdown";
import ChatScreen from "./Chat";

function App() {
  const { state } = useAppContext();
  const { loadingModelProgress, answer } = state;

  return (
    <div className="bg-white py-8 w-screen h-screen">
      <div className="container mx-auto">
        <div className="relative flex flex-row items-center justify-center py-4">
          <div className="absolute left-0">
            <ModelsDropdown />
          </div>
          <h1 className="font-extrabold text-2xl text-black">LLM Rush</h1>
        </div>

        {loadingModelProgress != null &&
          loadingModelProgress?.progress != 1 && (
            <div className="flex flex-col gap-2 justify-center">
              <p className="text-primary">{loadingModelProgress.text}</p>

              <progress
                className="progress progress-primary w-56"
                value={`${loadingModelProgress.progress * 100}`}
                max="100"
              ></progress>
            </div>
          )}

        <ChatScreen />

        <div className="py-4">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
