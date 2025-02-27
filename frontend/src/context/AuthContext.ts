import { createContext } from "react";

type AuthTypes = {
  user: IUser | null;
  isPending: boolean;
  isRefetching: boolean;
  onlineUsers: string[];
};

export const AuthContext = createContext<AuthTypes | null>(null);
