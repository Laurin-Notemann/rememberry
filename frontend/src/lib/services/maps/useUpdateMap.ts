import { backendHookWrapper } from "@frontend/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { MapUpdateInput, mapRouter } from "./map.types";

export const useUpdateMap = () => {
  const queryClient = useQueryClient();
  const mapUpdater = mapRouter.updateMap.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(mapRouter.getUsersMaps, undefined, "query"),
      });
    },
  });

  const updateMap = async (map: MapUpdateInput) => {
    return await backendHookWrapper(map, mapUpdater.mutateAsync);
  };

  return updateMap;
};
