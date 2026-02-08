import { Trash2, Check } from "lucide-react";
import { useTaskStore, type Task } from "../store/useTaskStore";
import { clsx } from "clsx"; // Ayuda a combinar clases

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  // Traemos las acciones del store
  const { toggleTask, deleteTask } = useTaskStore();

  return (
    <div className="group flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-[0.98]">
      {/* 1. Custom Checkbox (Círculo) */}
      <button
        onClick={() => toggleTask(task.id)}
        className={clsx(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
          task.completed
            ? "bg-blue-500 border-blue-500"
            : "border-gray-300 hover:border-blue-400",
        )}
      >
        {task.completed && (
          <Check size={14} className="text-white" strokeWidth={3} />
        )}
      </button>

      {/* 2. Texto de la tarea */}
      <span
        className={clsx(
          "flex-1 text-gray-700 font-medium transition-all duration-300",
          task.completed && "text-gray-400 line-through",
        )}
      >
        {task.title}
      </span>

      {/* 3. Botón de Borrar (Solo visible al pasar el mouse en PC, o siempre en móvil si quitamos 'group-hover') */}
      <button
        title="borrar"
        onClick={() => deleteTask(task.id)}
        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
