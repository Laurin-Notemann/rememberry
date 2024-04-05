import { TRPCError } from "@trpc/server";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "../auth/lucia";
import { env } from "../env";
import { middleware, publicProcedure } from "../trpc";
import { getFrontendUrl, getTRPCError } from "../utils";
import { ScopedLogger } from "../logger";

const middlewareLogger = new ScopedLogger("Middleware");

const isLoggedIn = middleware(async ({ next, ctx }) => {
  const { req, res } = ctx;
  middlewareLogger.debug("Request:", req);
  const method = req.method;
  const headers = req.headers;
  if (method === "POST") {
    const originHeader = headers.origin;
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const allowedHosts = getFrontendUrl();
    if (
      !originHeader ||
      !allowedHosts ||
      !verifyRequestOrigin(originHeader, [allowedHosts])
    )
      throw getTRPCError(middlewareLogger, "CSFR Protection", "FORBIDDEN")[0];
  }

  const cookieHeader = req.headers.cookie;
  middlewareLogger.debug("Cookie:", cookieHeader);

  const sessionId = lucia.lucia.readSessionCookie(cookieHeader ?? "");
  if (!sessionId) {
    middlewareLogger.debug("sessionId not found");
    throw getTRPCError(middlewareLogger, "Invalid cookie", "UNAUTHORIZED")[0];
  }

  const { session, user } = await lucia.lucia.validateSession(sessionId);
  if (!session) {
    const sessionCookie = lucia.lucia.createBlankSessionCookie();
    res.setHeader("Set-Cookie", sessionCookie.serialize());

    throw getTRPCError(middlewareLogger, "Invalid Session", "UNAUTHORIZED")[0];
  }

  if (session.fresh) {
    const sessionCookie = lucia.lucia.createSessionCookie(session.id);
    res.setHeader("Set-Cookie", sessionCookie.serialize());
  }

  return next();
});

export const privateProcedure = publicProcedure.use(isLoggedIn);
