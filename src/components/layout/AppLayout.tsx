import { Outlet, NavLink } from "react-router-dom";
import { Home, User, Plus } from "lucide-react"; // Importa Plus
import { useUIStore } from "../../store/useUIStore"; // Importa el store

export default function AppLayout() {
  const { toggleInput, isWriting } = useUIStore(); // Traemos la acción y el estado

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Navbar Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/" icon={<Home size={24} />} label="Tareas" />

          {/* BOTÓN CENTRAL (FAB) */}
          <div className="relative -top-6">
            <button
              onClick={toggleInput} // 👈 AHORA HACE ALGO
              className={`
                p-4 rounded-full shadow-xl transition-all duration-300
                ${isWriting ? "bg-red-500 rotate-45" : "bg-blue-600 hover:bg-blue-700"}
                text-white
              `}
            >
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>

          <NavItem to="/profile" icon={<User size={24} />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

// ... (El componente NavItem sigue igual abajo)
function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
          flex flex-col items-center justify-center w-full h-full space-y-1
          ${isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}
        `}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
}
