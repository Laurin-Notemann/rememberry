import { backendHookWrapper } from "@frontend/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { MapCreateInput, mapRouter } from "./map.types";

export default function useCreateMap() {
  const queryClient = useQueryClient();
  const mapCreator = mapRouter.createMap.useMutation({
    onSuccess() {
      queryClient.refetchQueries({
        queryKey: getQueryKey(mapRouter.getUsersMaps, undefined, "query"),
      });
    },
  });

  const createMap = async (map: MapCreateInput) => {
    return await backendHookWrapper(map, mapCreator.mutateAsync);
  };

  return createMap;
}
