import { eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import { DrizzleDB, db } from "../../db/db";
import { NewUser, User, users } from "../../db/schema";
import { Logger, ScopedLogger } from "../../logger";
import {
  TRPCStatus,
  catchDrizzleErrorOneEntry,
  getTRPCError,
  hasOnlyOneEntry,
} from "../../utils";

export interface UserModel {
  createUser: (user: NewUser) => Promise<TRPCStatus<User>>;
  getUserByEmail: (email: string) => Promise<TRPCStatus<User>>;
  getUserById: (email: string) => Promise<TRPCStatus<User>>;
  updateUserById: (input: User) => Promise<TRPCStatus<User>>;
  deleteUserById: (id: string) => Promise<TRPCStatus<User>>;
}

class UserModelDrizzle implements UserModel {
  logger: Logger;
  db: DrizzleDB;
  constructor(db: DrizzleDB) {
    this.db = db;
    this.logger = new ScopedLogger("User Model");
  }
  async createUser(newUser: NewUser) {
    try {
      const user = await this.db.drizzle
        .insert(users)
        .values(newUser)
        .returning();

      if (!hasOnlyOneEntry(user)) return getTRPCError(this.logger);

      return [null, user[0]] as const;
    } catch (e) {
      if (e instanceof DatabaseError) {
        if (e.code === "23505") {
          if (e.detail?.includes("username")) {
            return getTRPCError(
              this.logger,
              "Username already used",
              "CONFLICT",
            );
          }
          if (e.detail?.includes("email")) {
            return getTRPCError(this.logger, "Email already used", "CONFLICT");
          }

          return getTRPCError(
            this.logger,
            "Somethings wrong with the db: " + JSON.stringify(e),
          );
        }
      }
      return getTRPCError(this.logger, JSON.stringify(e));
    }
  }

  async getUserByEmail(email: string): Promise<TRPCStatus<User>> {
    try {
      const user = await this.db.drizzle
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (user.length === 0)
        return getTRPCError(
          this.logger,
          "Invalid Username or Password",
          "BAD_REQUEST",
        );
      if (!hasOnlyOneEntry(user)) return getTRPCError(this.logger);
      return [null, user[0]] as const;
    } catch (e) {
      if (e instanceof DatabaseError) {
        return getTRPCError(
          this.logger,
          "Error with DB (could not find user): " + JSON.stringify(e),
        );
      }
      return getTRPCError(this.logger);
    }
  }
  async getUserById(id: string): Promise<TRPCStatus<User>> {
    return catchDrizzleErrorOneEntry(
      () => this.db.drizzle.select().from(users).where(eq(users.id, id)),
      this.logger,
    );
  }

  async updateUserById(userInput: User) {
    try {
      const user = await this.db.drizzle
        .update(users)
        .set(userInput)
        .where(eq(users.id, userInput.id))
        .returning();

      if (!hasOnlyOneEntry(user)) return getTRPCError(this.logger);

      return [null, user[0]] as const;
    } catch (e) {
      if (e instanceof DatabaseError) {
        return getTRPCError(
          this.logger,
          "Error with updating user information: " + JSON.stringify(e),
        );
      }
      return getTRPCError(this.logger);
    }
  }
  async deleteUserById(id: string) {
    try {
      const user = await this.db.drizzle
        .delete(users)
        .where(eq(users.id, id))
        .returning();

      if (!hasOnlyOneEntry(user)) return getTRPCError(this.logger);

      return [null, user[0]] as const;
    } catch (e) {
      if (e instanceof DatabaseError) {
        return getTRPCError(
          this.logger,
          "Error with deleting user information: " + JSON.stringify(e),
        );
      }
      return getTRPCError(this.logger);
    }
  }
}

export const userModelDrizzle = new UserModelDrizzle(db);
