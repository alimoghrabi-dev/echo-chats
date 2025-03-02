interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  friends: IUser[];
  description: string;
  friendRequests: IUser[];
}

interface IChat {
  _id: string;
  participants: IUser[];
  messages: IMessage[];
}

interface IMessage {
  _id: string;
  chatId: string;
  senderId: IUser;
  content: string;
  isPending?: boolean;
  isRead: boolean;
  createdAt: Date;
}

interface IOverridedChat {
  chat: {
    _id: string;
    participants: IUser[];
    messages: IMessage[];
  };
  friend: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePic: string;
  };
}
