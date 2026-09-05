'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OshunLogo from '@/components/ui/OshunLogo';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import {
  ShieldAlert,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Server,
  Activity,
  CheckCircle2,
  Lock,
  KeyRound,
  ExternalLink,
  Crown,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Edit2,
  AlertCircle,
  LogOut,
  PlusCircle,
  Clock,
  Sparkle
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { User, Event, PlanTier, PLAN_CONFIG } from '@/types';
import { SUPER_ADMIN_USER } from '@/lib/mock-data';

export default function SuperAdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Formulario de login maestro en caso de no tener sesión activa
  const [adminUsername, setAdminUsername] = useState('Administradorgeneral');
  const [adminPassword, setAdminPassword] = useState('JanetySergio2908');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Datos del panel maestro
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAdminData = () => {
    const user = InvitaStore.getUser();
    setCurrentUser(user);
    setUsers(InvitaStore.getUsers());
    setEvents(InvitaStore.getEvents());
  };

  useEffect(() => {
    loadAdminData();
    setIsCheckingAuth(false);

    const handleSync = () => {
      loadAdminData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('oshun_events_updated', handleSync);
    window.addEventListener('oshun_users_updated', handleSync);
    window.addEventListener('oshun_auth_changed', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('oshun_events_updated', handleSync);
      window.removeEventListener('oshun_users_updated', handleSync);
      window.removeEventListener('oshun_auth_changed', handleSync);
    };
  }, []);

  const handleMasterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const result = InvitaStore.login(adminUsername.trim(), adminPassword.trim());
      setIsLoggingIn(false);

      if (result.success && result.user) {
        if (
          result.user.role === 'SUPER_ADMIN' ||
          result.user.role === 'ADMIN' ||
          result.user.username?.toLowerCase() === 'administradorgeneral'
        ) {
          setCurrentUser(result.user);
          loadAdminData();
        } else {
          setLoginError('La cuenta ingresada no cuenta con privilegios de Administrador General.');
        }
      } else {
        setLoginError(result.error || 'Credenciales maestras incorrectas.');
      }
    }, 400);
  };

  const handleQuickMasterLogin = () => {
    setAdminUsername('Administradorgeneral');
    setAdminPassword('JanetySergio2908');
    setIsLoggingIn(true);
    setTimeout(() => {
      const result = InvitaStore.login('Administradorgeneral', 'JanetySergio2908');
      setIsLoggingIn(false);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        loadAdminData();
      }
    }, 300);
  };

  const handleLogout = () => {
    InvitaStore.logout();
    setCurrentUser(null);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadAdminData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handlePlanChange = (userId: string, newPlan: PlanTier) => {
    InvitaStore.updateUserPlan(userId, newPlan);
    loadAdminData();
  };

  const isMasterSessionActive =
    currentUser &&
    (currentUser.role === 'SUPER_ADMIN' ||
      currentUser.role === 'ADMIN' ||
      currentUser.username?.toLowerCase() === 'administradorgeneral');

  // Vista de Carga Inicial
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <OshunLogo variant="horizontal" size="md" />
        <p className="text-xs font-bold text-[#4E8281] uppercase tracking-widest font-cinzel animate-pulse">
          Verificando Credenciales de Administrador Maestro...
        </p>
      </div>
    );
  }

  // VISTA 1: FORMULARIO DE INICIO DE SESIÓN MAESTRO (Si NO hay sesión activa de Administrador General)
  if (!isMasterSessionActive) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4 selection:bg-[#4E8281] selection:text-white relative overflow-hidden">
        {/* Background Decorative Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D3B48C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#4E8281]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full rounded-3xl bg-white border-2 border-[#D3B48C] p-8 sm:p-10 shadow-2xl space-y-6 relative z-10 animate-in zoom-in-95 duration-300">
          
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-[#0F2424] border border-[#D3B48C]/50 text-[#D3B48C] shadow-md mb-1">
              <ShieldAlert className="h-7 w-7 text-[#D3B48C]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D3B48C] font-cinzel block">
              PANEL MAESTRO • SUPER ADMIN
            </span>
            <h1
              className="text-2xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Acceso a Administración Global
            </h1>
            <p className="text-xs text-[#778F8C]">
              Ingresa con la cuenta maestra <strong className="text-[#162E2D]">Administradorgeneral</strong> para gestionar todos los eventos y usuarios.
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleMasterLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1.5">
                Usuario Maestro *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Administradorgeneral"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/60 px-4 py-2.5 text-xs text-gray-900 font-medium placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#4E8281]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1.5">
                Contraseña Maestra *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/60 px-4 pr-10 py-2.5 text-xs text-gray-900 font-medium placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#4E8281]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#778F8C] hover:text-[#162E2D]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full btn-oshun-primary py-3 rounded-full text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoggingIn ? (
                <span>Verificando Acceso Maestro...</span>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 text-[#D3B48C]" />
                  <span>Ingresar al Panel Maestro</span>
                </>
              )}
            </button>
          </form>

          {/* Botón de Acceso Rápido Maestro */}
          <div className="pt-3 border-t border-[#D3B48C]/30 text-center space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#778F8C] font-bold block">
              Acceso Rápido de Prueba:
            </span>
            <button
              type="button"
              onClick={handleQuickMasterLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0F2424] hover:bg-[#1A3838] text-[#D3B48C] text-[11px] font-bold border border-[#D3B48C]/40 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>⚡ Ingresar como Administradorgeneral</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <Link
              href="/login"
              className="text-xs font-bold text-[#4E8281] hover:underline"
            >
              ← Ir al Login General de Clientes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: PANEL MAESTRO COMPLETO (Sesión activa de Administradorgeneral)
  const PLATFORM_STATS = [
    { label: 'Eventos en Base de Datos', value: `${events.length} Eventos`, change: 'Sincronizados en tiempo real' },
    { label: 'Cuentas & Clientes', value: `${users.length} Usuarios`, change: 'Credenciales activas' },
    { label: 'Planes Premium Activos', value: `${users.filter(u => u.plan === 'IMPERIAL' || u.plan === 'ELEGANCE').length} Cuentas`, change: 'Elegance & Imperial' },
    { label: 'Sesión Maestra Activa', value: currentUser?.username || 'Administradorgeneral', change: 'Super Usuario Global' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#162E2D]">
      {/* Sidebar de navegación */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Área Principal de Contenido */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Header del Panel Maestro */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#D3B48C]/50 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C] bg-[#0F2424] px-2.5 py-0.5 rounded-full font-cinzel">
                  PANEL GLOBAL SUPER ADMIN • OSHUN
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>En Línea</span>
                </span>
              </div>
              <h2
                className="text-xl sm:text-2xl font-bold text-[#162E2D]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Supervisión General & Gestión de Base de Datos
              </h2>
              <p className="text-xs text-[#778F8C]">
                Supervisión total de eventos creados, usuarios registrados, claves automáticas y modulación de planes.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleManualRefresh}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-[#FAF6F0] text-[#162E2D] border border-[#D3B48C] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                title="Recargar eventos y usuarios"
              >
                <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
                <span>Actualizar</span>
              </button>

              <Link
                href="/events/new"
                className="btn-oshun-primary text-xs px-4 py-2 rounded-full inline-flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="h-4 w-4 text-[#D3B48C]" />
                <span>+ Crear Evento</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Cerrar sesión de Administrador General"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Tarjetas de Métricas Globales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORM_STATS.map((stat, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-white border border-[#D3B48C]/40 shadow-sm space-y-2 hover:border-[#4E8281] transition-all">
                <span className="text-xs font-semibold text-[#778F8C] block">{stat.label}</span>
                <span
                  className="text-xl font-bold text-[#4E8281] block truncate"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  {stat.change}
                </span>
              </div>
            ))}
          </div>

          {/* Directorio de Usuarios, Credenciales & Modulación de Planes */}
          <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3
                  className="text-base font-bold text-[#162E2D]"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Directorio de Usuarios, Credenciales & Planes Activos ({users.length})
                </h3>
                <p className="text-xs text-[#778F8C]">
                  Credenciales generadas automáticamente para cada cliente al crear su evento. Puedes ajustar su plan con 1 clic.
                </p>
              </div>
              <span className="text-xs font-bold text-[#4E8281] bg-[#4E8281]/10 px-3 py-1 rounded-full">
                Total: {users.length} Cuentas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F0] border-b border-[#D3B48C]/30 text-[#778F8C] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Usuario / Cuenta</th>
                    <th className="py-3 px-3">Contraseña de Acceso</th>
                    <th className="py-3 px-3">Plan Activo (Modulable)</th>
                    <th className="py-3 px-3">Evento Asignado</th>
                    <th className="py-3 px-3">Rol</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3B48C]/20">
                  {users.map((u) => {
                    const assignedEvent = events.find((e) => e.id === u.eventId || e.userId === u.id);
                    const isSuperAdmin = u.role === 'SUPER_ADMIN' || u.username?.toLowerCase() === 'administradorgeneral';

                    return (
                  <tr key={u.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#162E2D]">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-[#4E8281] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block">{u.name}</span>
                          <span className="text-[10px] font-mono text-[#778F8C] font-normal">{u.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-mono text-xs font-bold text-[#4E8281] bg-[#FAF6F0] px-2.5 py-1 rounded-lg border border-[#D3B48C]/30 inline-block">
                        {u.password || 'JanetySergio2908'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {isSuperAdmin ? (
                        <span className="px-3 py-1 rounded-full bg-[#0F2424] text-[#D3B48C] font-bold text-[10px] inline-flex items-center gap-1 border border-[#D3B48C]/40">
                          <Crown className="h-3 w-3 text-[#D3B48C]" />
                          <span>Acceso Total Imperial</span>
                        </span>
                      ) : (
                        <select
                          value={u.plan}
                          onChange={(e) => handlePlanChange(u.id, e.target.value as PlanTier)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-[#D3B48C] font-bold text-[11px] text-[#162E2D] focus:ring-2 focus:ring-[#4E8281] cursor-pointer"
                        >
                          <option value="ESENCIAL">🌿 Plan Esencial</option>
                          <option value="ELEGANCE">✨ Plan Elegance (Pro)</option>
                          <option value="IMPERIAL">👑 Plan Imperial (VIP)</option>
                        </select>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {assignedEvent ? (
                        <Link
                          href={`/events/${assignedEvent.id}/guests`}
                          className="font-bold text-[#4E8281] hover:underline inline-flex items-center gap-1 truncate max-w-[160px]"
                        >
                          <span>{assignedEvent.title}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </Link>
                      ) : (
                        <span className="text-[#778F8C]">Global / Todos</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSuperAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-[#EADBC6]/40 text-[#4E8281]'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {assignedEvent && (
                        <Link
                          href={`/events/${assignedEvent.id}/guests`}
                          className="btn-oshun-primary text-[10px] px-3 py-1 inline-flex items-center gap-1 rounded-full"
                        >
                          <span>Gestionar</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Todos los Eventos Creados en la Base de Datos */}
      <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-base font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Eventos Creados en la Base de Datos ({events.length})
            </h3>
            <p className="text-xs text-[#778F8C]">
              Lista completa de eventos publicados con acceso directo a su invitación digital y módulos de gestión.
            </p>
          </div>
          <Link
            href="/events/new"
            className="btn-oshun-primary text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 rounded-full"
          >
            <span>+ Crear Evento</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-3 hover:border-[#4E8281] transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#4E8281] bg-[#C0D3CC]/40 px-2.5 py-0.5 rounded-full">
                  {ev.category}
                </span>
                <span className="text-xs text-[#778F8C] font-semibold">{ev.date}</span>
              </div>

              <h4 className="text-sm font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                {ev.title}
              </h4>

              <p className="text-[11px] text-[#778F8C] truncate">
                📍 {ev.venueName || 'Sede por definir'} • {ev.city || 'Ciudad'}
              </p>

              <div className="pt-3 border-t border-[#D3B48C]/30 flex items-center justify-between gap-2">
                <Link
                  href={`/i/${ev.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-[#4E8281] hover:underline inline-flex items-center gap-1"
                >
                  <span>Ver Web</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/events/${ev.id}/seating`}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#D3B48C] text-[#162E2D] text-[10px] font-bold hover:bg-[#FAF6F0] transition-colors"
                  >
                    Mesas
                  </Link>
                  <Link
                    href={`/events/${ev.id}/guests`}
                    className="px-3 py-1 rounded-full bg-[#4E8281] text-white text-xs font-bold hover:bg-[#3E6D6C] transition-colors"
                  >
                    Administrar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
</div>
  );
}
