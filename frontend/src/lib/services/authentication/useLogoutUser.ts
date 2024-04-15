import { TRPCClientError } from "@trpc/client";
import { rqTrpc } from "../trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

export const useLogoutUser = () => {
  const queryClient = useQueryClient();

  const userCreator = rqTrpc.auth.logout.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(rqTrpc.user.getUserBySession, undefined, "query"),
      });
    },
  });

  const logoutUser = async () => {
    try {
      await userCreator.mutateAsync();

      return [null, true] as const;
    } catch (error) {
      if (error instanceof TRPCClientError) return [error, null] as const;
      else return [error, null] as const;
    }
  };
  return logoutUser;
};
