import { z } from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import { mapControllerDrizzle } from "./map.controller";
import { getTRPCError } from "../../utils";

const createMapInput = z.object({
  userId: z.string(),
  name: z.string(),
  description: z.string(),
});

const updateMapInput = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  peerId: z.string().nullable(),
});

export const mapRouter = router({
  createMap: privateProcedure.input(createMapInput).mutation(async (opts) => {
    const [err, map] = await mapControllerDrizzle.createMap(opts.input);
    if (err) throw err;
    return map;
  }),

  getUsersMaps: privateProcedure
    .input(z.string().nullable())
    .query(async (opts) => {
      if (!opts.input) throw getTRPCError(null, "userId was null")[0];
      const [err, maps] = await mapControllerDrizzle.getMapsByUserId(
        opts.input,
      );

      if (err) throw err;

      return maps;
    }),

  updateMap: privateProcedure.input(updateMapInput).mutation(async (opts) => {
    const [err, map] = await mapControllerDrizzle.updateMapById(opts.input);
    if (err) throw err;

    return map;
  }),

  deleteMapWithAllStacks: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [err, success] = await mapControllerDrizzle.deleteMapById(
        opts.input,
      );
      if (err) throw err;

      return success;
    }),
});

export type mapRouter = typeof mapRouter;
