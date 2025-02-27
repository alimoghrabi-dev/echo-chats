import React, { Fragment, useEffect, useState } from "react";
import { Menu, MessageCircle, MessageCircleMore } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link, useLocation } from "react-router";
import { ScrollArea } from "../ui/scroll-area";
import { sideLinks } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { TbLogout2 } from "react-icons/tb";
import SearchInputQuery from "../shared/SearchInputQuery";
import ShowFriendRequests from "../shared/ShowFriendRequests";
import { useAuth } from "@/context/useAuth";
import FriendSideChatDisplayer from "../shared/FriendSideChatDisplayer";

const Navbar: React.FC = () => {
  const { user, onlineUsers, isRefetching: isRefetchingFriends } = useAuth();

  const location = useLocation();

  const friends = user?.friends;
  const friendRequests = user?.friendRequests;

  const [open, setOpen] = useState<boolean>(false);
  const [chatsOpen, setChatsOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(false);
    setChatsOpen(false);
  }, [location.pathname]);

  return (
    <div className="w-full flex lg:hidden h-[52px] px-4 bg-foreground/85 backdrop-blur-sm z-50">
      <div className="w-full h-full flex items-center justify-between gap-x-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Menu
              size={28}
              className="text-neutral-50 cursor-pointer hover:text-neutral-400 transition"
            />
          </SheetTrigger>
          <SheetContent
            aria-describedby={undefined}
            side="left"
            className="outline-none w-36 p-0 pr-1 border-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-between gap-y-8 pt-14 pb-0">
              <Link to="/" className="text-neutral-800">
                LOGO
              </Link>
              <ScrollArea className="w-full max-h-[55vh] p-4">
                <div className="w-full flex flex-col gap-y-1.5">
                  {sideLinks.map((link, index) => {
                    const isActive = location.pathname === link.href;

                    return (
                      <Fragment key={index}>
                        <Link
                          to={link.href}
                          className={cn(
                            "w-full text-neutral-600 h-[80px] px-2 rounded-xl hover:bg-neutral-200 flex flex-col items-center justify-center gap-y-2 transition-all",
                            {
                              "cursor-default bg-neutral-300/70 hover:bg-neutral-300/70":
                                isActive,
                            }
                          )}
                        >
                          <link.icon size={24} />
                          <span className="text-sm font-normal text-center">
                            {link.label}
                          </span>
                        </Link>
                        {index === sideLinks.length - 3 && (
                          <div className="w-full h-px bg-neutral-300/60" />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="w-full p-4">
                <button
                  type="button"
                  className="w-full text-neutral-600 h-24 rounded-xl hover:bg-neutral-200 flex flex-col items-center justify-center gap-y-2 transition-all"
                >
                  <TbLogout2 size={27} />
                  <span className="text-sm font-normal text-center">
                    Log out
                  </span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet open={chatsOpen} onOpenChange={setChatsOpen}>
          <SheetTrigger asChild>
            <MessageCircleMore
              size={28}
              className="text-neutral-50 cursor-pointer hover:text-neutral-400 transition"
            />
          </SheetTrigger>
          <SheetContent
            aria-describedby={undefined}
            side="left"
            className="outline-none border-none pt-12"
          >
            <div className="w-full h-full">
              <div className="w-full flex items-center gap-x-1.5">
                <SearchInputQuery />

                <ShowFriendRequests friendRequests={friendRequests} />
              </div>
              {isRefetchingFriends ? (
                <div></div>
              ) : !friends || friends.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center gap-y-3 px-2 pt-36">
                  <MessageCircle size={48} className="text-neutral-500" />
                  <p className="text-neutral-700 font-medium text-sm text-center break-words">
                    Your inbox is empty. Connect with a friend and start
                    chatting!
                  </p>
                  <Link
                    to="/community"
                    className="bg-primary px-4 py-2 rounded-md text-neutral-50 font-medium text-sm hover:opacity-85 transition duration-200"
                  >
                    Find Friends
                  </Link>
                </div>
              ) : (
                <ScrollArea className="w-full max-h-full flex flex-col gap-y-4 mt-4">
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
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
