'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
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
  Edit2
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { User, Event, PlanTier, PLAN_CONFIG } from '@/types';

export default function SuperAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAdminData = () => {
    setUsers(InvitaStore.getUsers());
    setEvents(InvitaStore.getEvents());
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handlePlanChange = (userId: string, newPlan: PlanTier) => {
    InvitaStore.updateUserPlan(userId, newPlan);
    loadAdminData();
  };

  const currentUser = InvitaStore.getUser();

  const PLATFORM_STATS = [
    { label: 'Eventos en Plataforma', value: `${events.length} Eventos`, change: 'Activos en tiempo real' },
    { label: 'Cuentas Registradas', value: `${users.length} Usuarios`, change: 'Credenciales emitidas' },
    { label: 'Planes Premium Activos', value: `${users.filter(u => u.plan === 'IMPERIAL' || u.plan === 'ELEGANCE').length}`, change: 'Elegance & Imperial' },
    { label: 'Acceso Maestro', value: 'Administradorgeneral', change: 'Super Usuario Global' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
            Panel Global Super Admin • OSHUN
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Supervisión General & Gestión de Clientes
          </h2>
          <p className="text-xs text-[#778F8C]">
            Consulta de todos los eventos, usuarios y contraseñas generadas con modulación de planes en tiempo real.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#0F2424] text-white text-xs font-bold flex items-center gap-2 border border-[#D3B48C]/40">
          <ShieldAlert className="h-4 w-4 text-[#D3B48C]" />
          <span>Super Usuario Maestro Activo</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORM_STATS.map((stat, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-white border border-[#D3B48C]/40 shadow-sm space-y-2">
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

      {/* Usuarios & Credenciales Generadas Table */}
      <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3
              className="text-base font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Directorio de Usuarios, Credenciales & Planes Activos
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
                <th className="py-3 px-3">Contraseña</th>
                <th className="py-3 px-3">Plan Activo (Modulable)</th>
                <th className="py-3 px-3">Evento Asignado</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3B48C]/20">
              {users.map((u) => {
                const assignedEvent = events.find((e) => e.id === u.eventId || e.userId === u.id);
                const isSuperAdmin = u.role === 'SUPER_ADMIN';

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
                        <span className="px-3 py-1 rounded-full bg-[#0F2424] text-[#D3B48C] font-bold text-[10px] inline-flex items-center gap-1">
                          <Crown className="h-3 w-3" />
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
                        isSuperAdmin ? 'bg-amber-100 text-amber-900' : 'bg-[#EADBC6]/40 text-[#4E8281]'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {assignedEvent && (
                        <Link
                          href={`/events/${assignedEvent.id}/seating`}
                          className="btn-oshun-primary text-[10px] px-3 py-1 inline-flex items-center gap-1"
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

      {/* Todos los Eventos Creados en la Plataforma */}
      <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-base font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Todos los Eventos Activos en OSHUN ({events.length})
          </h3>
          <Link
            href="/events/new"
            className="btn-oshun-primary text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5"
          >
            <span>+ Crear Evento</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#4E8281] bg-[#C0D3CC]/40 px-2 py-0.5 rounded-full">
                  {ev.category}
                </span>
                <span className="text-xs text-[#778F8C]">{ev.date}</span>
              </div>

              <h4 className="text-sm font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                {ev.title}
              </h4>

              <p className="text-[11px] text-[#778F8C] truncate">
                📍 {ev.venueName} • {ev.city}
              </p>

              <div className="pt-2 border-t border-[#D3B48C]/30 flex items-center justify-between">
                <Link
                  href={`/i/${ev.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-[#4E8281] hover:underline inline-flex items-center gap-1"
                >
                  <span>Ver Web</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <Link
                  href={`/events/${ev.id}/guests`}
                  className="px-3 py-1 rounded-full bg-[#4E8281] text-white text-xs font-bold hover:bg-[#3E6D6C] transition-colors"
                >
                  Administrar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
