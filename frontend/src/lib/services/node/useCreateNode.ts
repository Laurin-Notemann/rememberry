import { backendHookWrapper } from "@frontend/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { NodeCreationInput } from "./node.types";
import { nodeRouter } from "./utils";

export default function useNodeCreate() {
  const queryClient = useQueryClient();
  const nodeCreator = nodeRouter.create.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(nodeRouter.getAllByMapId, undefined, "query"),
      });
    },
  });

  const createNode = async (node: NodeCreationInput) => {
    return await backendHookWrapper(node, nodeCreator.mutateAsync);
  };

  return createNode;
}
