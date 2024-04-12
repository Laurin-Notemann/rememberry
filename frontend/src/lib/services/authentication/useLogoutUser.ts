import { TRPCClientError } from "@trpc/client";
import { rqTrpc } from "../trpc/client";
import { useUserStore } from "./userStore";

export const useLogoutUser = () => {
  const userCreator = rqTrpc.auth.logout.useMutation();
  const userStore = useUserStore();
  const logoutUser = async () => {
    try {
      await userCreator.mutateAsync();

      userStore.actions.deleteUser();

      return [null, true] as const;
    } catch (error) {
      if (error instanceof TRPCClientError) return [error, null] as const;
      else return [error, null] as const;
    }
  };
  return logoutUser;
};
