import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { lucia } from "./auth/lucia";
import { createContext } from "./context";
import { db } from "./db/db";
import { env } from "./env";
import { appRouter } from "./routers/_app";
import { ScopedLogger } from "./logger";

const server = createHTTPServer({
  middleware: cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://rememberry.app",
      "https://web.stage.rememberry.app",
    ],
    credentials: true,
  }),
  router: appRouter,
  createContext,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("SIGHUP", async () => {
  const logger = new ScopedLogger("SIGHUP")
  env.updateEnv();
  let attempts = 0;
  const maxAttempts = 5;
  let drizzle;

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

server.listen(env.get("PORT"));

console.log("server listening on http://localhost:" + env.get("PORT"));
