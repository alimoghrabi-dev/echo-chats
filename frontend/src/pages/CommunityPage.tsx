import React, { useEffect } from "react";
import SearchInputQuery from "@/components/shared/SearchInputQuery";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommunityUsers } from "@/lib/actions";
import { useAuth } from "@/context/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { UserX } from "lucide-react";
import CommunityUser from "@/components/shared/CommunityUser";

const CommunityPage: React.FC = () => {
  const { user: SignedInUser } = useAuth();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("search-query") || "";

  const {
    data: users,
    isPending: isGettingUsers,
    isRefetching,
  } = useQuery({
    queryKey: ["COMMUNITY_USERS", query],
    queryFn: async () => await getCommunityUsers(query),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    document.title = `Echo Chats | Community`;
  }, []);

  return (
    <div className="relative w-full h-full p-3 md:p-0">
      <div className="max-w-[310px] w-[310px]">
        <SearchInputQuery />
      </div>
      <div className="w-full relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-6">
        {isGettingUsers ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full p-4 rounded-xl border shadow flex flex-col items-center justify-center gap-y-2"
            >
              <Skeleton className="size-16 bg-neutral-300 rounded-full flex-shrink-0" />
              <Skeleton className="w-28 h-3 bg-neutral-300 rounded-md" />
              <Skeleton className="w-20 h-3 bg-neutral-300 rounded-md" />
              <Skeleton className="w-32 h-8 bg-neutral-300 rounded-xl mt-1" />
            </div>
          ))
        ) : !users || users?.length === 0 ? (
          <div className="w-full col-span-6 pt-20 flex flex-col items-center justify-center space-y-2.5">
            <UserX size={58} className="text-neutral-600 opacity-90" />
            <p className="text-xl font-medium text-neutral-600 text-center">
              OOPS! No Users Found.
            </p>
          </div>
        ) : (
          users?.map((user: IUser) => (
            <CommunityUser
              key={user?._id}
              SignedInUser={SignedInUser}
              user={user}
            />
          ))
        )}
      </div>
      {isRefetching && (
        <div className="absolute inset-0 md:-inset-2 shadow border-sm bg-white/40 backdrop-blur-[2px] flex flex-col gap-y-4 items-center justify-center rounded-sm md:rounded-2xl">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "99%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-2 h-1 bg-primary rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-xl font-medium text-primary"
          >
            Refreshing...
          </motion.p>
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                className="w-2.5 h-2.5 bg-primary rounded-full"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
