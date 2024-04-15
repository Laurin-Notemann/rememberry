import z from "zod";
import { privateProcedure } from "../../middleware/validateSession";
import { router } from "../../trpc";
import { nodeControllerDrizzle } from "./nodes.controller";
import { changeParentNodeInput, newNodeInput, nodeInput } from "./nodes.types";
import { getTRPCError } from "../../utils";

export const nodeRouter = router({
  create: privateProcedure.input(newNodeInput).mutation(async (opts) => {
    const [err, node] = await nodeControllerDrizzle.createNode(opts.input);

    if (err) throw err;

    return node;
  }),

  getAllByUserId: privateProcedure
    .input(z.string().nullable())
    .query(async (opts) => {
      if (!opts.input) throw getTRPCError(null, "userId was null")[0];
      const [err, node] = await nodeControllerDrizzle.getAllByUserId(
        opts.input,
      );

      if (err) throw err;

      return node;
    }),

  getById: privateProcedure.input(z.string()).query(async (opts) => {
    const [err, node] = await nodeControllerDrizzle.getNodeById(opts.input);

    if (err) throw err;

    return node;
  }),

  getTopLevelNodesByMapId: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] = await nodeControllerDrizzle.getTopLevelNodesByMapId(
        opts.input,
      );

      if (err) throw err;

      return nodes;
    }),

  getDirectChildrenNodesFromParentNode: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] =
        await nodeControllerDrizzle.getDirectChildrenNodesFromParentNode(
          opts.input,
        );

      if (err) throw err;

      return nodes;
    }),

  getAllChildrenNodesFromParent: privateProcedure
    .input(z.string())
    .query(async (opts) => {
      const [err, nodes] =
        await nodeControllerDrizzle.getAllChildrenNodesFromParentNode(
          opts.input,
        );

      if (err) throw err;

      return nodes;
    }),

  getAllByMapId: privateProcedure.input(z.string()).query(async (opts) => {
    const [err, nodes] = await nodeControllerDrizzle.getNodesByMapId(
      opts.input,
    );

    if (err) throw err;

    return nodes;
  }),

  updateById: privateProcedure.input(nodeInput).mutation(async (opts) => {
    const [err, node] = await nodeControllerDrizzle.updateNodeById(opts.input);

    if (err) throw err;

    return node;
  }),

  changeParent: privateProcedure
    .input(changeParentNodeInput)
    .mutation(async (opts) => {
      const [err, node] = await nodeControllerDrizzle.changeParentNode(
        opts.input.parentId,
        opts.input.childId,
      );

      if (err) throw err;

      return node;
    }),

  deleteParentRelation: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [err, node] = await nodeControllerDrizzle.deleteParentNodeRelation(
        opts.input,
      );

      if (err) throw err;

      return node;
    }),

  deleteAndMoveChildrenUp: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [err, nodes] =
        await nodeControllerDrizzle.deleteMiddleOrderNodeAndMoveChildrenUp(
          opts.input,
        );

      if (err) throw err;

      return nodes;
    }),

  deleteWithAllChildren: privateProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const [err, nodes] = await nodeControllerDrizzle.deleteNodeAndChildren(
        opts.input,
      );

      if (err) throw err;

      return nodes;
    }),
});

export type nodeRouter = typeof nodeRouter;
