import { useUserStore } from "../authentication/userStore";
import { MapGetMapsOutput, mapRouter } from "./map.types";

export const useGetMapByUserId = () => {
  const userId = useUserStore((state) => (state.user ? state.user.id : null));

  if (!userId) {
    return {
      isLoading: false,
      error: new Error("dongs"),
      isError: true,
      maps: [],
    };
  }

  const maps = mapRouter.getUsersMaps.useQuery(userId);

  return {
    isLoading: maps.isLoading,
    error: maps.error,
    isError: maps.isError,
    maps: maps.data as MapGetMapsOutput,
  };
};
