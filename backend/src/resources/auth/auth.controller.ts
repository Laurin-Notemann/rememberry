import { Scrypt, User } from "lucia";
import { LuciaAuth, lucia } from "../../auth/lucia";
import { NewUser } from "../../db/schema";
import { Logger, ScopedLogger } from "../../logger";
import { TRPCStatus, getTRPCError } from "../../utils";
import { UserController, userController } from "../user/user.controller";
import {
  AuthOutput,
  LoginInput,
  LogoutInput,
  PasswordReset,
  RegisterInput,
} from "./types";
import { SendMail, sendMailScaleway } from "../send-mail/send-mail.controller";

export interface AuthenticationController {
  register(input: RegisterInput): Promise<TRPCStatus<string>>;
  login(input: LoginInput): Promise<TRPCStatus<AuthOutput>>;
  logout(input: LogoutInput): Promise<TRPCStatus<AuthWithoutUser>>;
  passwordResetEmail(input: string): Promise<TRPCStatus<string>>;
  passwordReset(input: PasswordReset): Promise<TRPCStatus<string>>;
  confirmAccount(userId: string): Promise<TRPCStatus<AuthOutput>>;
}

class LuciaAuthentication implements AuthenticationController {
  userController: UserController;
  luciaAuth: LuciaAuth;
  logger: Logger;
  sendMail: SendMail;
  constructor(
    userController: UserController,
    luciaAuth: LuciaAuth,
    sendMail: SendMail,
  ) {
    this.userController = userController;
    this.luciaAuth = luciaAuth;
    this.logger = new ScopedLogger("Authentication Controller");
    this.sendMail = sendMail;
  }
  async register(registerInput: RegisterInput) {
    const newUser: NewUser = { ...registerInput, confirmed: false };
    const [err, user] = await this.userController.createUser(newUser);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    const [errSendMail] = await this.sendMail.confirmAccount({
      userId: user.id,
      email: user.email,
      subject: "Confirm Account",
    });

    if (errSendMail)
      return getTRPCError(this.logger, errSendMail.message, errSendMail.code);

    return [null, "User created, confirmation Email sent"] as const;
  }
  async login(input: LoginInput) {
    const { email, password } = input;
    try {
      const [err, user] = await this.userController.getUserByEmail(email);

      if (err) return getTRPCError(this.logger, err.message, err.code);

      if (!user.confirmed)
        return getTRPCError(
          this.logger,
          "User is not confirmed yet",
          "UNAUTHORIZED",
        );

      const validPw = await new Scrypt().verify(user.password, password);
      if (!validPw)
        return getTRPCError(
          this.logger,
          "Invalid Username or password",
          "BAD_REQUEST",
        );

      this.logger.info("User has logged in: " + user.id + " " + user.username);

      return this.createSessionAndCookie(user);
    } catch (e) {
      return getTRPCError(
        this.logger,
        "Could not log in: " + JSON.stringify(e),
        "INTERNAL_SERVER_ERROR",
      );
    }
  }
  async logout(input: LogoutInput) {
    const { req } = input.opts.ctx;

    const cookieHeader = req.headers.cookie;

    const sessionId = this.luciaAuth.lucia.readSessionCookie(
      cookieHeader ?? "",
    );
    if (!sessionId)
      return getTRPCError(this.logger, "Invalid cookie", "UNAUTHORIZED");

    try {
      await this.luciaAuth.lucia.invalidateSession(sessionId);
    } catch (e) {
      return getTRPCError(
        this.logger,
        "Could not invalidate Session",
        "INTERNAL_SERVER_ERROR",
      );
    }

    const sessionCookie = this.luciaAuth.lucia.createBlankSessionCookie();

    const payload: AuthWithoutUser = {
      sessionCookie: sessionCookie.serialize(),
    };

    this.logger.info("User has logged out");

    return [null, payload] as const;
  }

  async passwordResetEmail(email: string): Promise<TRPCStatus<string>> {
    const [err, user] = await this.userController.getUserByEmail(email);

    if (err)
      return getTRPCError(
        this.logger,
        "User with this email does not exist",
        err.code,
      );

    const [errSendMail, res] = await this.sendMail.passwordReset({
      userId: user.id,
      email: user.email,
      subject: "Reset Password",
    });

    if (errSendMail)
      return getTRPCError(this.logger, errSendMail.message, errSendMail.code);

    return [null, res] as const;
  }

  async passwordReset({
    userId,
    password,
  }: PasswordReset): Promise<TRPCStatus<string>> {
    const [err, user] = await this.userController.getUserById(userId);

    if (err)
      return getTRPCError(this.logger, "User with this id does not exist");

    const updateUserInput = {
      ...user,
      password: await new Scrypt().hash(password),
    };

    const [updateErr] =
      await this.userController.updateUserById(updateUserInput);

    if (updateErr)
      return getTRPCError(
        this.logger,
        "User pw could not be updated",
        updateErr.code,
      );

    return [null, "Password successfully changed."] as const;
  }

  async confirmAccount(userId: string) {
    const [err, user] = await this.userController.getUserById(userId);

    if (err)
      return getTRPCError(this.logger, "User with this id does not exist");

    const updateUserInput = {
      ...user,
      confirmed: true,
    };

    this.logger.debug(updateUserInput);

    const [updateErr, updatedUser] =
      await this.userController.updateUserById(updateUserInput);

    this.logger.debug(updateErr, updatedUser);

    if (updateErr)
      return getTRPCError(
        this.logger,
        "User could not be confirmed",
        updateErr.code,
      );

    this.logger.info("New user registered: " + user.id + " " + user.username);

    return this.createSessionAndCookie(updatedUser);
  }

  private async createSessionAndCookie(userIn: User) {
    try {
      const session = await this.luciaAuth.lucia.createSession(userIn.id, {});

      const sessionCookie = this.luciaAuth.lucia.createSessionCookie(
        session.id,
      );

      const user: User = {
        id: userIn.id,
        email: userIn.email,
        username: userIn.username,
        confirmed: userIn.confirmed,
        createdAt: userIn.createdAt,
        updatedAt: userIn.updatedAt,
      };

      const payload: AuthOutput = {
        user,
        sessionCookie: sessionCookie.serialize(),
      };
      this.logger.info(
        "Session was created for: ",
        user.id + " ",
        user.username,
      );
      return [null, payload] as const;
    } catch (e) {
      const error = e as Error;
      return getTRPCError(
        this.logger,
        "Could not create session" + JSON.stringify(error.message),
        "INTERNAL_SERVER_ERROR",
      );
    }
  }
}

type AuthWithoutUser = Omit<AuthOutput, "user">;

export const luciaAuthentication = new LuciaAuthentication(
  userController,
  lucia,
  sendMailScaleway,
);
