import { create } from "zustand";

type State = {
  dropdownName: string;
};

type Action = {
  updateDropDown: (dropdownName: State["dropdownName"]) => void;
};

export const useDropDownFocusStore = create<State & Action>((set) => ({
  dropdownName: "Difficulty",
  updateDropDown: (dropdownName) => set(() => ({ dropdownName: dropdownName })),
}));
