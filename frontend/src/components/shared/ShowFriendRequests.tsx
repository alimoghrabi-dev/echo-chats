import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RiUserSettingsFill } from "react-icons/ri";
import { ScrollArea } from "../ui/scroll-area";
import { FaCheck, FaFaceFrown } from "react-icons/fa6";
import { Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { acceptOrDenyFriendRequest } from "@/lib/actions";

const ShowFriendRequests: React.FC<{
  friendRequests: IUser[] | [] | undefined;
}> = ({ friendRequests }) => {
  const queryClient = useQueryClient();

  const { mutate: acceptOrDenyMutation, isPending } = useMutation({
    mutationFn: async (data: { requestSenderId: string; status: string }) => {
      await acceptOrDenyFriendRequest(data);

      return {
        status: data.status,
      };
    },
    onSuccess: ({ status }) => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_STATUS"],
      });

      toast.success(
        `Friend Request have been ${
          status === "accept" ? "Accepted" : "Rejected"
        }`
      );
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong, try again");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="min-w-8 flex items-center justify-center relative hover:opacity-80 transition duration-200">
          <RiUserSettingsFill
            size={25}
            className=" text-neutral-700 cursor-pointer"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-[90%] sm:max-w-md md:max-w-lg outline-none rounded-md"
      >
        <DialogHeader>
          <DialogTitle>Your Current Friend Requests</DialogTitle>
        </DialogHeader>
        <hr />
        <ScrollArea className="w-full flex flex-col gap-y-4">
          {!friendRequests || friendRequests.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center gap-y-4 py-8">
              <FaFaceFrown size={48} className="text-neutral-700" />
              <p className="text-neutral-800 font-medium text-sm text-center break-words">
                {"You Don't Have any Friend Requests Yet!"}
              </p>
            </div>
          ) : (
            friendRequests.map((friend) => (
              <div
                key={friend._id}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-gradient-to-r from-neutral-100 to-primary/20 shadow-lg transform transition-all hover:shadow-xl"
              >
                <div className="flex items-center justify-between gap-x-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">
                      {friend.email}
                    </span>
                    <span className="text-sm text-gray-800 font-semibold">
                      Friend Request From {friend.username}
                    </span>
                  </div>
                  {isPending ? (
                    <Loader2 size={21} className="animate-spin" />
                  ) : (
                    <div className="flex gap-x-2">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          acceptOrDenyMutation({
                            requestSenderId: friend._id,
                            status: "accept",
                          })
                        }
                        className="size-7 flex items-center justify-center rounded-md bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-300"
                      >
                        <FaCheck size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          acceptOrDenyMutation({
                            requestSenderId: friend._id,
                            status: "reject",
                          })
                        }
                        className="size-7 flex items-center justify-center rounded-md bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ShowFriendRequests;
