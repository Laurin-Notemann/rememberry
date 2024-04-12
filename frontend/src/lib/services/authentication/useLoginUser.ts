import { TRPCClientError } from "@trpc/client";
import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";
import { useUserStore } from "./userStore";

export type LoginUserInput = RouterInput["auth"]["login"];
export type LoginUserOutput = RouterOutput["auth"]["login"];

export const useLoginUser = () => {
  const userCreator = rqTrpc.auth.login.useMutation();
  const userStore = useUserStore();
  const loginUser = async (params: { user: LoginUserInput }) => {
    try {
      const user = await userCreator.mutateAsync(params.user);

      userStore.actions.setUser(user);

      return [null, user] as const;
    } catch (error) {
      if (error instanceof TRPCClientError)
        return [error.message, null] as const;
      else return ["An Error has occured. Please try again.", null] as const;
    }
  };
  return loginUser;
};
