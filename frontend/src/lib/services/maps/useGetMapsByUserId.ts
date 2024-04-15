import { User } from "../authentication/userStore";
imporhttps://github.com/rememberry-io/rememberry/pullst { mapRouter } from "./map.types";

export const useGetMapByUserId = (user: User | null) => {
  const maps = mapRouter.getUsersMaps.useQuery(user?.id || null);

  return maps;
};
