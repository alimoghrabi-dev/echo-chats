interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture: string | null;
  friends: IUser[];
  description: string;
  friendRequests: IUser[];
}

interface IChat {
  _id: string;
  participants: IUser[];
  lastMessage: IMessage;
  unreadCounts: Record<string, number>;
}

interface IMessage {
  _id: string;
  chatId: IChat;
  senderId: IUser;
  content: string;
  image: string;
  isPending?: boolean;
  createdAt: Date;
}

interface IOverridedChat {
  chat: {
    _id: string;
    participants: IUser[];
    lastMessage: IMessage;
    unreadCounts: Record<string, number>;
  };
  friend: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePicture: string;
  };
}
