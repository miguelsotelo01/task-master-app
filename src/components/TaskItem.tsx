import { Trash2, Check } from "lucide-react";
import { useTaskStore, type Task } from "../store/useTaskStore";
import { clsx } from "clsx";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();

  return (
    <div className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all active:scale-[0.98]">
      {/* 1. Checkbox */}
      <button
        // ✅ Aquí ya lo tenías bien
        onClick={() => toggleTask(task.id, task.is_completed)}
        className={clsx(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
          // 🛠️ CAMBIO AQUÍ: task.is_completed
          task.is_completed
            ? "bg-blue-500 border-blue-500"
            : "border-gray-300 hover:border-blue-400",
        )}
      >
        {/* 🛠️ CAMBIO AQUÍ: task.is_completed */}
        {task.is_completed && (
          <Check size={14} className="text-white" strokeWidth={3} />
        )}
      </button>

      {/* 2. Texto */}
      <span
        className={clsx(
          "flex-1 font-medium transition-all duration-300",
          task.is_completed
            ? "text-gray-400 dark:text-gray-600 line-through"
            : "text-gray-700 dark:text-gray-200",
        )}
      >
        {task.title}
      </span>

      {/* 3. Botón Borrar */}
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
