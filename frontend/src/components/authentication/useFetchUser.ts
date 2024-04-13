import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  useUserStore,
} from "../../lib/services/authentication/userStore";

type FetchUserProps = {
  user: User | null;
};

export const useFetchUser = ({ user }: FetchUserProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const userStore = useUserStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      userStore.actions.deleteUser();
    } else {
      userStore.actions.setUser(user);
    }
    setIsLoading(false);
  }, [user, router, userStore.actions, isLoading]);

  return { isLoading };
};
