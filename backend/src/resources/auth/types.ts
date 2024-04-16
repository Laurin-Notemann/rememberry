import * as http from "http";
import { User } from "lucia";
import z from "zod";

export const LoginRouteInput = z.object({
  email: z.string(),
  password: z.string(),
});

export const RegisterRouteInput = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export type AuthOutput = {
  user: User;
  sessionCookie: string;
};

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LogoutInput = {
  opts: {
    ctx: {
      req: http.IncomingMessage;
      res: http.ServerResponse<http.IncomingMessage>;
    };
  };
};

export const PasswortResetEmailInput = z.string().email();
export const PasswordResetInput = z.object({
  userId: z.string(),
  password: z.string(),
});
export type PasswordReset = {
  userId: string;
  password: string;
};
