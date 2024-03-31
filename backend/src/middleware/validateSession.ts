import { TRPCError } from "@trpc/server";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "../auth/lucia";
import { env } from "../env";
import { middleware, publicProcedure } from "../trpc";
import { getTRPCError } from "../utils";

const allowedHost = () => {
  if (env.get("NODE_ENV") === "staging") {
    return "web.stage.rememberry.app";
  }
  if (env.get("NODE_ENV") === "production") {
    return "rememberry.app";
  }
  return "127.0.0.1:3000";
};

const isLoggedIn = middleware(async ({ next, ctx }) => {
  const { req, res } = ctx;
  const method = req.method;
  const headers = req.headers;
  if (method === "POST") {
    const originHeader = headers.origin;
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const allowedHosts = allowedHost();
    if (
      !originHeader ||
      !allowedHosts ||
      !verifyRequestOrigin(originHeader, [allowedHosts])
    )
      throw getTRPCError(undefined, "CSFR Protection", "FORBIDDEN")[0];
  }

  const cookieHeader = req.headers.cookie;

  const sessionId = lucia.lucia.readSessionCookie(cookieHeader ?? "");
  if (!sessionId)
    throw getTRPCError(undefined, "Invalid cookie", "UNAUTHORIZED")[0];

  const { session, user } = await lucia.lucia.validateSession(sessionId);
  if (!session) {
    const sessionCookie = lucia.lucia.createBlankSessionCookie();
    res.setHeader("Set-Cookie", sessionCookie.serialize());

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid Session",
    });
  }

  if (session.fresh) {
    const sessionCookie = lucia.lucia.createSessionCookie(session.id);
    res.setHeader("Set-Cookie", sessionCookie.serialize());
  }

  return next();
});

export const privateProcedure = publicProcedure.use(isLoggedIn);
