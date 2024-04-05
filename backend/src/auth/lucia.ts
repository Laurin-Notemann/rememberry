import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Lucia, TimeSpan } from "lucia";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { session, users } from "../db/schema";
import { env } from "../env";

export class LuciaAuth {
  lucia: Lucia<Record<never, never>, { username: string; email: string }>;
  constructor(drizzle: NodePgDatabase<typeof schema>) {
    const adapter = new DrizzlePostgreSQLAdapter(drizzle, session, users);
    this.lucia = new Lucia(adapter, {
      getUserAttributes: (data) => {
        return {
          username: data.username,
          email: data.email,
        };
      },
      sessionExpiresIn: new TimeSpan(30, "d"), // no more active/idle
      sessionCookie: {
        expires: false,
        name: "auth_session",
        attributes: {
          secure: true,
          sameSite: "strict",
          domain: env.get("IS_STAGING")
            ? env.get("FRONTEND_HOST").split("eb.")[1]
            : env.get("FRONTEND_HOST"),
        },
      },
    });
  }

  updateLucia(drizzle: NodePgDatabase<typeof schema>) {
    const adapter = new DrizzlePostgreSQLAdapter(drizzle, session, users);
    this.lucia = new Lucia(adapter, {
      getUserAttributes: (data) => {
        return {
          username: data.username,
          email: data.email,
        };
      },
      sessionExpiresIn: new TimeSpan(30, "d"), // no more active/idle
      sessionCookie: {
        expires: false,
        name: "auth_session",
        attributes: {
          secure: true,
          sameSite: "strict",
          domain: env.get("IS_STAGING")
            ? env.get("FRONTEND_HOST").split("eb.")[1]
            : env.get("FRONTEND_HOST"),
        },
      },
    });
  }
}

export const lucia = new LuciaAuth(db.drizzle);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia.lucia;
    DatabaseUserAttributes: {
      username: string;
      email: string;
    };
  }
}
