import React from "react";
import SearchInputQuery from "./SearchInputQuery";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import ShowFriendRequests from "./ShowFriendRequests";
import FriendSideChatDisplayer from "./FriendSideChatDisplayer";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getUserChats } from "@/lib/actions";

const ChatsSidebar: React.FC<{
  userId: string | undefined;
  friendRequests: IUser[] | [] | undefined;
  onlineUsers: string[];
  isFriendRequestsShown?: boolean;
}> = ({
  userId,
  friendRequests,
  onlineUsers,
  isFriendRequestsShown = false,
}) => {
  const { data: chats, isPending } = useQuery({
    queryKey: ["CHATS"],
    queryFn: async () => await getUserChats(),
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
  });

  return (
    <div className="w-[375px] h-full hidden md:block">
      <div className="w-full flex items-center gap-x-1.5">
        <SearchInputQuery />
        {isFriendRequestsShown && (
          <ShowFriendRequests friendRequests={friendRequests} />
        )}
      </div>
      {isPending ? (
        <div className="w-full flex flex-col gap-y-3 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full rounded-xl flex items-start gap-x-2 border border-neutral-200/70 p-2"
            >
              <Skeleton className="size-14 rounded-full" />
              <div className="flex flex-col gap-y-2 mt-2">
                <Skeleton className="w-24 h-3 rounded-full" />
                <Skeleton className="w-16 h-3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !chats || chats.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center gap-y-2 px-2 pt-36">
          <MessageCircle size={48} className="text-neutral-500" />
          <p className="text-neutral-700 font-medium text-sm text-center break-words">
            Your inbox is empty. Connect with a friend and start chatting!
          </p>
          <Link
            to="/community"
            className="bg-primary px-4 py-2 rounded-md text-neutral-50 font-medium text-sm hover:opacity-85 transition duration-200"
          >
            Find Friends
          </Link>
        </div>
      ) : (
        <ScrollArea className="w-full max-h-full mt-4">
          <div className="w-full flex flex-col gap-y-2">
            {chats.map((chat: IOverridedChat) => (
              <FriendSideChatDisplayer
                key={chat.chat._id}
                chatId={chat.chat._id}
                lastMessage={chat.chat.lastMessage}
                friendProfilePicture={chat.friend.profilePicture}
                friendId={chat.friend._id}
                friendFirstName={chat.friend.firstName}
                friendLastName={chat.friend.lastName}
                unreadMessages={
                  chat.chat?.unreadCounts?.[userId as string] || 0
                }
                onlineUsers={onlineUsers}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ChatsSidebar;
