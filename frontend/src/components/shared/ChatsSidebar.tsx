import React from "react";
import SearchInputQuery from "./SearchInputQuery";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import ShowFriendRequests from "./ShowFriendRequests";
import FriendSideChatDisplayer from "./FriendSideChatDisplayer";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

const ChatsSidebar: React.FC<{
  isRefetchingFriends: boolean;
  friends: IUser[] | [] | undefined;
  friendRequests: IUser[] | [] | undefined;
  onlineUsers: string[];
  isFriendRequestsShown?: boolean;
}> = ({
  isRefetchingFriends,
  friends,
  friendRequests,
  onlineUsers,
  isFriendRequestsShown = false,
}) => {
  return (
    <div className="w-[375px] h-full hidden md:block">
      <div className="w-full flex items-center gap-x-1.5">
        <SearchInputQuery />
        {isFriendRequestsShown && (
          <ShowFriendRequests friendRequests={friendRequests} />
        )}
      </div>
      {isRefetchingFriends ? (
        <div className="w-full flex flex-col gap-y-3 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full rounded-xl h-[75px] bg-neutral-200"
            />
          ))}
        </div>
      ) : !friends || friends.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center gap-y-3 px-2 pt-36">
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
        <ScrollArea className="w-full max-h-full flex flex-col gap-y-3 mt-4">
          {friends.map((friend) => (
            <FriendSideChatDisplayer
              key={friend._id}
              friendId={friend._id}
              friendFirstName={friend.firstName}
              friendLastName={friend.lastName}
              friendUsername={friend.username}
              onlineUsers={onlineUsers}
            />
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

export default ChatsSidebar;
