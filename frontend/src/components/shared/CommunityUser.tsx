import React from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { sendFriendRequest } from "@/lib/actions";
import { toast } from "react-toastify";
import { Link } from "react-router";
import Image from "./Image";

const CommunityUser: React.FC<{
  SignedInUser: IUser | null;
  user: IUser;
}> = ({ SignedInUser, user }) => {
  const { mutate: handleFriendRequestMutation, isPending } = useMutation({
    mutationFn: async (requestedTo: string | undefined) => {
      await sendFriendRequest(requestedTo, SignedInUser?._id);
    },
    onSuccess: () => {
      if (SignedInUser) {
        (user.friendRequests as unknown as string[]).push(SignedInUser._id);
      }

      toast.success("Friend request sent successfully!");
    },
    onError: () => {
      toast.error("Something went wrong, try again");
    },
  });

  const isFriend = SignedInUser?.friends?.some(
    (friend) => friend?._id === user?._id
  );
  const isInRequests = SignedInUser?.friendRequests?.some(
    (friend) => friend?._id === user?._id
  );
  const isInFriendRequests = user?.friendRequests?.some(
    (request) => request?.toString() === SignedInUser?._id?.toString()
  );

  return (
    <Link
      to={`/profile/${user._id}`}
      className="w-full p-4 shadow rounded-xl border flex flex-col items-center justify-center gap-y-0.5 hover:bg-neutral-100 transition"
    >
      <div className="relative size-16 mb-1 rounded-full flex-shrink-0">
        {user?.profilePicture ? (
          <Image
            src={user?.profilePicture}
            alt={`${user?.firstName}'s profile`}
            className="w-full h-full object-cover rounded-full"
            loadingClassName="w-full h-full rounded-full border border-neutral-300 bg-neutral-200/20 backdrop-blur-lg"
            loaderColor="text-neutral-800/60 size-5"
          />
        ) : (
          <div className="w-full h-full bg-foreground rounded-full uppercase flex items-center justify-center text-neutral-50 font-semibold text-lg">
            {user?.firstName.charAt(0) + user?.lastName.charAt(0)}
          </div>
        )}
      </div>
      <p className="text-[15px] capitalize font-semibold text-neutral-800 line-clamp-1">
        {user?.firstName} {user?.lastName}
      </p>
      <p className="text-sm font-medium text-neutral-700 line-clamp-1">
        {user?.username}
      </p>
      <Button
        type="button"
        disabled={isPending || isFriend || isInRequests || isInFriendRequests}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFriendRequestMutation(user?._id);
        }}
        className="mt-2 rounded-xl text-[15px] font-medium bg-gradient-to-br from-primary/70 to-primary"
      >
        {isInRequests || isInFriendRequests
          ? "Pending..."
          : isFriend
          ? "Already Friends"
          : "Send Request"}
      </Button>
    </Link>
  );
};

export default CommunityUser;
