import { TRPCClientError } from "@trpc/client";
import { RouterInput, RouterOutput, rqTrpc } from "../trpc/client";

export type RegisterUserInput = RouterInput["auth"]["register"];
export type RegisterUserOutput = RouterOutput["auth"]["register"];
export type ConfirmOutput = RouterOutput["auth"]["confirm"];

export const useRegisterUser = () => {
  const userCreator = rqTrpc.auth.register.useMutation();
  const registerUser = async (params: { user: RegisterUserInput }) => {
    try {
      const newUser = await userCreator.mutateAsync(params.user);
      return [null, newUser] as const;
    } catch (error) {
      if (error instanceof TRPCClientError)
        return [error.message, null] as const;
      else return ["An Error has occured. Please try again.", null] as const;
    }
  };
  return registerUser;
};
