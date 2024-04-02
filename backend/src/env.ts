/*
exports type parsed environment variables (i.e. PORT: "420" becomes PORT: 420) for linting and auto completion purposes.
in staging and prod, these are sourced from process.env (injected via heroku), in development from the local .env file
*/
import { config, parse } from "dotenv";
import fs from "node:fs";
import { z } from "zod";
import { ScopedLogger } from "./logger";

const EnvZod = z.object({
  NODE_ENV: z.enum(["production", "development", "testing", "staging"]),
  IS_PROD: z.boolean(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.number(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  BACKEND_PORT: z.number(),
  REDIS_PORT: z.number(),
  REDIS_HOST: z.string(),
  REDIS_PASSWORD: z.string(),
  FRONTEND_HOST: z.string(),
  FRONTEND_PORT: z.number(),
});

function getEnvSrc() {
  const { error, parsed } = config({ path: "../.env" });

  if (error || parsed == null) {
    const secretPath = process.env.VAULT_SECRET_PATH;
    if (!secretPath) throw Error("VAULT_SECRET_PATH env variable is missing");
    // errors when file not found - on purpose because app should throw and error
    const vaultFile = fs.readFileSync(secretPath, "utf8");
    const dbCreds = parse(vaultFile) as { [key: string]: string };
    const environment = process.env as { [key: string]: string };

    return { ...dbCreds, ...environment };
  }

  return parsed;
}

function parseEnv(env: { [key: string]: string }) {
  return {
    ...env,
    FRONTEND_PORT: parseInt(env.PORT),
    REDIS_PORT: parseInt(env.REDIS_PORT),
    POSTGRES_PORT: parseInt(env.POSTGRES_PORT),
    BACKEND_PORT: parseInt(env.BACKEND_PORT),
    NODE_ENV: env.NODE_ENV ? env.NODE_ENV : "development",
    IS_PROD: env.NODE_ENV === "production",
  };
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function validateEnv(env: { [key: string]: any }) {
  const parsedEnv = EnvZod.safeParse(env);

  if (!parsedEnv.success)
    throw new Error(
      "Failed to Parse Environment Variables: " +
      JSON.stringify(parsedEnv.error.issues, null, 2),
    );

  return parsedEnv.data;
}

class Environment {
  private env: z.infer<typeof EnvZod>;
  logger: ScopedLogger;
  constructor() {
    this.env = validateEnv(parseEnv(getEnvSrc()));
    this.logger = new ScopedLogger("Environment");
    const envForLogging = { ...this.env };

    envForLogging.POSTGRES_PASSWORD = envForLogging.POSTGRES_PASSWORD.substring(
      0,
      5,
    );
    envForLogging.POSTGRES_USER = envForLogging.POSTGRES_USER.substring(0, 5);

    this.logger.info("init:", this.env);
  }
  updateEnv() {
    this.env = validateEnv(parseEnv(getEnvSrc()));
    const envForLogging = { ...this.env };

    envForLogging.POSTGRES_PASSWORD = envForLogging.POSTGRES_PASSWORD.substring(
      0,
      5,
    );
    envForLogging.POSTGRES_USER = envForLogging.POSTGRES_USER.substring(0, 5);
    this.logger.info("update:", this.env);
  }

  get<K extends keyof z.infer<typeof EnvZod>>(
    input: K,
  ): z.infer<typeof EnvZod>[K] {
    return this.env[input];
  }
}

export const env = new Environment();
