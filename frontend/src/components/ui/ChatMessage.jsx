import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

const ChatMessage = ({ message, isUser, timestamp }) => {
  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`flex gap-2.5 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
            ? "bg-indigo-600"
            : "bg-gradient-to-br from-violet-500 to-indigo-600"
          }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser
              ? "bg-indigo-600 text-white rounded-tr-sm"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm"
            }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message}</p>
          ) : (
            <div className="markdown-chat max-w-none [&_*]:text-inherit [&_strong]:font-semibold [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          )}
        </div>
        {time && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
