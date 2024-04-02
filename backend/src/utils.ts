import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { DatabaseError } from "pg";
import { Logger } from "./logger";
import { env } from "./env";

/**
 * if message and error are undefined returns an Internal server error without a message
 */
export const getTRPCError = (
  logger?: Logger | null,
  message?: string | null,
  error?: TRPC_ERROR_CODE_KEY | null,
) => {
  let defaultError = new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  if (error) defaultError = new TRPCError({ code: error });
  if (message) {
    defaultError.message = message;
    if (logger) {
      logger.error(
        "\n\t" + defaultError.code + ":\n\n" + defaultError.message + "\n",
      );
    } else {
      console.error(
        "\n\t" + defaultError.code + ":\n\n" + defaultError.message + "\n",
      );
    }

    return [defaultError, null] as const;
  }

  if (logger) {
    logger.error(JSON.stringify(defaultError));
  } else {
    console.error(JSON.stringify(defaultError));
  }

  return [defaultError, null] as const;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const hasOnlyOneEntry = (content: any[]) => {
  if (content.length === 1) return true;
  return false;
};

export const getModelDefaultError = (
  error: unknown,
  logger?: Logger | null,
) => {
  console.error("[BAD]", error);
  if (error instanceof DatabaseError)
    return getTRPCError(logger, "Error with the DB: " + JSON.stringify(error));
  return getTRPCError(logger, JSON.stringify(error));
};

export type TRPCStatus<T> = Readonly<[TRPCError, null] | [null, T]>;

export type PromiseTStatus<T> = Promise<TRPCStatus<T>>;

export type AsyncFunction<T> = () => Promise<T>;

export const catchDrizzleErrorOneEntry = async <T>(
  query: AsyncFunction<T[]>,
  logger?: Logger | null,
): Promise<TRPCStatus<T>> => {
  try {
    const res = await query();

    if (!hasOnlyOneEntry(res)) return getTRPCError(logger);

    return [null, res[0]];
  } catch (err) {
    return getModelDefaultError(err, logger);
  }
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const catchDrizzleErrorManyEntries = async <T extends any[]>(
  query: AsyncFunction<T>,
  logger?: Logger | null,
): Promise<TRPCStatus<T>> => {
  try {
    const res = await query();

    return [null, res];
  } catch (err) {
    return getModelDefaultError(err, logger);
  }
};

export const getFrontendUrl = () => {
  if (env.get("IS_PROD"))
    return `https://${env.get("FRONTEND_HOST")}`
  else
    return `http://${env.get("FRONTEND_HOST")}:${env.get("FRONTEND_PORT")}`
}
