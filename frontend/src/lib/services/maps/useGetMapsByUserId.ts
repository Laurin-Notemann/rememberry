import { User } from "../authentication/userStore";
import { mapRouter } from "./map.types";

export const useGetMapByUserId = (user: User | null) => {
  const maps = mapRouter.getUsersMaps.useQuery(user?.id || null);

  return maps;
};
