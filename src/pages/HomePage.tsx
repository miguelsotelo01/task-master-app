import { useState, useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useUIStore } from "../store/useUIStore"; // Importar UI Store
import TaskItem from "../components/TaskItem";
import { Send } from "lucide-react"; // Icono para enviar

export default function HomePage() {
  const { tasks, addTask, fetchTasks } = useTaskStore(); // Agrega fetchTasks aquí
  const [newTask, setNewTask] = useState("");
  //const { tasks, addTask } = useTaskStore();
  const { isWriting, closeInput } = useUIStore(); // Usamos el estado global
  useEffect(() => {
    fetchTasks();
  }, []);
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    addTask(newTask);
    setNewTask("");
    closeInput(); // Cerramos el input al enviar
  };

  return (
    <div className="relative">
      {/* Header y Lista (Igual que antes) */}
      <div className="px-4 py-6 pb-32">
        {" "}
        {/* Mucho padding abajo para ver la última tarea */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Mis Tareas</h1>
          <p className="text-gray-500">
            {tasks.filter((t) => !t.is_completed).length} pendientes
          </p>
        </header>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <p>¡Todo limpio! 🎉</p>
            </div>
          ) : (
            tasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </div>
      </div>

      {/* --- AQUÍ ESTÁ LA MAGIA --- */}

      {/* 1. Fondo Oscuro (Overlay) - Solo visible si isWriting es true */}
      {isWriting && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={closeInput} // Si tocas fuera, se cierra
        />
      )}

      {/* 2. El Input que se desliza desde abajo */}
      <div
        className={`
          fixed bottom-24 left-4 right-4 z-50 transition-all duration-300 transform
          ${isWriting ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95 pointer-events-none"}
      `}
      >
        <form
          onSubmit={handleAddTask}
          className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-2"
        >
          <input
            autoFocus // Para que el teclado salga solo en el móvil
            type="text"
            placeholder="¿Qué tienes que hacer?"
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 text-lg placeholder:text-gray-400"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newTask.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:scale-95 transition-all"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
