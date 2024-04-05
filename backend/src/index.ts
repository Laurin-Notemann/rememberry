import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { lucia } from "./auth/lucia";
import { createContext } from "./context";
import { db } from "./db/db";
import { env } from "./env";
import { ScopedLogger } from "./logger";
import { appRouter } from "./routers/_app";
import { getFrontendUrl } from "./utils";

const server = createHTTPServer({
  middleware: cors({
    origin: [getFrontendUrl()],
    credentials: true,
  }),
  router: appRouter,
  createContext,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("SIGHUP", async () => {
  const logger = new ScopedLogger("SIGHUP");
  env.updateEnv();
  let attempts = 0;
  const maxAttempts = 5;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  let drizzle: any;

  while (!drizzle && attempts < maxAttempts) {
    drizzle = await db.updateDBConnection();
    if (!drizzle) {
      logger.error("Failed to update DB connection, retrying...");
      attempts++;
      await delay(50); // Wait for 1 second before retrying
    }
  }

  if (!drizzle) {
    logger.error("Failed to update DB connection after maximum attempts.");
    return;
  }
  logger.info("Successfully updated env");

  lucia.updateLucia(drizzle);
});

server.listen(env.get("BACKEND_PORT"));

console.log("server listening on http://localhost:" + env.get("BACKEND_PORT"));
