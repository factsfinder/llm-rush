import { useRef } from "react";
import useWebLLM from "../hooks/useWebLLM";
import { actionTypes, useAppContext } from "../context";
import useIndexedDB from "../hooks/useIndexedDB";

function ChatFooter() {
  const inputRef = useRef<any>();

  const { state, dispatch } = useAppContext();
  const { db, engine } = state;

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

  return (
    <div className="flex flex-row items-center gap-2 h-16 rounded-xl w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder={
          engine
            ? "Please Enter Your Query"
            : "Please Select the AI Model to Chat"
        }
        className="input input-md flex w-full text-white border rounded-xl"
      />

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
  );
}

export default ChatFooter;
