import { create } from "zustand";

interface FlashcardFocusState {
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
}

export const useFlashcardFocusStore = create<FlashcardFocusState>((set) => ({
  focusedId: null,
  setFocusedId: (id) => set(() => ({ focusedId: id })),
}));
