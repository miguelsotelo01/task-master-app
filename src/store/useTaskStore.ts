import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // 👈 Importamos esto

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    // 👈 Envolvemos todo en persist(...)
    (set) => ({
      tasks: [
        // Puedes dejar esto vacío [] si prefieres empezar de cero
        {
          id: "1",
          title: "Configurar PWA 📱",
          completed: true,
          createdAt: Date.now(),
        },
        {
          id: "2",
          title: "Aprender Zustand 🐻",
          completed: false,
          createdAt: Date.now(),
        },
      ],

      addTask: (title) =>
        set((state) => ({
          tasks: [
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              createdAt: Date.now(),
            },
            ...state.tasks,
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "task-storage", // 👈 Nombre de la key en localStorage
      storage: createJSONStorage(() => localStorage), // 👈 Dónde guardar
    },
  ),
);
