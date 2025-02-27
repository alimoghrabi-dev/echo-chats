import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/useAuth";

const ProtectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isPending, isRefetching } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !isRefetching && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, isPending, navigate, isRefetching]);

  if (isPending) {
    return null;
  }

  return children;
};

export default ProtectionProvider;
