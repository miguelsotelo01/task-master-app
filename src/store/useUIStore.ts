import { create } from "zustand";

interface UIState {
  isWriting: boolean;
  openInput: () => void;
  closeInput: () => void;
  toggleInput: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isWriting: false,
  openInput: () => set({ isWriting: true }),
  closeInput: () => set({ isWriting: false }),
  toggleInput: () => set((state) => ({ isWriting: !state.isWriting })),
}));
