import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import TaskItem from "../components/TaskItem";

export default function HomePage() {
  const [newTask, setNewTask] = useState("");
  const { tasks, addTask } = useTaskStore();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask(""); // Limpiar input
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Mis Tareas
        </h1>
        <p className="text-gray-500 mt-1">
          Tienes {tasks.filter((t) => !t.completed).length} pendientes hoy.
        </p>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-3 mb-24">
        {" "}
        {/* Margin bottom para no chocar con el input fijo */}
        {tasks.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <p>¡Todo limpio! 🎉</p>
            <p className="text-sm">Agrega una tarea para empezar.</p>
          </div>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>

      {/* Input Flotante (Simulando App de Chat/Tareas) */}
      <form
        onSubmit={handleAddTask}
        className="fixed bottom-20 left-4 right-4 bg-white p-2 rounded-full shadow-xl border border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Escribe una nueva tarea..."
          className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newTask.trim()}
        >
          <span className="font-bold text-xl leading-none">+</span>
        </button>
      </form>
    </div>
  );
}
