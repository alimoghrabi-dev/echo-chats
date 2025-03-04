import React from "react";
import ChatsSidebar from "../shared/ChatsSidebar";
import { useAuth } from "@/context/useAuth";
import { Outlet } from "react-router";

const ChatsLayout: React.FC = () => {
  const { user, onlineUsers } = useAuth();

  return (
    <section className="w-full h-full flex gap-x-8">
      <ChatsSidebar
        userId={user?._id}
        friendRequests={user?.friendRequests}
        onlineUsers={onlineUsers}
        isFriendRequestsShown
      />
      <div className="h-full w-full ml-auto">
        <Outlet />
      </div>
    </section>
  );
};

export default ChatsLayout;
