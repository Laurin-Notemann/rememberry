import { env } from "@/lib/env";
import { AppRouter } from "@backend/routers/_app";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const getBackendUrll = () => {
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

export const regTrpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getBackendUrll(),
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
