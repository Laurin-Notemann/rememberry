import { userLoader } from "@frontend/lib/services/authentication/userloader";
import { cookies } from "next/headers";
import { FC, ReactNode } from "react";
import { FetchUser } from "./FetchUser";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: FC<UserProviderProps> = async ({ children }) => {
  const session = cookies().get("auth_session")?.value;
  const user = await userLoader(session);

  return <FetchUser user={user}>{children}</FetchUser>;
};
