'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Clock,
  UserX,
  Plus,
  ArrowRight,
  TrendingUp,
  Share2,
  QrCode,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { InvitaStore } from '@/lib/store';
import { formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const events = InvitaStore.getEvents();
  const currentEvent = events[0];

  if (!currentEvent) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-[#D3B48C]/40 bg-white/80 p-8 text-center">
        <Sparkles className="h-12 w-12 text-[#D3B48C] mb-4" />
        <h3 className="text-xl font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
          No tienes eventos activos
        </h3>
        <p className="text-xs text-[#778F8C] max-w-sm mt-1 mb-6">
          Comienza creando tu primer evento con las plantillas oficiales de OSHUN.
        </p>
        <Link
          href="/events/new"
          className="btn-oshun-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Crear Primer Evento</span>
        </Link>
      </div>
    );
  }

  const guests = InvitaStore.getGuestsForEvent(currentEvent.id);
  const stats = InvitaStore.getEventStats(currentEvent.id);

  // Recharts Evolution Data
  const RSVP_TIMELINE_DATA = [
    { date: 'Sem 1', confirmados: 25, pendientes: 225 },
    { date: 'Sem 2', confirmados: 68, pendientes: 182 },
    { date: 'Sem 3', confirmados: 120, pendientes: 130 },
    { date: 'Sem 4', confirmados: 155, pendientes: 95 },
    { date: 'Sem 5', confirmados: 175, pendientes: 75 },
    { date: 'Hoy', confirmados: stats.confirmed, pendientes: stats.pending },
  ];

  // Group Distribution Pie Chart Data with OSHUN Palette
  const GROUP_PIE_DATA = [
    { name: 'Familia Novia', value: 65, color: '#4E8281' },
    { name: 'Familia Novio', value: 55, color: '#97B8B3' },
    { name: 'Amigos', value: 70, color: '#D3B48C' },
    { name: 'VIP', value: 35, color: '#778F8C' },
    { name: 'Trabajo / Otros', value: 25, color: '#C0D3CC' },
  ];

  const recentGuests = guests.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Active Event Showcase */}
      <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADBC6]/30 text-[#4E8281] text-[10px] font-bold uppercase tracking-wider">
            <span className="text-[#D3B48C]">✦</span>
            <span>Evento Principal • OSHUN</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#162E2D] tracking-wide"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {currentEvent.title}
          </h1>
          <p className="text-xs text-[#778F8C]">
            {currentEvent.venueName} • {currentEvent.city} • Fecha: {currentEvent.date} ({currentEvent.time} hrs)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link
            href={`/i/${currentEvent.slug}`}
            target="_blank"
            className="px-4 py-2.5 rounded-full bg-[#FAF6F0] hover:bg-[#EFE3D4] text-[#4E8281] border border-[#4E8281]/40 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Ver Invitación Web</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/events/${currentEvent.id}/editor`}
            className="btn-oshun-primary text-xs px-5 py-2.5 inline-flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Editar Diseño</span>
          </Link>
        </div>
      </div>

      {/* 6 Real-time Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="rounded-2xl p-4 bg-white border border-[#D3B48C]/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#778F8C] block">Total Invitados</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#162E2D]">{stats.totalGuests}</span>
            <span className="text-[10px] text-[#778F8C]">cupos</span>
          </div>
          <span className="text-[10px] text-[#4E8281] font-semibold block">100% capacidad</span>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-emerald-500/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Confirmados</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-700">{stats.confirmed}</span>
            <span className="text-[10px] text-emerald-800 font-semibold">{stats.confirmationRate}%</span>
          </div>
          <span className="text-[10px] text-emerald-800 block">+{stats.confirmedCompanions} acompañantes</span>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-amber-500/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Pendientes</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-700">{stats.pending}</span>
            <span className="text-[10px] text-amber-800">por responder</span>
          </div>
          <span className="text-[10px] text-amber-800 block">Requieren aviso</span>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-rose-500/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-800 block">No Asistirán</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-rose-700">{stats.declined}</span>
            <span className="text-[10px] text-rose-800">declinados</span>
          </div>
          <span className="text-[10px] text-rose-800 block">Lugares liberados</span>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-[#4E8281]/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#4E8281] block">Pases en Sala</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#4E8281]">{stats.confirmedTotalHeadcount}</span>
            <span className="text-[10px] text-[#778F8C]">asistentes</span>
          </div>
          <span className="text-[10px] text-[#778F8C] block">Para banquetería</span>
        </div>

        <div className="rounded-2xl p-4 bg-[#0F2424] text-white border border-[#D3B48C]/40 shadow-md space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#D3B48C] block">Check-in QR</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white">{stats.checkedIn}</span>
            <span className="text-[10px] text-emerald-400 font-bold">{stats.checkInRate}%</span>
          </div>
          <span className="text-[10px] text-[#C0D3CC] block">Ingresaron en puerta</span>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart: RSVP Evolution */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-sm font-bold text-[#162E2D]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Evolución de Confirmaciones RSVP
              </h3>
              <p className="text-[11px] text-[#778F8C]">Ritmo de respuestas registradas a través de la web</p>
            </div>
            <span className="text-xs font-bold text-[#4E8281] bg-[#C0D3CC]/30 px-3 py-1 rounded-full">
              73.6% Confirmado
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RSVP_TIMELINE_DATA}>
                <defs>
                  <linearGradient id="colorConfirmados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4E8281" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4E8281" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPendientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D3B48C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D3B48C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE3D4" />
                <XAxis dataKey="date" stroke="#778F8C" fontSize={11} tickLine={false} />
                <YAxis stroke="#778F8C" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6F0',
                    borderColor: '#D3B48C',
                    borderRadius: '16px',
                    fontSize: '11px',
                    color: '#162E2D',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="confirmados"
                  stroke="#4E8281"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorConfirmados)"
                  name="Confirmados"
                />
                <Area
                  type="monotone"
                  dataKey="pendientes"
                  stroke="#D3B48C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPendientes)"
                  name="Pendientes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Groups Distribution */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3
              className="text-sm font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Distribución por Grupos
            </h3>
            <p className="text-[11px] text-[#778F8C]">Segmentación de la lista de invitados</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GROUP_PIE_DATA}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {GROUP_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6F0',
                    borderColor: '#D3B48C',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#778F8C]">
            {GROUP_PIE_DATA.map((g, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                <span className="truncate">{g.name} ({g.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Action Shortcuts */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
          <h3
            className="text-sm font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Accesos Rápidos
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/events/${currentEvent.id}/guests`}
              className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EFE3D4] border border-[#D3B48C]/30 transition-all space-y-1.5 group"
            >
              <div className="h-8 w-8 rounded-xl bg-[#4E8281] text-white flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[#162E2D] group-hover:text-[#4E8281]">Lista de Invitados</h4>
              <p className="text-[10px] text-[#778F8C]">Buscar, editar y exportar CSV</p>
            </Link>

            <Link
              href={`/events/${currentEvent.id}/whatsapp`}
              className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EFE3D4] border border-[#D3B48C]/30 transition-all space-y-1.5 group"
            >
              <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[#162E2D] group-hover:text-emerald-700">Hub de WhatsApp</h4>
              <p className="text-[10px] text-[#778F8C]">Enviar recordatorios en 1-clic</p>
            </Link>

            <Link
              href={`/events/${currentEvent.id}/checkin`}
              className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EFE3D4] border border-[#D3B48C]/30 transition-all space-y-1.5 group"
            >
              <div className="h-8 w-8 rounded-xl bg-[#0F2424] text-[#D3B48C] flex items-center justify-center">
                <QrCode className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[#162E2D] group-hover:text-[#4E8281]">Escáner de Puerta</h4>
              <p className="text-[10px] text-[#778F8C]">Validar boletos QR en vivo</p>
            </Link>

            <Link
              href={`/events/${currentEvent.id}/editor`}
              className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EFE3D4] border border-[#D3B48C]/30 transition-all space-y-1.5 group"
            >
              <div className="h-8 w-8 rounded-xl bg-[#D3B48C] text-[#0F2424] flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[#162E2D] group-hover:text-[#4E8281]">Editor Visual</h4>
              <p className="text-[10px] text-[#778F8C]">Personalizar colores y música</p>
            </Link>
          </div>
        </div>

        {/* Recent Guests Feed */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Actividad Reciente de Invitados
            </h3>
            <Link
              href={`/events/${currentEvent.id}/guests`}
              className="text-xs font-bold text-[#4E8281] hover:underline"
            >
              Ver todos (250) →
            </Link>
          </div>

          <div className="divide-y divide-[#D3B48C]/20">
            {recentGuests.map((guest) => (
              <div key={guest.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#EADBC6]/40 text-[#4E8281] flex items-center justify-center font-bold text-[11px]">
                    {guest.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-[#162E2D] block">{guest.name}</span>
                    <span className="text-[10px] text-[#778F8C]">
                      Pase #{guest.code} • {guest.group} • {guest.tableNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      guest.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-800'
                        : guest.status === 'DECLINED'
                        ? 'bg-rose-500/10 text-rose-800'
                        : 'bg-amber-500/10 text-amber-800'
                    }`}
                  >
                    {guest.status === 'CONFIRMED'
                      ? `✓ ${guest.confirmedCompanions} pases`
                      : guest.status === 'DECLINED'
                      ? '✕ Declinó'
                      : '⏳ Pendiente'}
                  </span>

                  {guest.checkedIn && (
                    <span className="text-[9px] font-bold text-[#4E8281] bg-[#C0D3CC]/30 px-2 py-0.5 rounded-full">
                      Ingresó
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
