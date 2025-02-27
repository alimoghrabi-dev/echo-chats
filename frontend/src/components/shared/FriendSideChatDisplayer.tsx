import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router";
import { getUnreadMessages } from "@/lib/actions";
import { cn } from "@/lib/utils";

const FriendSideChatDisplayer: React.FC<{
  friendId: string;
  friendFirstName: string;
  friendLastName: string;
  friendUsername: string;
  onlineUsers: string[];
}> = ({
  friendId,
  friendFirstName,
  friendLastName,
  friendUsername,
  onlineUsers,
}) => {
  const location = useLocation();

  const isRouteActive = location.pathname === `/chat/${friendId}`;

  const isFriendOnline = onlineUsers.includes(friendId);

  const { data: unreadMessages } = useQuery({
    queryKey: ["UNREAD_MESSAGES", friendId],
    queryFn: async () => await getUnreadMessages(friendId),
    enabled: !!friendId && !isRouteActive,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });

  return (
    <Link
      to={`/chat/${friendId}`}
      className={cn(
        "w-full flex items-center justify-between gap-x-2 rounded-xl p-2 hover:bg-primary/5 transition-all",
        {
          "bg-primary/15 cursor-default hover:bg-primary/15": isRouteActive,
        }
      )}
    >
      <div className="flex items-start gap-x-2">
        <div className="size-14 relative bg-foreground rounded-full uppercase flex items-center justify-center flex-shrink-0 text-neutral-50 font-semibold text-lg">
          {`${friendFirstName.charAt(0)}${friendLastName.charAt(0)}`}

          {isFriendOnline ? (
            <div className="rounded-full size-4 bg-green-500 absolute bottom-0.5 right-0.5 ring-2 ring-neutral-50" />
          ) : (
            <div className="rounded-full size-4 bg-neutral-400 absolute bottom-0.5 right-0.5 ring-2 ring-neutral-50" />
          )}
        </div>
        <div className="flex flex-col gap-y-0.5">
          <p className="capitalize text-neutral-800 font-medium text-base line-clamp-1">{`${friendFirstName} ${friendLastName}`}</p>
          <p className="text-neutral-700 font-medium text-sm line-clamp-1">
            {friendUsername}
          </p>
        </div>
      </div>
      {unreadMessages > 0 && location.pathname !== `/chat/${friendId}` ? (
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
