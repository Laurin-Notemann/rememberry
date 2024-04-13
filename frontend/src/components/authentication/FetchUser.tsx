"use client";
import { FC, ReactNode } from "react";
import { User } from "../../lib/services/authentication/userStore";
import { useFetchUser } from "./useFetchUser";

type FetchUserProps = {
  user: User | null;
  children: ReactNode;
};

export const FetchUser: FC<FetchUserProps> = ({ user, children }) => {
  const { isLoading } = useFetchUser({ user });
  if (isLoading) return null;
  return <>{children}</>;
};
