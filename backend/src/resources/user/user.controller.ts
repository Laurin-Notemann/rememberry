import { Scrypt, User as luciaUser } from "lucia";
import { LuciaAuth, lucia } from "../../auth/lucia";
import { NewUser, User } from "../../db/schema";
import { Logger, ScopedLogger } from "../../logger";
import { TRPCStatus, getTRPCError } from "../../utils";
import { GetUserBySessionInput } from "./types";
import { UserModel, userModelDrizzle } from "./user.model";

export interface UserController {
  createUser(input: NewUser): Promise<TRPCStatus<User>>;
  getUserByEmail(email: string): Promise<TRPCStatus<User>>;
  getUserById(id: string): Promise<TRPCStatus<User>>;
  getUserBySession(
    input: GetUserBySessionInput,
  ): Promise<TRPCStatus<luciaUser>>;
  updateUserById(input: User): Promise<TRPCStatus<luciaUser>>;
  deleteUserById(userId: string): Promise<TRPCStatus<string>>;
}

class LuciaUserController implements UserController {
  userModel: UserModel;
  luciaAuth: LuciaAuth;
  logger: Logger;
  constructor(userModel: UserModel, luciaAuth: LuciaAuth) {
    this.userModel = userModel;
    this.luciaAuth = luciaAuth;
    this.logger = new ScopedLogger("User Controller");
  }
  async createUser(input: NewUser): Promise<TRPCStatus<User>> {
    try {
      const userAtrributes = {
        ...input,
        password: await new Scrypt().hash(input.password),
      };

      const [err, user] = await this.userModel.createUser(userAtrributes);

      if (err) return [err, null] as const;

      return [null, user] as const;
    } catch (e) {
      console.error("database error:", e);
      return getTRPCError(this.logger);
    }
  }
  async getUserByEmail(email: string): Promise<TRPCStatus<User>> {
    const [err, user] = await this.userModel.getUserByEmail(email);
    if (err) return getTRPCError(this.logger, err.message, err.code);
    return [null, user] as const;
  }
  async getUserById(id: string): Promise<TRPCStatus<User>> {
    const [err, user] = await this.userModel.getUserById(id);
    if (err) return getTRPCError(this.logger, err.message, err.code);
    return [null, user] as const;
  }
  async getUserBySession(input: GetUserBySessionInput) {
    const cookieHeader = input.req.headers.cookie;
    if (!cookieHeader) return getTRPCError(this.logger, "No cookie");
    const sessionId = this.luciaAuth.lucia.readSessionCookie(cookieHeader);
    if (!sessionId) return getTRPCError(this.logger, "Could not read session");

    const { session, user } =
      await this.luciaAuth.lucia.validateSession(sessionId);

    if (!session) return getTRPCError(this.logger, "Session is invalid");

    return [null, user] as const;
  }
  async updateUserById(input: User) {
    try {
      const [err, user] = await this.userModel.updateUserById(input);
      if (err) return getTRPCError(this.logger, err.message, err.code);
      return [null, user] as const;
    } catch (e) {
      return getTRPCError(this.logger, "Could not update User");
    }
  }
  //TODO: unvalidate all session (and send a new session so user stays logged in)
  async deleteUserById(userId: string) {
    const [err, _] = await this.userModel.deleteUserById(userId);
    if (err) return getTRPCError(this.logger, err.message, err.code);
    return [null, "Successfully deleted user"] as const;
  }
}

export const userController = new LuciaUserController(userModelDrizzle, lucia);
