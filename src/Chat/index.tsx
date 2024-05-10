import { useEffect, memo } from "react";

import { useAppContext } from "../context";
import { message } from "../constants";

import ChatFooter from "./ChatFooter";
import ModelsDropdown from "../ModelsDropdown";
import LoadingProgress from "./LoadingProgress";
import ChatMessage from "./ChatMessage";

function ChatScreen() {
  const { state } = useAppContext();
  const { engine, messages } = state;

  const lastMsg = messages[messages.length - 1];

  useEffect(() => {
    document.getElementById(`msg-${lastMsg?.id}`)?.scrollIntoView();
  }, [lastMsg]);

  return (
    <div className="relative flex flex-col h-full p-4">
      {messages.length > 0 && (
        <div className=" flex flex-col max-h-[40rem] h-full overflow-auto bg-gray-100 rounded-xl p-2">
          <div className="flex flex-col gap-2">
            {messages.map((msg: message) => {
              return (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  streamingDivId={null}
                  streamingTextId={null}
                />
              );
            })}

            <ChatMessage
              msg={{
                id: 123456778899, // random cause not needed
                role: "assistant",
                text: "",
              }}
              streamingDivId="streamingMsg"
              streamingTextId="streamingMsgText"
            />
          </div>
        </div>
      )}
      <ChatFooter />

      {!engine && messages.length > 0 && (
        <div className="absolute top-0 w-full h-full backdrop-blur-sm">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ModelsDropdown />
            <LoadingProgress />
          </div>
        </div>
      )}
      {!engine && messages.length === 0 && (
        <div className="absolute top-0 w-full h-full backdrop-blur-sm">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ModelsDropdown />
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ChatScreen);
