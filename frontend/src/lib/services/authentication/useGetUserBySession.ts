import { rqTrpc } from "../trpc/client";

export const useGetUserBySession = () => {
  const user = rqTrpc.user.getUserBySession.useQuery(undefined, {
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return user;
};
