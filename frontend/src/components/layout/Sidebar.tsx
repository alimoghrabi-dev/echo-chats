import React, { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ScrollArea } from "../ui/scroll-area";
import { TbLogout2 } from "react-icons/tb";
import { sideLinks } from "@/constants/constants";
import { useAuth } from "@/context/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Image from "../shared/Image";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_STATUS"],
      });

      navigate("/login", { replace: true });
    },
    onError: () => {
      toast.error("Something went wrong, please try again.");
    },
  });

  return (
    <nav className="w-36 fixed h-screen left-0 hidden lg:flex flex-col items-center justify-between gap-y-8 py-8">
      <Link
        to="/"
        className={cn(
          "relative size-20 bg-neutral-100 rounded-full ring-2 ring-neutral-300/80"
        )}
      >
        {user?.profilePicture ? (
          <Image
            src={user?.profilePicture}
            alt={`${user?.firstName}'s profile`}
            className="w-full h-full object-cover rounded-full"
            loadingClassName="w-full h-full rounded-full backdrop-blur-lg"
            loaderColor="text-neutral-800/60 size-6"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary font-semibold text-2xl uppercase text-neutral-50 rounded-full">
            {`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`}
          </div>
        )}
      </Link>
      <ScrollArea className="w-full max-h-[55vh] p-4">
        <div className="w-full flex flex-col gap-y-2">
          {sideLinks.map((link, index) => {
            const isProfileLink = link.href === "/profile/:id";
            const isActive = isProfileLink
              ? location.pathname === `/profile/${user?._id}`
              : location.pathname === link.href;

            return (
              <Fragment key={index}>
                <Link
                  to={isProfileLink ? `/profile/${user?._id}` : link.href}
                  className={cn(
                    "w-full text-neutral-400 h-[90px] px-2 rounded-xl hover:bg-accent-foreground flex flex-col items-center justify-center gap-y-2 transition-all",
                    {
                      "cursor-default bg-accent-foreground hover:bg-forground":
                        isActive,
                    }
                  )}
                >
                  <link.icon size={27} />
                  <span className="text-sm font-normal text-center">
                    {link.label}
                  </span>
                </Link>
                {index === sideLinks.length - 3 && (
                  <div className="w-full h-px bg-accent-foreground" />
                )}
              </Fragment>
            );
          })}
        </div>
      </ScrollArea>
      <div className="w-full p-4">
        <button
          type="button"
          disabled={isPending}
          onClick={() => logoutMutation()}
          className="w-full text-neutral-400 h-24 rounded-xl hover:bg-accent-foreground flex flex-col items-center justify-center gap-y-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 size={30} className="animate-spin" />
          ) : (
            <Fragment>
              <TbLogout2 size={27} />
              <span className="text-sm font-normal text-center">Log out</span>
            </Fragment>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
