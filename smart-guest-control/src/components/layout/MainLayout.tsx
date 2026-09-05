import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEventStore } from '../../store/eventStore';
import { LayoutDashboard, Users, Grid, ScanLine, Settings, LogOut, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MainLayout() {
  const { role, setRole } = useEventStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole("RECEPCIONISTA");
    navigate('/login');
  };

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["ADMINISTRADOR", "HOST"] },
    { to: "/admin/tables", icon: Grid, label: "Mapa de Mesas", roles: ["ADMINISTRADOR", "HOST", "COORDINADOR"] },
    { to: "/admin/guests", icon: Users, label: "Invitados", roles: ["ADMINISTRADOR", "HOST", "COORDINADOR", "STAFF"] },
    { to: "/admin/smart-seating", icon: Wand2, label: "Acomodo Inteligente", roles: ["ADMINISTRADOR", "HOST"] },
    { to: "/reception", icon: ScanLine, label: "Recepción (App)", roles: ["ADMINISTRADOR", "HOST", "RECEPCIONISTA"] },
  ];

  const allowedNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="font-bold text-lg tracking-tight uppercase">Smart Guest Control</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {allowedNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50" 
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-semibold text-sm">
              {role.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{role}</p>
              <p className="text-xs text-zinc-500 mt-1">Conectado</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
          <h1 className="font-bold tracking-tight uppercase text-sm">Smart Guest Control</h1>
          <button onClick={handleLogout} className="p-2">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
