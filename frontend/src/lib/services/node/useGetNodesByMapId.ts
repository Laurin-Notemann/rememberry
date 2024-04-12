import { rqTrpc } from "../trpc/client";

export const useGetNodesByMapId = (mapId: string) => {
  const nodes = rqTrpc.node.getAllByMapId.useQuery(mapId);

  return nodes;
};
