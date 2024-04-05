import { backendHookWrapper } from "@frontend/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { NodeDeleteInput } from "./node.types";
import { nodeRouter } from "./utils";

export default function useNodeDelete() {
  const queryClient = useQueryClient();

  const nodeDeletor = nodeRouter.deleteWithAllChildren.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(nodeRouter.getAllByMapId, undefined, "query"),
      });
    },
  });
  const deleteNode = async (node: NodeDeleteInput) => {
    return await backendHookWrapper(node, nodeDeletor.mutateAsync);
  };

  return deleteNode;
}
