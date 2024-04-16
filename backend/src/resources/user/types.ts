import { IncomingMessage, ServerResponse } from "http";
import { User } from "lucia";
import { z } from "zod";

export const UpdateUserByIdRouteInput = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

export type GetUserBySessionInput = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
};

export type UpdateUsernameAndEmailInput = {
  userId: string;
  username: string;
  email: string;
};

export type UpdatePasswordInput = {
  email: string;
  newPassword: string;
};

export type UserControllerOutput = {
  user: User;
};

export const UserRouterOutput = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});
