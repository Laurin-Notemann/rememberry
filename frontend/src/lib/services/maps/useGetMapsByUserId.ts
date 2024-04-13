import { useUserStore } from "../authentication/userStore";
import { MapGetMapsOutput, mapRouter } from "./map.types";

export const useGetMapByUserId = () => {
  const userId = useUserStore((state) => {
    console.log("hallo cih hure");
    if (state.user) return state.user.id;
    console.log("hallo es ist schleches ist schlecht");
    return null;
  });

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
