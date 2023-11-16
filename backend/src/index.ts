import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { createContext } from "./context";
import { appRouter } from "./routers/_app";
import env from "./env";

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

server.listen(env.PORT);

console.log("server listening on http://localhost:" + env.PORT);
