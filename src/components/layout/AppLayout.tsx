import { Outlet, NavLink } from "react-router-dom";
import { Home, Calendar, User } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      {/* 1. Área de Contenido Principal (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Aquí se renderizarán las páginas (Home, Calendar, etc) */}
        <Outlet />
      </main>

      {/* 2. Bottom Navigation Bar (Fija abajo) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-safe">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/" icon={<Home size={24} />} label="Tareas" />

          {/* Botón Central Flotante (FAB) - Efecto visual */}
          <div className="relative -top-5">
            <button className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors">
              <span className="text-2xl font-bold">+</span>
            </button>
          </div>

          <NavItem to="/profile" icon={<User size={24} />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

// Subcomponente para los items del menú (para no repetir código)
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
