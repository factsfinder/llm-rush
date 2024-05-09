import { useEffect, useRef } from "react";
import useWebLLM from "./hooks/useWebLLM";
import { actionTypes, useAppContext } from "./context";
import useIndexedDB from "./hooks/useIndexedDB";
import { message } from "./constants";
import ModelsDropdown from "./ModelsDropdown";

function ChatScreen() {
  const inputRef = useRef<any>();

  const { state, dispatch } = useAppContext();
  const { db, engine, messages } = state;

  const lastMsg = messages[messages.length - 1];

  const { stream } = useWebLLM();

  const { transactAdd } = useIndexedDB();

  const handleSendMessage = async () => {
    if (inputRef?.current != null) {
      const msg = inputRef.current.value;

      if (msg.length > 0 && engine != null && db != null) {
        const userMsgData = { text: msg, role: "user" };
        transactAdd(
          db,
          "messages",
          userMsgData,
          (result) => {
            dispatch({
              type: actionTypes.ADD_MESSAGE,
              payload: { ...userMsgData, id: result },
            });
            inputRef.current.value = "";
          },
          (error) => {
            console.log("Error while adding the msg to indexed db: ", error);
          }
        );
        const streamElem = document.getElementById("streamingMsg");
        if (streamElem != null) {
          streamElem.classList.remove("hidden");
        }
        const streamMsgElemText = document.getElementById("streamingMsgText");
        const sendBtnElement = document.getElementById("sendBtn");
        sendBtnElement?.setAttribute("disabled", "true");

        const fullAIResponse = await stream(engine, msg, (msg) => {
          if (streamElem != null && streamMsgElemText != null) {
            streamElem.scrollIntoView();
            streamMsgElemText.innerText = msg;
          }
        });
        const aiMsgData = { text: fullAIResponse, role: "assistant" };
        transactAdd(
          db,
          "messages",
          aiMsgData,
          (result) => {
            dispatch({
              type: actionTypes.ADD_MESSAGE,
              payload: { ...aiMsgData, id: result },
            });
          },
          (error) => {
            console.log("Error while adding the msg to indexed db: ", error);
          }
        );

        if (streamElem != null && streamMsgElemText != null) {
          streamMsgElemText.innerText = "";
          streamElem.classList.add("hidden");
        }
        sendBtnElement?.removeAttribute("disabled");
      }
    }
  };

  useEffect(() => {
    document.getElementById(`msg-${lastMsg?.id}`)?.scrollIntoView();
  }, [lastMsg]);

  function LoadingProgress() {
    return (
      <div
        id="loadingProgress"
        className="flex flex-col gap-2 justify-center max-w-[500px] py-2"
      >
        <p id="loadingProgressText" className="text-primary text-center"></p>
        <progress
          id="loadingProgressBar"
          className="hidden progress progress-primary w-56 mx-auto"
          max="100"
        ></progress>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-auto min-h-2xl h-full py-6">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl shadow-2xl bg-gray-100 h-full p-4">
        <div className="flex flex-col h-full overflow-x-auto overflow-y-auto mb-4">
          <div className="flex flex-col max-h-[40rem] h-full">
            <div className="space-y-2">
              {messages.map(({ text, role, id }: message) => {
                return (
                  <div id={`msg-${id}`} key={id} className="p-3 rounded-lg">
                    <div
                      className={
                        role === "assistant"
                          ? "flex flex-row items-center"
                          : "flex items-center justify-start flex-row-reverse"
                      }
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 px-2">
                        {role === "assistant" ? "AI" : "U"}
                      </div>
                      <div className="relative ml-3 mr-3 text-sm text-black prose bg-white py-2 px-4 shadow-inner rounded-xl">
                        <div>{text}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div
                id="streamingMsg"
                className="hidden col-start-1 col-end-8 p-3 rounded-lg"
              >
                <div className="flex flex-row items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 px-2">
                    AI
                  </div>
                  <div className="relative ml-3 mr-3 text-sm text-black prose bg-white py-2 px-4 shadow-inner rounded-xl">
                    <div id="streamingMsgText"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center h-16 rounded-xl w-full px-1">
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  engine
                    ? "Please Enter Your Query"
                    : "Please Select LLM to start chatting with the AI"
                }
                className="input input-md flex w-full text-white border rounded-xl"
              />
            </div>
          </div>
          {(engine || messages.length > 0) && (
            <div className="ml-4">
              <button
                id="sendBtn"
                disabled={engine == null}
                className="btn btn-md btn-primary rounded-xl text-white px-4"
                onClick={handleSendMessage}
              >
                Send
                <span className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
        {!engine && messages.length === 0 && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ModelsDropdown />
            <LoadingProgress />
          </div>
        )}
      </div>

      {!engine && messages.length > 0 && (
        <div className="absolute w-full h-full backdrop-blur-sm">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ModelsDropdown />
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatScreen;
