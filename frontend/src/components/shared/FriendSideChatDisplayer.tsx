import React, { Fragment } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { FaImage } from "react-icons/fa";
import Image from "./Image";

const FriendSideChatDisplayer: React.FC<{
  chatId: string;
  lastMessage: IMessage;
  friendProfilePicture: string;
  friendId: string;
  friendFirstName: string;
  friendLastName: string;
  unreadMessages: number;
  onlineUsers: string[];
}> = ({
  chatId,
  lastMessage,
  friendProfilePicture,
  friendId,
  friendFirstName,
  friendLastName,
  unreadMessages,
  onlineUsers,
}) => {
  const location = useLocation();

  const isRouteActive = location.pathname === `/chat/${chatId}`;

  const isFriendOnline = onlineUsers.includes(friendId);

  return (
    <Link
      to={`/chat/${chatId}`}
      className={cn(
        "w-full flex items-center justify-between gap-x-2 rounded-xl p-2 hover:bg-primary/5 transition-all",
        {
          "bg-primary/15 cursor-default hover:bg-primary/15": isRouteActive,
        }
      )}
    >
      <div className="flex items-start gap-x-2">
        <div className="relative size-14 rounded-full flex-shrink-0">
          {friendProfilePicture ? (
            <Image
              src={friendProfilePicture}
              alt={`${friendFirstName}'s profile`}
              className="w-full h-full object-cover rounded-full"
              loadingClassName="w-full h-full rounded-full border border-neutral-300 backdrop-blur-lg"
              loaderColor="text-neutral-800/60 size-5"
            />
          ) : (
            <div className="w-full h-full bg-foreground rounded-full uppercase flex items-center justify-center text-neutral-50 font-semibold text-lg">
              {`${friendFirstName.charAt(0)}${friendLastName.charAt(0)}`}
            </div>
          )}

          {isFriendOnline ? (
            <div className="rounded-full size-4 bg-green-500 absolute bottom-0.5 right-0.5 ring-2 ring-neutral-50" />
          ) : (
            <div className="rounded-full size-4 bg-neutral-400 absolute bottom-0.5 right-0.5 ring-2 ring-neutral-50" />
          )}
        </div>
        <div className="flex flex-col gap-y-2.5">
          <p className="capitalize text-neutral-800 font-medium text-base line-clamp-1">{`${friendFirstName} ${friendLastName}`}</p>
          {location.pathname !== `/chat/${chatId}` ? (
            lastMessage && (
              <span className="max-w-[165px] truncate text-xs font-medium text-neutral-500 flex items-center gap-x-1.5">
                {lastMessage?.content ? (
                  lastMessage.content
                ) : lastMessage?.image ? (
                  <Fragment>
                    <FaImage size={16} />
                    Image
                  </Fragment>
                ) : null}
              </span>
            )
          ) : (
            <span className="text-xs font-semibold text-primary">
              Currently Active
            </span>
          )}
        </div>
      </div>
      {unreadMessages > 0 && location.pathname !== `/chat/${chatId}` ? (
        <span className="flex-shrink-0 relative bg-red-400 font-semibold text-[14px] font-[Poppins] size-6 flex items-center justify-center rounded-full text-neutral-50">
          {unreadMessages >= 9 ? (
            <span className="flex items-start leading-none">
              <span className="text-[14px]">9</span>
              <span className="text-[12px]">+</span>
            </span>
          ) : (
            unreadMessages
          )}
        </span>
      ) : null}
    </Link>
  );
};

export default FriendSideChatDisplayer;
