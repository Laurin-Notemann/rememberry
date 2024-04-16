"use client";
import { useGetUserBySession } from "@frontend/lib/services/authentication/useGetUserBySession";
import { useUserStore } from "@frontend/lib/services/authentication/userStore";
import { FC, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const userStore = useUserStore((store) => store);

  const { isLoading, data, isSuccess, isError } = useGetUserBySession();

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    const exclude = ["password", "confirm"];
    if (!exclude.some((excludedWord) => pathname.includes(excludedWord))) {
      if (!isLoading && isSuccess) {
        userStore.actions.setUser(data);
      } else if (!isLoading && !isSuccess && isError) {
        userStore.actions.deleteUser();
        router.push("/login");
      }
    }
  }, [
    isLoading,
    isSuccess,
    data,
    userStore.actions,
    isError,
    router,
    pathname,
  ]);

  return isLoading ? null : children;
};
