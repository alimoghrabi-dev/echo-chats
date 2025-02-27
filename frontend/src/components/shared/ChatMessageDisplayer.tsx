import React from "react";
import { cn, formatTimeWithPeriod } from "@/lib/utils";
import { CheckCheck, Clock } from "lucide-react";

const ChatMessageDisplayer: React.FC<{
  message: IMessage;
  myId: string | undefined;
  isLastInGroup: boolean;
}> = ({ message, myId, isLastInGroup }) => {
  const isSenderMessage = message.senderId._id !== myId;

  return (
    <div
      className={cn("flex items-end gap-x-2", {
        "self-start flex-row-reverse": isSenderMessage,
        "items-end self-end": !isSenderMessage,
      })}
    >
      <div
        className={cn(
          "px-4 py-2 w-fit max-w-[450px] flex flex-col gap-y-1 rounded-xl font-medium text-[15px]",
          {
            "bg-gray-300/75 text-neutral-800 rounded-bl-none self-start items-start":
              isSenderMessage,
            "rounded-br-none bg-gradient-to-br from-primary/70 to-primary text-neutral-50 items-end":
              !isSenderMessage,
            "ml-11": !isLastInGroup && isSenderMessage,
            "mr-11": !isLastInGroup && !isSenderMessage,
          }
        )}
      >
        <span className="max-w-full break-words">{message.content}</span>
        <div
          className={cn("flex items-center gap-x-2", {
            "flex-row-reverse": isSenderMessage,
          })}
        >
          {message.isPending ? (
            <Clock
              size={15}
              className={cn("text-neutral-200", {
                "text-neutral-600": isSenderMessage,
              })}
            />
          ) : (
            <CheckCheck
              size={16}
              className={cn("text-neutral-200", {
                "text-neutral-500": isSenderMessage,
              })}
            />
          )}
          <p className="text-xs font-normal">
            {formatTimeWithPeriod(new Date(message.createdAt))}
          </p>
        </div>
      </div>
      {isLastInGroup && (
        <div
          className={cn(
            "size-9 rounded-full flex items-center justify-center font-semibold text-sm uppercase",
            {
              "bg-gradient-to-br from-primary/60 to-primary/90 text-neutral-50":
                !isSenderMessage,
              "bg-gray-300 text-neutral-700": isSenderMessage,
            }
          )}
        >
          {`${message.senderId.firstName?.charAt(
            0
          )}${message.senderId.lastName?.charAt(0)}`}
        </div>
      )}
    </div>
  );
};

export default ChatMessageDisplayer;
