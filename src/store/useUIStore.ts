import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. Importamos persistencia

interface UIState {
  isWriting: boolean;
  isDarkMode: boolean; // 2. Nuevo estado
  openInput: () => void;
  closeInput: () => void;
  toggleInput: () => void;
  toggleDarkMode: () => void; // 3. Nueva acción
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isWriting: false,
      isDarkMode: false, // Valor inicial (Light por defecto)

      openInput: () => set({ isWriting: true }),
      closeInput: () => set({ isWriting: false }),
      toggleInput: () => set((state) => ({ isWriting: !state.isWriting })),

      // Cambia de true a false y viceversa
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "ui-storage", // Nombre para guardar en localStorage
    },
  ),
);
