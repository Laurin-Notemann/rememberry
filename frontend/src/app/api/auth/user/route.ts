import { env } from "@/lib/env";
import { AppRouter } from "@backend/routers/_app";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { NextRequest } from "next/server";
import superjson from "superjson";

export async function GET(req: NextRequest) {
  const session = req.nextUrl.searchParams.get("session");

  if (!session) {
    return Response.json(
      { status: "error", message: "No Session" },
      { status: 400 },
    );
  }

  try {
    const trpc = getTrpcClient(session);

    const user = await trpc.user.getUserBySession.query();

    return Response.json({ status: "successful", user: user }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json(
      { status: "error", message: "Could not fetch user" },
      { status: 400 },
    );
  }
}

function getTrpcClient(session: string) {
  const getBackendUrll = () => {
    if (env.NEXT_PUBLIC_IS_DEV) {
      return (
        "http://" +
        env.NEXT_PUBLIC_BACKEND_HOST +
        ":" +
        env.NEXT_PUBLIC_BACKEND_PORT
      );
    } else {
      return "https://" + env.NEXT_PUBLIC_BACKEND_HOST;
    }
  };

  const regTrpc = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: getBackendUrll(),
        headers() {
          return {
            Cookie: "auth_session=" + session,
          };
        },
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });

  return regTrpc;
}
