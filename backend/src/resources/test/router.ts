import { publicProcedure, router } from "../../trpc";
import { testModel } from "./model";

export const testRouter = router({
  test: publicProcedure.query(async (opts) => {
    return "success";
  }),
});

export type testRouter = typeof testRouter;
