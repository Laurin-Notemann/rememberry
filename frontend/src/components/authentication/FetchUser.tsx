"use client";
import Loading from "@frontend/app/loading";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import {
  User,
  useUserStore,
} from "../../lib/services/authentication/userStore";

type FetchUserProps = {
  user: User | null;
  children: ReactNode;
};

export const FetchUser: FC<FetchUserProps> = ({ user, children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const userStore = useUserStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      userStore.actions.deleteUser();
    } else {
      userStore.actions.setUser(user);
    }
    setIsLoading(false);
  }, [user, router, userStore.actions, isLoading]);

  if (isLoading) return <Loading />;

  return <>{children}</>;
};
