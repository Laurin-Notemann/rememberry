import { User } from "lucia";
import { privateProcedure } from "../../middleware/validateSession";
import { publicProcedure, router } from "../../trpc";
import { UserRouterOutput } from "../user/types";
import { luciaAuthentication } from "./auth.controller";
import {
  LoginRouteInput,
  PasswortResetEmailInput,
  PasswordResetInput,
  RegisterRouteInput,
} from "./types";
import z from "zod";

export const authRouter = router({
  register: publicProcedure
    .input(RegisterRouteInput)
    .output(z.string())
    .mutation(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.register(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),
  login: publicProcedure
    .input(LoginRouteInput)
    .output(UserRouterOutput)
    .mutation(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.login(opts.input);
      if (errorCheck) {
        throw errorCheck;
      }
      opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
      return res.user;
    }),
  logout: privateProcedure.mutation(async (opts) => {
    const [errorCheck, res] = await luciaAuthentication.logout({ opts });
    if (errorCheck) {
      throw errorCheck;
    }
    opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
  }),
  passwordResetEmail: publicProcedure
    .input(PasswortResetEmailInput)
    .output(z.string())
    .mutation(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.passwordResetEmail(
        opts.input,
      );

      if (errorCheck) {
        throw errorCheck;
      }

      return res;
    }),
  passwordReset: publicProcedure
    .input(PasswordResetInput)
    .output(z.string())
    .mutation(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.passwordReset(
        opts.input,
      );
      if (errorCheck) {
        throw errorCheck;
      }
      return res;
    }),
  confirm: publicProcedure
    .input(z.string())
    .output(UserRouterOutput)
    .mutation(async (opts) => {
      const [errorCheck, res] = await luciaAuthentication.confirmAccount(
        opts.input,
      );
      if (errorCheck) {
        throw errorCheck;
      }
      opts.ctx.res.setHeader("Set-Cookie", res.sessionCookie);
      return res.user;
    }),
});

export type authRouter = typeof authRouter;
