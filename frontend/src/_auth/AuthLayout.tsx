import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/context/useAuth";

const AuthLayout: React.FC = () => {
  const { user, isPending, isRefetching } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !isRefetching && user) {
      navigate("/", { replace: true });
    }
  }, [user, isPending, navigate, isRefetching]);

  if (isPending) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-foreground gap-8 p-5">
      <div className="fixed bottom-4 right-4 text-neutral-500 font-normal text-sm">
        Patch 1.0 (Demo)
      </div>

      <div className="hidden lg:block w-full h-full relative rounded-2xl bg-neutral-300"></div>
      <main className="w-full min-h-full flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
