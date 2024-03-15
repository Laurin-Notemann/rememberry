import { create } from "zustand";

type State = {
  dropdownName: string;
};

type Action = {
  updateDropDown: (dropdownName: State["dropdownName"]) => void;
};

const useDropDownFocusStore = create<State & Action>((set) => ({
  dropdownName: "level",
  updateDropDown: (dropdownName) => set(() => ({ dropdownName: dropdownName })),
}));

export default useDropDownFocusStore;
