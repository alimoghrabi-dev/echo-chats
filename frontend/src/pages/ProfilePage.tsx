import React, { useEffect, useState } from "react";
import { BannerBackground } from "@/assets/assets";
import { useParams } from "react-router";
import { useAuth } from "@/context/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById, sendFriendRequest } from "@/lib/actions";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, Pen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { toast } from "react-toastify";
import Image from "@/components/shared/Image";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profileId } = useParams();

  const [open, setOpen] = useState<boolean>(false);

  const {
    data: profile,
    isPending,
    isError,
  } = useQuery<IUser>({
    queryKey: ["USER", profileId],
    queryFn: async () => await getUserById(profileId),
    refetchOnWindowFocus: false,
  });

  const isFriend = user?.friends?.some((friend) => friend._id === profile?._id);
  const isInRequests = user?.friendRequests?.some(
    (friend) => friend._id === profile?._id
  );
  const isInFriendRequests = profile?.friendRequests?.some(
    (request) => request?.toString() === user?._id?.toString()
  );

  const { mutate: handleFriendRequestMutation, isPending: isRequesting } =
    useMutation({
      mutationFn: async (requestedTo: string | undefined) => {
        await sendFriendRequest(requestedTo, user?._id);
      },
      onSuccess: () => {
        if (user) {
          (profile?.friendRequests as unknown as string[]).push(user._id);
        }

        toast.success("Friend request sent successfully!");
      },
      onError: () => {
        toast.error("Something went wrong, try again");
      },
    });

  useEffect(() => {
    if (!isPending) {
      document.title = `Profile | ${profile?.firstName} ${profile?.lastName}`;
    }
  }, [isPending, profile?.firstName, profile?.lastName]);

  if (isPending) {
    return (
      <section className="w-full h-full rounded-3xl flex items-center justify-center bg-gradient-to-br from-neutral-100 to-primary/25">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4 p-6 rounded-2xl backdrop-blur-lg bg-white/30 shadow-lg"
        >
          <div className="relative">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <span className="absolute inset-0 animate-ping bg-primary opacity-50 rounded-full" />
          </div>
          <p className="text-neutral-700 font-medium text-lg">
            Loading profile...
          </p>
        </motion.div>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="w-full flex flex-col items-center justify-center mt-32">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold text-red-500">
            ❌ Failed to load profile
          </h2>
          <p className="text-neutral-600 mt-2">
            Something went wrong. Please try again.
          </p>
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
          >
            Retry
          </Button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full p-3 md:p-0">
      <div className="w-full relative h-[275px] z-10">
        <img
          src={BannerBackground}
          alt="banner"
          loading="lazy"
          className="w-full h-full object-cover object-left-bottom rounded-t-2xl rounded-b-md brightness-90 opacity-45 shadow"
        />
        <div className="lg:absolute lg:px-8 inset-x-0 -bottom-32 w-full lg:h-48 z-20 flex items-start lg:items-center justify-between gap-x-8 mt-5 lg:mt-0">
          <div className="flex items-start lg:items-end gap-x-4">
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="relative size-32 lg:size-44 rounded-[44px] ring-[6px] ring-neutral-50/50"
            >
              {profile?.profilePicture ? (
                <Image
                  src={profile?.profilePicture}
                  alt={`${profile?.firstName}'s profile`}
                  className="w-full h-full object-cover rounded-[44px]"
                  loadingClassName="w-full h-full rounded-[44px] border border-neutral-300 bg-neutral-200/50 backdrop-blur-lg"
                  loaderColor="text-neutral-800/60 size-9"
                />
              ) : (
                <div className="size-32 lg:size-44 rounded-[44px] bg-foreground flex items-center justify-center text-neutral-50 uppercase text-4xl lg:text-5xl font-semibold">
                  {profile?.firstName.charAt(0)}
                  {profile?.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col h-32 lg:h-44 justify-between lg:justify-end py-2">
              <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-1.5">
                  <span className="max-w-[275px] text-2xl font-semibold text-neutral-800 capitalize truncate">
                    {profile?.firstName} {profile?.lastName}
                  </span>
                  <p className="hidden lg:block text-base font-semibold text-neutral-800">
                    -
                  </p>
                  <p className="hidden lg:block text-[15px] font-medium text-neutral-700/85">
                    {profile?.username}
                  </p>
                </div>
                {profile.description && (
                  <span className="text-sm font-medium text-neutral-700 mt-1 line-clamp-2 max-w-md break-words">
                    {profile.description}
                  </span>
                )}
              </div>
              {user?._id === profile?._id ? (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-fit mt-2 flex lg:hidden border-neutral-300 bg-neutral-50 hover:bg-white hover:border-neutral-400/80 text-neutral-800 rounded-xl text-[15px] font-medium"
                    >
                      <Pen />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    aria-describedby={undefined}
                    className="rounded max-w-[90%] sm:max-w-lg md:max-w-xl bg-neutral-50 py-4 px-5 outline-none"
                  >
                    <DialogHeader>
                      <DialogTitle className="text-lg text-neutral-800">
                        Edit Your Profile
                      </DialogTitle>
                      <div className="w-24 h-px bg-primary/35 mx-auto sm:mx-0" />
                    </DialogHeader>
                    <EditProfileForm
                      profileId={profile._id}
                      firstName={profile.firstName}
                      lastName={profile.lastName}
                      username={profile.username}
                      profilePicture={profile.profilePicture}
                      description={profile.description}
                      setOpen={setOpen}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  type="button"
                  disabled={
                    isRequesting ||
                    isFriend ||
                    isInRequests ||
                    isInFriendRequests
                  }
                  onClick={() => handleFriendRequestMutation(user?._id)}
                  className="w-fit mt-2 flex lg:hidden rounded-xl text-[15px] font-medium bg-gradient-to-br from-primary/70 to-primary"
                >
                  {isInRequests || isInFriendRequests
                    ? "Pending..."
                    : isFriend
                    ? "Already Friends"
                    : "Send Request"}
                </Button>
              )}
            </div>
          </div>
          {user?._id === profile?._id ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-neutral-300 hidden lg:flex bg-neutral-50 hover:bg-white hover:border-neutral-400/80 text-neutral-800 rounded-xl text-[15px] font-medium"
                >
                  <Pen />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent
                aria-describedby={undefined}
                className="rounded max-w-[90%] sm:max-w-lg md:max-w-xl bg-neutral-50 py-4 px-5 outline-none"
              >
                <DialogHeader>
                  <DialogTitle className="text-lg text-neutral-800">
                    Edit Your Profile
                  </DialogTitle>
                  <div className="w-24 h-px bg-primary/35 mx-auto sm:mx-0" />
                </DialogHeader>
                <EditProfileForm
                  profileId={profile._id}
                  firstName={profile.firstName}
                  lastName={profile.lastName}
                  username={profile.username}
                  profilePicture={profile.profilePicture}
                  description={profile.description}
                  setOpen={setOpen}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              type="button"
              disabled={
                isRequesting || isFriend || isInRequests || isInFriendRequests
              }
              onClick={() => handleFriendRequestMutation(user?._id)}
              className="hidden lg:flex rounded-xl text-[15px] font-medium bg-gradient-to-br from-primary/70 to-primary"
            >
              {isInRequests || isInFriendRequests
                ? "Pending..."
                : isFriend
                ? "Already Friends"
                : "Send Request"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
