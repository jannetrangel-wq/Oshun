'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Utensils,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  UserX,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
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
import EventNavTabs from '@/components/ui/EventNavTabs';
import FeatureGuard from '@/components/auth/FeatureGuard';

export default function AnalyticsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const event = InvitaStore.getEventById(eventId) || InvitaStore.getEvents()[0];
  if (!event) return null;

  const stats = InvitaStore.getEventStats(event.id);

  // Group comparison
  const GROUP_BAR_DATA = [
    { grupo: 'Familia Novia', confirmados: 52, asignados: 65 },
    { grupo: 'Familia Novio', confirmados: 48, asignados: 55 },
    { grupo: 'Amigos', confirmados: 58, asignados: 70 },
    { grupo: 'VIP', confirmados: 32, asignados: 35 },
    { grupo: 'Trabajo / Otros', confirmados: 18, asignados: 25 },
  ];

  // Catering dietary restrictions
  const DIETARY_DATA = [
    { name: 'Sin restricciones', value: 142, color: '#4E8281' },
    { name: 'Vegetariano', value: 22, color: '#97B8B3' },
    { name: 'Sin gluten (Celíaco)', value: 12, color: '#D3B48C' },
    { name: 'Sin mariscos (Alergia)', value: 8, color: '#778F8C' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Event Sub-Navigation Tabs */}
      <EventNavTabs />

      <FeatureGuard
        feature="canAnalytics"
        featureName="Métricas de Asistencia & Reportes de Banquetería"
        requiredPlan="ELEGANCE"
      >
        {/* Top Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
          Reportes & Banquetería • OSHUN
        </span>
        <h2
          className="text-xl sm:text-2xl font-bold text-[#162E2D]"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Analítica del Evento
        </h2>
        <p className="text-xs text-[#778F8C]">
          Información clave para proveedores, banqueteros y organizadores.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#D3B48C]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-[#778F8C] block">Total Invitaciones</span>
          <span className="text-2xl font-bold text-[#162E2D]">{stats.totalGuests}</span>
          <span className="text-[10px] text-[#4E8281] font-semibold block">100% emitidas</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-500/30 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Asistencia Confirmada</span>
          <span className="text-2xl font-bold text-emerald-700">{stats.confirmationRate}%</span>
          <span className="text-[10px] text-emerald-800 block">{stats.confirmed} titulares ({stats.confirmedTotalHeadcount} comensales)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#4E8281]/40 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-[#4E8281] block">Total Platos / Banquete</span>
          <span className="text-2xl font-bold text-[#4E8281]">{stats.confirmedTotalHeadcount}</span>
          <span className="text-[10px] text-[#778F8C] block">Cubiertos calculados</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F2424] text-white border border-[#D3B48C]/40 shadow-md text-center">
          <span className="text-[10px] font-bold uppercase text-[#D3B48C] block">Asistencia en Puerta</span>
          <span className="text-2xl font-bold text-white">{stats.checkInRate}%</span>
          <span className="text-[10px] text-[#C0D3CC] block">{stats.checkedIn} ingresados</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Group comparison */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
          <h3
            className="text-sm font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Confirmación por Grupos (Asignados vs Confirmados)
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GROUP_BAR_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE3D4" />
                <XAxis dataKey="grupo" stroke="#778F8C" fontSize={10} tickLine={false} />
                <YAxis stroke="#778F8C" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6F0',
                    borderColor: '#D3B48C',
                    borderRadius: '14px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="asignados" fill="#D3B48C" radius={[6, 6, 0, 0]} name="Asignados" />
                <Bar dataKey="confirmados" fill="#4E8281" radius={[6, 6, 0, 0]} name="Confirmados" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dietary Distribution Chart */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3
              className="text-sm font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Menú Especial para Catering & Banquete
            </h3>
            <p className="text-[11px] text-[#778F8C]">Restricciones dietéticas registradas en el RSVP</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DIETARY_DATA} innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                  {DIETARY_DATA.map((entry, index) => (
                    <Cell key={`diet-${index}`} fill={entry.color} />
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

          {/* Breakdown List */}
          <div className="divide-y divide-[#D3B48C]/20 text-xs">
            {DIETARY_DATA.map((item, idx) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#162E2D]">{item.name}</span>
                </div>
                <span className="font-bold text-[#4E8281]">{item.value} platos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </FeatureGuard>
    </div>
  );
}
