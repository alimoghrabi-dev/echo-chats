import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, Loader2, RefreshCw, Send } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ChatMessageDisplayer from "@/components/shared/ChatMessageDisplayer";
import { cn, sanitizeInput } from "@/lib/utils";
import { getSelectedChat, markChatMessagesAsRead } from "@/lib/actions";
import { ServerEndpoint } from "@/lib/serverEndpoint";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router";
import { debounce } from "lodash";
import { useAuth } from "@/context/useAuth";
import { socket } from "@/components/providers/AuthProvider";
import { toast } from "react-toastify";
import { NotificationSound } from "@/assets/assets";

const audio = new Audio(NotificationSound);
audio.volume = 0.5;

const ChatPage: React.FC = () => {
  const { user, onlineUsers } = useAuth();
  const { chatId } = useParams();

  const [message, setMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: chat,
    isPending,
    isRefetching,
    error,
    refetch,
    isSuccess,
  } = useQuery<IChat>({
    queryKey: ["CHAT", chatId],
    queryFn: async () => {
      const response = await getSelectedChat(chatId);

      if (response) {
        setMessages(response.messages);
      }

      return response;
    },
    refetchOnWindowFocus: false,
    enabled: !!chatId,
  });

  const friend = useMemo(
    () => chat?.participants?.find((p) => p._id !== user?._id),
    [chat?.participants, user?._id]
  );

  const isFriendOnline = useMemo(
    () => onlineUsers.includes(friend?._id as string),
    [onlineUsers, friend?._id]
  );

  const { mutate: sendMessageMutation, isPending: isSendingMessage } =
    useMutation({
      mutationFn: async (newMessage: string) => {
        if (!chat || !user) return;

        const response = await ServerEndpoint.post(
          `/chat/send-message/${chat._id}`,
          { message: newMessage },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status !== 201) {
          throw new Error("Failed to send message");
        }

        return response.data;
      },
      onMutate: (newMessage) => {
        setMessage("");

        const tempMessage = {
          _id: `temp-${Date.now()}`,
          senderId: user as IUser,
          content: newMessage,
          isPending: true,
          createdAt: new Date(),
        };

        setMessages(
          (prevMessages) => [...prevMessages, tempMessage] as IMessage[]
        );

        setTimeout(scrollToBottom, 50);

        return tempMessage._id;
      },
      onSuccess: (newMessage, _, tempMessageId) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempMessageId ? newMessage : msg
          )
        );

        setTimeout(scrollToBottom, 50);
      },
      onError: (_, __, tempMessageId) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== tempMessageId)
        );

        toast.error("Failed to send message, please try again.");
      },
    });

  const { mutate: markMessagesAsReadMutation } = useMutation({
    mutationFn: async () => {
      await markChatMessagesAsRead(chat?._id);
    },
    onError: () => {
      toast.error("Failed to mark messages as read!");
    },
  });

  const sendMessage = debounce((msg) => {
    if (!msg?.trim()) return;
    sendMessageMutation(msg);
  }, 100);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleNewMessage = useCallback(
    (data: IMessage) => {
      if (data.senderId._id === friend?._id) {
        setMessages((prev) => [...prev, data]);
        setTimeout(scrollToBottom, 50);

        if (!document.hidden) {
          audio.play().catch(() => console.log("Audio play failed"));
        }

        if (
          messagesEndRef.current &&
          messagesEndRef.current.getBoundingClientRect().top <
            window.innerHeight
        ) {
          setTimeout(scrollToBottom, 50);
        }
      }
    },
    [friend?._id]
  );

  useEffect(() => {
    if (isSuccess || messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isSuccess, messages]);

  useEffect(() => {
    if (!socket) return;

    socket.off("newMessage", handleNewMessage);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [handleNewMessage]);

  useEffect(() => {
    if (!chat || !user || !messages.length) return;

    const lastMessage = messages[messages.length - 1];
    const isUnread =
      lastMessage &&
      lastMessage.senderId._id === friend?._id &&
      !lastMessage.isRead;

    if (isUnread) {
      markMessagesAsReadMutation();
    }
  }, [messages, chat, user, friend?._id, markMessagesAsReadMutation]);

  useEffect(() => {
    if (!isPending) {
      document.title = `Chat with ${friend?.firstName} ${friend?.lastName}`;
    }
  }, [friend?.firstName, friend?.lastName, isPending]);

  if (isPending || isRefetching) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-y-8 bg-gradient-to-br from-neutral-50 to-primary/15 rounded-xl">
        <div className="relative w-24 h-24 flex items-center justify-center bg-white/20 backdrop-blur-xl rounded-full shadow-xl">
          <Loader2 className="h-10 w-10 text-neutral-700 dark:text-gray-300 animate-spin" />
        </div>
        <p className="text-lg font-semibold text-neutral-700 animate-pulse">
          Preparing your chat...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-y-6 bg-gradient-to-br from-neutral-50 to-red-500/15 rounded-xl">
        <div className="flex items-center justify-center p-4 rounded-full bg-red-100 shadow-md animate-pulse">
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-gray-600 dark:text-neutral-400 text-center px-6">
          We couldn't load the data. Please check your connection or try again.
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 text-white font-medium rounded-lg transition-all shadow-md"
        >
          <RefreshCw className="w-5 h-5 animate-spin" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="w-full h-full bg-gradient-to-br from-neutral-50 to-primary/15 rounded-xl p-2 sm:p-4">
      <div className="relative w-full h-full flex flex-col gap-y-4 overflow-hidden">
        <div className="w-full px-4 flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-y-0.5">
            <p className="text-3xl font-medium text-neutral-800 capitalize">
              {`${friend?.firstName} ${friend?.lastName}`}
            </p>
            <div className="flex items-center gap-x-1.5">
              {isFriendOnline ? (
                <div className="rounded-full size-4 bg-green-500 ring-2 ring-neutral-50" />
              ) : (
                <div className="rounded-full size-4 bg-neutral-400 ring-2 ring-neutral-50" />
              )}
              <p
                className={cn(
                  "text-neutral-500 font-medium tracking-wide text-base",
                  { "text-green-500": isFriendOnline }
                )}
              >
                {isFriendOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        <ScrollArea className="w-full h-full px-2 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neutral-400/10 rounded-t-lg to-transparent pointer-events-none z-20" />
          {!messages || messages.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center h-[300px] text-center">
              <span className="text-6xl">💬</span>
              <p className="text-lg text-neutral-600 mt-4">
                No messages yet...
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-y-4 mt-4 px-2">
              {messages?.map((message: IMessage, index: number) => {
                const nextMessage = messages[index + 1];
                const isLastInGroup =
                  !nextMessage ||
                  nextMessage.senderId._id !== message.senderId._id;

                return (
                  <ChatMessageDisplayer
                    key={message._id}
                    message={message}
                    myId={user?._id}
                    isLastInGroup={isLastInGroup}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 rounded-b-lg to-transparent pointer-events-none z-20" />
        </ScrollArea>
        <div className="sticky bottom-0 inset-x-0 w-full flex items-center gap-x-2 bg-primary/15 rounded-md h-12 px-4 hover:bg-primary/20 transition-all">
          <input
            type="text"
            value={sanitizeInput(message || "")}
            onChange={(e) => setMessage(sanitizeInput(e.target.value))}
            onKeyDown={(e) => {
              if (isSendingMessage) return;

              if (e.key === "Enter") {
                sendMessage(message);
              }
            }}
            autoComplete="off"
            placeholder="Your message"
            className="w-full h-full outline-none bg-transparent text-neutral-800 placeholder:text-neutral-700 font-normal"
          />
          <button
            type="button"
            disabled={!message || isSendingMessage}
            onClick={() => sendMessage(message)}
            className="text-neutral-700 hover:opacity-80 transition-all disabled:opacity-40"
          >
            {isSendingMessage ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={23} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
