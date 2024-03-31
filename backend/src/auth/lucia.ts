import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Lucia, TimeSpan } from "lucia";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { session, users } from "../db/schema";
import { env } from "../env";

const adapter = new DrizzlePostgreSQLAdapter(db.drizzle, session, users);

export const getDomain = () => {
  // TODO: DON'T HARDCODE
  if (env.get("NODE_ENV") === "staging") {
    return "stage.rememberry.app";
  }
  if (env.get("NODE_ENV") === "production") {
    return "rememberry.app";
  }
  return "127.0.0.1";
};

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
          domain: getDomain(),
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
          domain: getDomain(),
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
