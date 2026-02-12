import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Task {
  id: string;
  title: string;
  is_completed: boolean; // Ojo: Supabase usa snake_case por defecto en SQL
  created_at: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<void>; // 👈 Ya estaba definido aquí
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  // 1. OBTENER TAREAS (READ)
  fetchTasks: async () => {
    set({ loading: true });

    // Obtenemos el usuario actual
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return set({ tasks: [], loading: false });

    // Pedimos las tareas a Supabase
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando tareas:", error);
    } else {
      set({ tasks: data as Task[] });
    }
    set({ loading: false });
  },

  // 2. CREAR TAREA (CREATE)
  addTask: async (title) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Optimismo: Agregamos a la lista localmente primero
    const tempId = crypto.randomUUID();
    const newTask = {
      id: tempId,
      title,
      is_completed: false,
      created_at: new Date().toISOString(),
      user_id: user.id,
    };

    set((state) => ({ tasks: [newTask as any, ...state.tasks] }));

    // Enviamos a la nube
    const { data, error } = await supabase
      .from("tasks")
      .insert({ title, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error creando tarea:", error);
      // Rollback
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId) }));
    } else if (data) {
      // Reemplazamos la tarea temporal con la real
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === tempId ? (data as Task) : t)),
      }));
    }
  },

  // 3. ACTUALIZAR (UPDATE)
  toggleTask: async (id, currentStatus) => {
    // Optimismo UI
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, is_completed: !currentStatus } : t,
      ),
    }));

    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando:", error);
      // Rollback
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, is_completed: currentStatus } : t,
        ),
      }));
    }
  },

  // 4. BORRAR UNA (DELETE)
  deleteTask: async (id) => {
    const previousTasks = get().tasks; // Copia de seguridad

    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error borrando:", error);
      set({ tasks: previousTasks }); // Rollback
    }
  },

  // 5. BORRAR COMPLETADAS (BATCH DELETE) 🗑️
  deleteCompletedTasks: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const previousTasks = get().tasks; // Copia de seguridad por si falla

    // Actualización optimista: Borramos visualmente las completadas ya
    set((state) => ({
      tasks: state.tasks.filter((t) => !t.is_completed),
    }));

    // Borramos en Supabase
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("user_id", user.id) // Seguridad extra
      .eq("is_completed", true);

    if (error) {
      console.error("Error borrando completadas:", error);
      alert("Hubo un error al limpiar las tareas.");
      set({ tasks: previousTasks }); // Rollback (vuelven a aparecer)
    }
  },
}));
