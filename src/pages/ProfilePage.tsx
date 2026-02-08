import { User, Settings, Moon, LogOut, ShieldCheck, Award } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";

export default function ProfilePage() {
  const { tasks } = useTaskStore();

  // Calculamos estadísticas reales basadas en tu store
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="p-6">
      {/* 1. Encabezado del Perfil */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4">
          MS
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Miguel Sotelo</h2>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm mt-2">
          Ingeniero de Software 🚀
        </span>
      </div>

      {/* 2. Tarjeta de Estadísticas */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <Award className="text-yellow-500 mb-2" size={28} />
          <span className="text-2xl font-bold text-gray-800">
            {completedTasks}
          </span>
          <span className="text-xs text-gray-400">Completadas</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="relative w-10 h-10 flex items-center justify-center mb-1">
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
            {/* Círculo de progreso simple SVG */}
            <svg
              className="absolute top-0 left-0 w-full h-full -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-gray-200"
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
          <span className="text-xs text-gray-400 mt-1">Productividad</span>
        </div>
      </div>

      {/* 3. Menú de Opciones (Settings) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <MenuItem icon={<User size={20} />} label="Editar Perfil" />
        <MenuItem icon={<ShieldCheck size={20} />} label="Seguridad" />
        <MenuItem icon={<Settings size={20} />} label="Configuración General" />

        {/* Toggle Falso de Dark Mode */}
        <div className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Moon size={20} />
            </div>
            <span className="text-gray-700 font-medium">Modo Oscuro</span>
          </div>
          <div className="w-11 h-6 bg-gray-200 rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
          <div className="p-2 bg-red-50 rounded-lg">
            <LogOut size={20} />
          </div>
          <span className="font-medium">Cerrar Sesión</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Task Master v1.0.0 (2026)
      </p>
    </div>
  );
}

// Componente auxiliar para las filas del menú
function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <span className="text-gray-300">›</span>
    </div>
  );
}
