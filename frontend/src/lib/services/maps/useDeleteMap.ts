import { backendHookWrapper } from "@frontend/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { MapDeleteInput, mapRouter } from "./map.types";

export const useDeleteMap = () => {
  const queryClient = useQueryClient();
  const mapDeletion = mapRouter.deleteMapWithAllStacks.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(mapRouter.getUsersMaps, undefined, "query"),
      });
    },
  });

  const deleteMap = async (mapId: MapDeleteInput) => {
    return await backendHookWrapper(mapId, mapDeletion.mutateAsync);
  };

  return deleteMap;
};
