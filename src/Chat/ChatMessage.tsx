import { message } from "../constants";

function ChatMessage(props: {
  msg: message;
  streamingDivId: string | null | undefined;
  streamingTextId: string | null | undefined;
}) {
  const { msg, streamingDivId, streamingTextId } = props;
  const { id, role, text } = msg;
  return (
    <div
      id={streamingDivId ?? `msg-${id}`}
      className={streamingDivId ? "hidden p-3 rounded-lg" : "p-3 rounded-lg "}
    >
      <div
        className={
          role === "assistant"
            ? "flex flex-row items-center"
            : "flex items-center justify-start flex-row-reverse"
        }
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 flex-shrink-0 px-1">
          {role === "assistant" ? "AI" : "U"}
        </div>
        <div
          id={streamingTextId ?? `msg-${id}-text`}
          className="relative mx-3 text-sm text-black break-words bg-white py-2 px-4 shadow-inner rounded-xl"
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
