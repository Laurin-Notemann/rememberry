import { create } from "zustand";
import { RegisterUserOutput } from "./useRegisterUser";

export type User = {
  id: string;
  username: string;
  email: string;
};

interface UserStore {
  user: User | null;

  actions: {
    setUser: (user: RegisterUserOutput) => RegisterUserOutput;
    deleteUser: () => void;
  };
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  actions: {
    setUser: (user): RegisterUserOutput => {
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
