import React from "react";
import { cn, formatTimeWithPeriod } from "@/lib/utils";
import { CheckCheck, Clock } from "lucide-react";
import Image from "./Image";

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
        <div className="flex flex-col gap-y-2">
          {message.content && (
            <span className="max-w-full break-words">{message.content}</span>
          )}
          {message.image && (
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative select-none w-[250px] h-[300px] md:w-[300px] md:h-[350px] xl:w-[350px] xl:h-[400px] bg-neutral-300 rounded-xl bg-transparent"
            >
              <Image
                src={message.image}
                alt="image"
                className="w-full h-full object-contain rounded-xl"
                loadingClassName="bg-transparent"
                loaderColor={
                  isSenderMessage ? "text-neutral-800" : "text-neutral-100"
                }
                contain
              />
            </div>
          )}
        </div>
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
        <div className="size-9 relative rounded-full">
          {message.senderId.profilePicture ? (
            <Image
              src={message.senderId.profilePicture}
              alt={`${message.senderId.firstName}'s profile`}
              className="w-full h-full object-cover rounded-full"
              loadingClassName={cn(
                "w-full h-full rounded-full shadow backdrop-blur-lg",
                {
                  "bg-gradient-to-br from-primary/40 to-primary/75":
                    !isSenderMessage,
                }
              )}
              loaderColor={cn("text-neutral-800/60 size-5", {
                "text-neutral-200": !isSenderMessage,
              })}
            />
          ) : (
            <div
              className={cn(
                "w-full h-full rounded-full flex items-center justify-center font-semibold text-sm uppercase",
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
      )}
    </div>
  );
};

export default ChatMessageDisplayer;
