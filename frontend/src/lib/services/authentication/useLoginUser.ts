import { TRPCClientError } from "@trpc/client";
import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

export type LoginUserInput = RouterInput["auth"]["login"];
export type LoginUserOutput = RouterOutput["auth"]["login"];

export const useLoginUser = () => {
  const queryClient = useQueryClient();

  const userCreator = rqTrpc.auth.login.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(rqTrpc.user.getUserBySession, undefined, "query"),
      });
    },
  });

  const loginUser = async (params: { user: LoginUserInput }) => {
    try {
      const user = await userCreator.mutateAsync(params.user);

      return [null, user] as const;
    } catch (error) {
      if (error instanceof TRPCClientError)
        return [error.message, null] as const;
      else return ["An Error has occured. Please try again.", null] as const;
    }
  };
  return loginUser;
};
