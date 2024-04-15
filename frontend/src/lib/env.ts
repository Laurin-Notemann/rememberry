import { createEnv } from "@t3-oss/env-nextjs";
import { parseInt } from "lodash";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NODE_ENV: z.enum(["production", "development", "test"]),
    APP_ENV: z.enum(["production", "development", "staging", "testing"]),
    IS_PROD: z.boolean(),
    IS_STAGING: z.boolean(),
    IS_DEV: z.boolean(),
    DOCKER_BACKEND_HOST: z.string().optional(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_APP_ENV: z.enum([
      "production",
      "development",
      "staging",
      "testing",
    ]),
    NEXT_PUBLIC_IS_DEV: z.boolean(),
    NEXT_PUBLIC_BACKEND_HOST: z.string(),
    NEXT_PUBLIC_BACKEND_PORT: z.number(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,test
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
    IS_PROD: process.env.NODE_ENV === "production",
    IS_STAGING: process.env.APP_ENV === "staging",
    IS_DEV: process.env.APP_ENV === "development",
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_IS_DEV: process.env.NEXT_PUBLIC_APP_ENV === "development",
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST,
    NEXT_PUBLIC_BACKEND_PORT: process.env.NEXT_PUBLIC_BACKEND_PORT
      ? parseInt(process.env.NEXT_PUBLIC_BACKEND_PORT)
      : 3050,
    DOCKER_BACKEND_HOST: process.env.DOCKER_BACKEND_HOST
      ? process.env.DOCKER_BACKEND_HOST
      : undefined,
  },
});
