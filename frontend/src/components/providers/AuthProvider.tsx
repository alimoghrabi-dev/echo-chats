import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";
import { ServerEndpoint } from "@/lib/serverEndpoint";
import LoadingPage from "../shared/LoadingPage";
import { FriendRequestSound } from "@/assets/assets";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { logoutUser } from "@/lib/actions";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:3000"
    : import.meta.env.VITE_BASE_URL;

export let socket: Socket | null = null;

const audio = new Audio(FriendRequestSound);
audio.volume = 0.5;

const connectToSocket = (
  userId: string,
  setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>,
  refetch: () => void
) => {
  if (socket) {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("friendRequest");
    socket.off("newMessage");
    socket.off("onlineUsers");
  } else {
    socket = io(BASE_URL, {
      auth: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
  }

  socket.on("connect", () => {
    console.log("✅ Connected as:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected:", reason);
  });

  socket.on("friendRequest", (data) => {
    refetch();

    if (!document.hidden) {
      audio.play().catch(() => console.log("Audio play failed"));
    }

    toast.info(`${data.message} From ${data.fromUsername}`);
  });

  socket.on("newMessage", (data) => {
    const isInCurrentChat =
      window.location.pathname === `/chat/${data?.chatId}`;

    if (data) {
      if (!isInCurrentChat) {
        toast.info(
          `New Message From ${data.senderId?.firstName} ${data.senderId?.lastName}`
        );
      }
    }
  });

  socket.on("onlineUsers", (users) => {
    setOnlineUsers(users);
  });
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const fetchAuthStatus = async () => {
    try {
      const response = await ServerEndpoint.post(`/auth/status`);

      if (response.status !== 200) {
        if (response.status === 403) {
          await logoutUser();
          // display session expired dialog (TODO)
        }

        disconnectSocket();
        return null;
      }

      const data = response.data;

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unknown error:", error);
      }

      disconnectSocket();
      return null;
    }
  };

  const {
    data: user,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["AUTH_STATUS"],
    queryFn: fetchAuthStatus,
    retry: 2,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (user && !isPending && !isRefetching) {
      connectToSocket(user._id, setOnlineUsers, refetch);
    } else {
      disconnectSocket();
    }
  }, [isPending, isRefetching, refetch, user]);

  const value = useMemo(
    () => ({ user, isPending, isRefetching, onlineUsers }),
    [user, isPending, isRefetching, onlineUsers]
  );

  if (isPending) {
    return <LoadingPage />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
