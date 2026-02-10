import { User, Settings, Moon, LogOut, ShieldCheck, Award } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { supabase } from "../lib/supabase";
import { useUIStore } from "../store/useUIStore";

export default function ProfilePage() {
  const { isDarkMode, toggleDarkMode } = useUIStore(); // Traemos estado y acción
  const { tasks } = useTaskStore();

  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const totalTasks = tasks.length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-6">
      {/* 1. Encabezado del Perfil */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4">
          MS
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Miguel Sotelo
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm mt-2">
          Ingeniero de Software 🚀
        </span>
      </div>

      {/* 2. Tarjeta de Estadísticas */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Card Completadas */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-colors">
          <Award className="text-yellow-500 mb-2" size={28} />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            {completedTasks}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Completadas
          </span>
        </div>

        {/* Card Productividad */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-colors">
          <div className="relative w-10 h-10 flex items-center justify-center mb-1">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {progress}%
            </span>
            <svg
              className="absolute top-0 left-0 w-full h-full -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-gray-200 dark:text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-blue-500"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Productividad
          </span>
        </div>
      </div>

      {/* 3. Menú de Opciones */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <MenuItem icon={<User size={20} />} label="Editar Perfil" />
        <MenuItem icon={<ShieldCheck size={20} />} label="Seguridad" />
        <MenuItem icon={<Settings size={20} />} label="Configuración General" />

        {/* --- Toggle de Dark Mode REAL --- */}
        <div
          onClick={toggleDarkMode} // 👈 Acción de click
          className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Moon size={20} />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              Modo Oscuro
            </span>
          </div>

          {/* Switch Animado */}
          <div
            className={`w-11 h-6 rounded-full relative transition-colors ${isDarkMode ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-600"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${isDarkMode ? "left-5.5" : "left-0.5"}`}
            ></div>
          </div>
        </div>
        {/* ------------------------------- */}

        <div
          onClick={handleLogout}
          className="p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer transition-colors"
        >
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <LogOut size={20} />
          </div>
          <span className="font-medium">Cerrar Sesión</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
        Task Master v1.0.0 (2026)
      </p>
    </div>
  );
}

// Componente auxiliar actualizado con estilos Dark
function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {icon}
        </div>
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          {label}
        </span>
      </div>
      <span className="text-gray-300 dark:text-gray-600">›</span>
    </div>
  );
}
