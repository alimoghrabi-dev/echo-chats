import { z } from "zod";
import {
  editUserProfileValidationSchema,
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "./validators";
import axios from "axios";
import { ServerEndpoint } from "./serverEndpoint";

export const userLogin = async (
  data: z.infer<typeof loginUserValidationSchema>
) => {
  try {
    const { identifier, password } = data;

    const response = await ServerEndpoint.post(
      "/auth/login",
      {
        identifier,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data || "Something went wrong while loggin in!");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const registerUser = async (
  data: z.infer<typeof registerUserValidationSchema>
) => {
  try {
    const { firstName, lastName, username, email, password, confirmPassword } =
      data;

    const response = await ServerEndpoint.post(
      "/auth/register",
      {
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(
        response.data || "Something went wrong while creating your account!"
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const logoutUser = async () => {
  try {
    const response = await ServerEndpoint.post(
      "/auth/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        response.data ||
          "Something went wrong while logging out from your account!"
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getCommunityUsers = async (query: string) => {
  try {
    const response = await ServerEndpoint.post(
      "/community/users-queried",
      {},
      {
        params: {
          query,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const sendFriendRequest = async (
  requestedTo: string | undefined,
  requestedFrom: string | undefined
) => {
  try {
    const response = await ServerEndpoint.post(
      "/community/send-friend-request",
      {
        requestedTo,
        requestedFrom,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const acceptOrDenyFriendRequest = async (data: {
  requestSenderId: string;
  status: string;
}) => {
  try {
    const { requestSenderId, status } = data;

    const response = await ServerEndpoint.patch(
      "/community/accept-deny-friend-request",
      {
        requestSenderId,
        status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getUserChats = async () => {
  try {
    const response = await ServerEndpoint.post("/chat/get-user-chats");

    if (response.status !== 200) {
      throw new Error(response.data);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getSelectedChat = async (
  chatId: string | undefined,
  signal?: AbortSignal
) => {
  try {
    const response = await ServerEndpoint.post(
      `/chat/get-chat-by-id/${chatId}`,
      {},
      { signal }
    );

    if (response.status !== 200) {
      throw new Error(response.data);
    }

    return {
      chat: response.data.chat,
      messages: response.data.chatMessages || [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }

    throw error;
  }
};

export const markChatMessagesAsRead = async (chatId: string | undefined) => {
  try {
    const response = await ServerEndpoint.patch(
      `/chat/mark-message-as-read/${chatId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(response.data || "Something went wrong");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getUnreadMessages = async (friendId: string | undefined) => {
  try {
    const response = await ServerEndpoint.post(
      `/chat/get-unread-messages/${friendId}`
    );

    if (response.status !== 200) {
      throw new Error(response.data || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const getUserById = async (profileId: string | undefined) => {
  try {
    const response = await ServerEndpoint.post(
      `/user/get-user-by-id/${profileId}`
    );

    if (response.status !== 200) {
      throw new Error(response.data || "Something went wrong");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};

export const updateUserProfile = async (
  profileId: string | undefined,
  data: z.infer<typeof editUserProfileValidationSchema>
) => {
  try {
    const { profilePicture, firstName, lastName, username, description } = data;

    const formData = new FormData();

    if (profilePicture && typeof profilePicture !== "string") {
      formData.append("profilePicture", profilePicture);
    }

    if (firstName) formData.append("firstName", firstName);
    if (lastName) formData.append("lastName", lastName);
    if (username) formData.append("username", username);
    if (description) formData.append("description", description);

    const response = await ServerEndpoint.patch(
      `/user/edit-user/${profileId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error(response.data || "Something went wrong");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong");
    } else if (error instanceof Error) {
      throw new Error("Something went wrong");
    }
  }
};
