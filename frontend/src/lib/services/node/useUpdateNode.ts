import { backendHookWrapper } from "@frontend/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { NodeUpdateInput } from "./node.types";
import { nodeRouter } from "./utils";

export default function useNodeUpdate() {
  const queryClient = useQueryClient();

  const nodeUpdater = nodeRouter.updateById.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(nodeRouter.getAllByMapId, undefined, "query"),
      });
    },
  });

  const updatedNode = async (node: NodeUpdateInput) => {
    return await backendHookWrapper(node, nodeUpdater.mutateAsync);
  };

  return updatedNode;
}
