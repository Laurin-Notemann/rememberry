import { create } from "zustand";
import { ConfirmOutput } from "./useRegisterUser";

export type User = {
  id: string;
  username: string;
  email: string;
};

interface UserStore {
  user: User | null;

  actions: {
    setUser: (user: ConfirmOutput) => ConfirmOutput;
    deleteUser: () => void;
  };
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  actions: {
    setUser: (user): ConfirmOutput => {
      set(() => ({
        user: user,
      }));
      return user;
    },
    deleteUser() {
      set(() => ({
        user: null,
      }));
    },
  },
}));
