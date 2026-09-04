'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DemoPlaygroundBanner from '@/components/demo/DemoPlaygroundBanner';
import DemoRestrictedModal from '@/components/demo/DemoRestrictedModal';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Users,
  Calendar,
  Layers,
  QrCode,
  BarChart3,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Download,
  Plus,
  ArrowRight,
  ExternalLink,
  Crown,
  Sparkles,
  Heart,
  ShieldCheck,
  Smartphone,
  Eye,
  RefreshCw,
  Camera,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DemoGuest {
  id: string;
  name: string;
  phone: string;
  group: string;
  tableNumber: number | string;
  allowedCompanions: number;
  confirmedCompanions: number;
  status: 'CONFIRMED' | 'PENDING' | 'DECLINED';
  dietaryNotes?: string;
  checkedIn?: boolean;
}

const INITIAL_DEMO_GUESTS: DemoGuest[] = [
  {
    id: 'g-1',
    name: 'Lic. Roberto Garza Sada',
    phone: '+52 81 8392 0192',
    group: 'VIP / Familia',
    tableNumber: 'Mesa 01 (Honor)',
    allowedCompanions: 2,
    confirmedCompanions: 2,
    status: 'CONFIRMED',
    dietaryNotes: 'Sin mariscos',
    checkedIn: true,
  },
  {
    id: 'g-2',
    name: 'Dra. Sofía Morales',
    phone: '+52 55 4910 3821',
    group: 'Amigos Novia',
    tableNumber: 'Mesa 02',
    allowedCompanions: 2,
    confirmedCompanions: 2,
    status: 'CONFIRMED',
    dietaryNotes: 'Vegetariana',
    checkedIn: false,
  },
  {
    id: 'g-3',
    name: 'Ing. Carlos Slim Helú',
    phone: '+52 55 1234 5678',
    group: 'Empresarial / VIP',
    tableNumber: 'Mesa 01 (Honor)',
    allowedCompanions: 4,
    confirmedCompanions: 4,
    status: 'CONFIRMED',
    dietaryNotes: 'Sin restricciones',
    checkedIn: true,
  },
  {
    id: 'g-4',
    name: 'Mariana & Javier Fuentes',
    phone: '+52 33 9021 4432',
    group: 'Familia Novio',
    tableNumber: 'Mesa 03',
    allowedCompanions: 2,
    confirmedCompanions: 0,
    status: 'PENDING',
    dietaryNotes: 'Sin gluten (Celíaco)',
    checkedIn: false,
  },
  {
    id: 'g-5',
    name: 'Dr. Alejandro Treviño',
    phone: '+52 81 2293 8410',
    group: 'Amigos Universidad',
    tableNumber: 'Mesa 04',
    allowedCompanions: 2,
    confirmedCompanions: 0,
    status: 'DECLINED',
    dietaryNotes: '',
    checkedIn: false,
  },
  {
    id: 'g-6',
    name: 'Fernanda Gómez Garza',
    phone: '+52 81 4402 1199',
    group: 'Damas de Honor',
    tableNumber: 'Mesa 02',
    allowedCompanions: 1,
    confirmedCompanions: 1,
    status: 'CONFIRMED',
    dietaryNotes: 'Sin restricciones',
    checkedIn: false,
  },
  {
    id: 'g-7',
    name: 'Arturo Villalobos',
    phone: '+52 55 9920 1833',
    group: 'Testigos',
    tableNumber: 'Mesa 03',
    allowedCompanions: 2,
    confirmedCompanions: 2,
    status: 'CONFIRMED',
    dietaryNotes: 'Vegano',
    checkedIn: false,
  },
];

function DemoPlaygroundPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'guests' | 'seating' | 'whatsapp' | 'checkin' | 'analytics') || 'guests';

  const [activeTab, setActiveTab] = useState<'guests' | 'seating' | 'whatsapp' | 'checkin' | 'analytics'>(initialTab);
  const [guests, setGuests] = useState<DemoGuest[]>(INITIAL_DEMO_GUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'DECLINED'>('ALL');
  const [restrictedModalOpen, setRestrictedModalOpen] = useState(false);
  const [restrictedModalAction, setRestrictedModalAction] = useState('Envío Real');
  const [notification, setNotification] = useState<string | null>(null);

  // QR Scanner Simulator State
  const [selectedScannerGuest, setSelectedScannerGuest] = useState<DemoGuest>(INITIAL_DEMO_GUESTS[1]);
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    guestName: string;
    table: string | number;
    count: number;
    timestamp: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleTriggerRestrictedAction = (actionName: string) => {
    setRestrictedModalAction(actionName);
    setRestrictedModalOpen(true);
  };

  // Toggle guest status in demo state
  const handleToggleStatus = (guestId: string, newStatus: 'CONFIRMED' | 'PENDING' | 'DECLINED') => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === guestId) {
          const confirmedCompanions = newStatus === 'CONFIRMED' ? g.allowedCompanions : 0;
          return { ...g, status: newStatus, confirmedCompanions };
        }
        return g;
      })
    );
    showToast(`Estado actualizado a ${newStatus === 'CONFIRMED' ? 'Confirmado' : newStatus === 'DECLINED' ? 'Declinado' : 'Pendiente'}`);
  };

  // Simulate scanning QR in door reception
  const handleSimulateScan = () => {
    if (!selectedScannerGuest) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D3B48C', '#4E8281', '#C0D3CC'],
      });
    } catch (e) {
      // ignore
    }

    setGuests((prev) =>
      prev.map((g) => (g.id === selectedScannerGuest.id ? { ...g, checkedIn: true, status: 'CONFIRMED' } : g))
    );

    setLastScanResult({
      success: true,
      guestName: selectedScannerGuest.name,
      table: selectedScannerGuest.tableNumber,
      count: selectedScannerGuest.allowedCompanions,
      timestamp: new Date().toLocaleTimeString(),
    });

    showToast(`¡Boleto validado con éxito para ${selectedScannerGuest.name}!`);
  };

  // Derived metrics
  const totalGuestsCount = 250;
  const confirmedCount = guests.filter((g) => g.status === 'CONFIRMED').length * 2 + 170;
  const pendingCount = guests.filter((g) => g.status === 'PENDING').length * 2 + 38;
  const checkedInCount = guests.filter((g) => g.checkedIn).length * 2 + 163;

  const filteredGuests = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F4EDE2] text-[#162E2D] relative overflow-x-hidden selection:bg-[#4E8281] selection:text-white">
      {/* 1. Permanent Top Demo Banner */}
      <DemoPlaygroundBanner />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 bg-[#0F2424] text-[#FAF6F0] px-4 py-2.5 rounded-2xl shadow-2xl border border-[#D3B48C] flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Sandbox Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header: Event Identity Bar */}
        <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E8281] bg-[#C0D3CC]/40 px-2.5 py-0.5 rounded-full">
                Boda de Demostración
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-700" />
                <span>Plan Imperial Activo</span>
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Boda de María & Andrés
            </h1>

            <p className="text-xs text-[#778F8C]">
              📍 Hacienda San José del Cabo, BCS • 20 de Julio, 2026 • 17:00 hrs
            </p>
          </div>

          {/* Action CTAs in Header */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/i/boda-maria-andres-2026"
              target="_blank"
              className="px-4 py-2 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4E8281] border border-[#4E8281]/40 text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <span>Ver Web Invitación</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => handleTriggerRestrictedAction('Publicar Cambios Reales')}
              className="btn-oshun-primary text-xs px-5 py-2 inline-flex items-center gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Enviar Invitaciones</span>
            </button>
          </div>
        </div>

        {/* Interactive Horizontal Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#D3B48C]/30 text-xs font-bold font-cinzel">
          {[
            { id: 'guests', label: '👥 Invitados & CRM', icon: Users },
            { id: 'seating', label: '📐 Acomodo de Mesas 2D', icon: Layers },
            { id: 'whatsapp', label: '📲 Mensajes WhatsApp', icon: MessageSquare },
            { id: 'checkin', label: '🛡️ Recepción QR en Puerta', icon: QrCode },
            { id: 'analytics', label: '📊 Analítica & Banquete', icon: BarChart3 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-full transition-all shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#4E8281] text-white border-[#4E8281] shadow-md'
                    : 'bg-white hover:bg-[#FAF6F0] text-[#162E2D] border-[#D3B48C]/40'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* PESTAÑA 1: CRM & LISTA DE INVITADOS (INTERACTIVE)                         */}
        {/* ========================================================================= */}
        {activeTab === 'guests' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 4 Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#D3B48C]/40 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-[#778F8C] uppercase block">Total Cupos</span>
                <span className="text-2xl font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                  {totalGuestsCount}
                </span>
                <span className="text-[10px] text-[#778F8C] block">Invitados calculados</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#4E8281]/40 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-[#4E8281] uppercase block">Confirmados</span>
                <span className="text-2xl font-bold text-[#4E8281]" style={{ fontFamily: 'Cinzel, serif' }}>
                  {confirmedCount}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold inline-block">
                  73.6% Asistencia
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Pendientes</span>
                <span className="text-2xl font-bold text-amber-700" style={{ fontFamily: 'Cinzel, serif' }}>
                  {pendingCount}
                </span>
                <span className="text-[10px] text-amber-700 block">En espera de RSVP</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F2424] text-white border border-[#D3B48C]/40 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-[#D3B48C] uppercase block">En Puerta (QR)</span>
                <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                  {checkedInCount}
                </span>
                <span className="text-[10px] text-emerald-300 font-bold block">90.8% Ingresados</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar invitado o grupo..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-xs text-[#162E2D] outline-none focus:ring-2 focus:ring-[#4E8281]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {(['ALL', 'CONFIRMED', 'PENDING', 'DECLINED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
                        statusFilter === st
                          ? 'bg-[#4E8281] text-white'
                          : 'bg-[#FAF6F0] text-[#778F8C] hover:bg-[#EFE3D4]'
                      }`}
                    >
                      {st === 'ALL' ? 'Todos' : st === 'CONFIRMED' ? 'Confirmados' : st === 'PENDING' ? 'Pendientes' : 'Declinados'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Interactive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F0] border-b border-[#D3B48C]/30 text-[#778F8C] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Invitado / Contacto</th>
                      <th className="py-3 px-3">Grupo</th>
                      <th className="py-3 px-3">Mesa</th>
                      <th className="py-3 px-3">Pases</th>
                      <th className="py-3 px-3">Estado RSVP (Simular)</th>
                      <th className="py-3 px-4 text-right">Acciones de Prueba</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D3B48C]/20">
                    {filteredGuests.map((g) => (
                      <tr key={g.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#162E2D]">
                          <span className="block">{g.name}</span>
                          <span className="text-[10px] font-normal text-[#778F8C]">{g.phone}</span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-[#4E8281]">{g.group}</td>
                        <td className="py-3.5 px-3 font-bold text-[#162E2D]">{g.tableNumber}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-[#162E2D]">{g.confirmedCompanions}</span>
                          <span className="text-[#778F8C]"> / {g.allowedCompanions} pases</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(g.id, 'CONFIRMED')}
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                                g.status === 'CONFIRMED'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                              }`}
                            >
                              ✓ Confirmado
                            </button>
                            <button
                              onClick={() => handleToggleStatus(g.id, 'PENDING')}
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                                g.status === 'PENDING'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                              }`}
                            >
                              ⏳
                            </button>
                            <button
                              onClick={() => handleToggleStatus(g.id, 'DECLINED')}
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                                g.status === 'DECLINED'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                              }`}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleTriggerRestrictedAction('Enviar WhatsApp Real')}
                            className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EADBC6]/50 text-[#4E8281] border border-[#D3B48C]/40 transition-colors"
                            title="Enviar WhatsApp Real"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleTriggerRestrictedAction('Descargar Boleto PDF')}
                            className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EADBC6]/50 text-[#162E2D] border border-[#D3B48C]/40 transition-colors"
                            title="Descargar Boleto PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: ACOMODO DE MESAS 2D (INTERACTIVE)                              */}
        {/* ========================================================================= */}
        {activeTab === 'seating' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                    Plano Ficticio 2D • Salón Principal
                  </h3>
                  <p className="text-xs text-[#778F8C]">
                    Simulación de distribución aérea de mesas de honor y mesas de invitados.
                  </p>
                </div>
                <button
                  onClick={() => handleTriggerRestrictedAction('Guardar Plano')}
                  className="btn-oshun-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Agregar Mesa</span>
                </button>
              </div>

              {/* Visual 2D Salon Canvas */}
              <div className="h-96 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#D3B48C] relative p-6 flex flex-col justify-between overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#4E8281_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Stage / DJ Area */}
                <div className="w-48 mx-auto py-1.5 rounded-full bg-[#0F2424] text-white text-[10px] font-bold text-center border border-[#D3B48C]">
                  🎵 Escenario / Pista de Baile
                </div>

                {/* Tables Arrangement Row */}
                <div className="grid grid-cols-3 gap-6 my-auto items-center justify-items-center">
                  
                  {/* Table 1 */}
                  <div className="p-3 rounded-2xl bg-white border-2 border-[#4E8281] text-center shadow-md space-y-1 w-32 cursor-pointer hover:scale-105 transition-transform">
                    <span className="text-[10px] font-bold text-[#162E2D] block">Mesa 01</span>
                    <span className="text-xs font-bold text-[#4E8281] block">10 / 10 Personas</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold block">Completa</span>
                  </div>

                  {/* Honor Table (Novios) */}
                  <div className="p-4 rounded-3xl bg-[#0F2424] text-white text-center shadow-xl border-2 border-[#D3B48C] space-y-1.5 w-44 cursor-pointer hover:scale-105 transition-transform">
                    <Crown className="h-5 w-5 text-[#D3B48C] mx-auto" />
                    <span className="text-xs font-bold block text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                      Mesa de Novios
                    </span>
                    <span className="text-[10px] text-[#D3B48C] font-bold block">2 / 2 Cupos (María & Andrés)</span>
                  </div>

                  {/* Table 2 */}
                  <div className="p-3 rounded-2xl bg-white border-2 border-[#D3B48C] text-center shadow-md space-y-1 w-32 cursor-pointer hover:scale-105 transition-transform">
                    <span className="text-[10px] font-bold text-[#162E2D] block">Mesa 02</span>
                    <span className="text-xs font-bold text-[#D3B48C] block">8 / 10 Personas</span>
                    <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold block">2 Libres</span>
                  </div>

                </div>

                {/* Entrance Indicator */}
                <div className="w-36 mx-auto py-1 rounded-full bg-[#EADBC6]/60 text-[#4E8281] text-[9px] font-bold text-center border border-[#D3B48C]/40">
                  🚪 Acceso Principal
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: MENSAJES WHATSAPP (INTERACTIVE)                                 */}
        {/* ========================================================================= */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                Plantillas de Mensajes Concierge para WhatsApp
              </h3>
              <p className="text-xs text-[#778F8C]">
                Envío de pases digitales, recordatorios de confirmación y agradecimiento con 1 solo clic.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  {
                    title: '1. Invitación Inicial + Boleto QR',
                    preview: '✨ ¡Hola Lic. Roberto! Con gran alegría queremos invitarte a celebrar nuestra boda. Accede a tu invitación oficial y tu boleto QR aquí: oshun.com/i/boda-maria-andres',
                    tag: 'Invitación Formal',
                  },
                  {
                    title: '2. Recordatorio de Confirmación',
                    preview: '🔔 ¡Hola! Faltan 15 días para el evento y estamos cerrando los detalles del banquete. Por favor confirma tu asistencia en este enlace:',
                    tag: 'Recordatorio RSVP',
                  },
                  {
                    title: '3. Pase de Acceso Final',
                    preview: '🎟️ ¡Hola! Tu boleto de acceso para la Boda de María & Andrés está listo. Mesa asignada: Mesa 01 (Honor). ¡Te esperamos con emoción!',
                    tag: 'Boleto QR',
                  },
                ].map((tpl, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[#4E8281] bg-[#C0D3CC]/40 px-2 py-0.5 rounded-full inline-block">
                        {tpl.tag}
                      </span>
                      <h4 className="text-xs font-bold text-[#162E2D]">{tpl.title}</h4>
                      <p className="text-[11px] text-[#778F8C] bg-white p-2.5 rounded-xl border border-[#D3B48C]/30 leading-relaxed italic">
                        {tpl.preview}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTriggerRestrictedAction('Envío Masivo por WhatsApp')}
                      className="btn-oshun-primary w-full py-2 text-[10px] uppercase font-bold tracking-wider inline-flex items-center justify-center gap-1.5"
                    >
                      <Send className="h-3 w-3" />
                      <span>Probar Envío a Mi Celular</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 4: RECEPCIÓN & ESCÁNER QR EN PUERTA (SIMULATOR)                   */}
        {/* ========================================================================= */}
        {activeTab === 'checkin' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive QR Scanner Simulator */}
              <div className="lg:col-span-7 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 shadow-md space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D3B48C]">
                    Simulador Interactivo de Puerta
                  </span>
                  <h3 className="text-xl font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                    Escáner de Boletos en Tiempo Real
                  </h3>
                  <p className="text-xs text-[#778F8C]">
                    Selecciona un invitado de prueba y presiona el botón para simular la lectura de su código QR en el acceso del evento.
                  </p>
                </div>

                {/* Guest Selector for Scanner */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#162E2D]">
                    Seleccionar Boleto a Escanear:
                  </label>
                  <select
                    value={selectedScannerGuest.id}
                    onChange={(e) => {
                      const found = guests.find((x) => x.id === e.target.value);
                      if (found) setSelectedScannerGuest(found);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 text-xs font-bold text-[#162E2D] outline-none focus:ring-2 focus:ring-[#4E8281]"
                  >
                    {guests.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} — {g.tableNumber} ({g.allowedCompanions} pases) {g.checkedIn ? '• Ya ingresó' : '• Pendiente'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action: Trigger Simulation */}
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="w-full py-3.5 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Camera className="h-4 w-4 text-[#D3B48C]" />
                  <span>⚡ Simular Escaneo de Boleto en Puerta</span>
                </button>

                {/* Scan Result Feedback Card */}
                {lastScanResult && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-2 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span>¡Acceso Autorizado en &lt; 1 segundo!</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700">{lastScanResult.timestamp}</span>
                    </div>

                    <div className="text-xs space-y-0.5 pt-1">
                      <p className="font-bold text-sm text-[#162E2D]">{lastScanResult.guestName}</p>
                      <p className="text-emerald-900">
                        📍 Asignación: <strong>{lastScanResult.table}</strong> • Ingresan: <strong>{lastScanResult.count} personas</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Ingest Stats */}
              <div className="lg:col-span-5 rounded-3xl bg-[#0F2424] text-white border-2 border-[#D3B48C] p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#D3B48C]/30 pb-3">
                  <span className="text-xs font-bold text-[#D3B48C] uppercase tracking-wider">Aforo en Vivo</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="space-y-2">
                  <span className="text-3xl font-bold text-white block" style={{ fontFamily: 'Cinzel, serif' }}>
                    {checkedInCount} / {confirmedCount}
                  </span>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((checkedInCount / confirmedCount) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-emerald-300 font-semibold block">
                    {Math.round((checkedInCount / confirmedCount) * 100)}% de los confirmados ya están dentro del salón.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2 text-[#FAF6F0]">
                  <p className="font-bold text-[#D3B48C]">✦ Ventaja OSHUN Puerta:</p>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Varios miembros de tu equipo pueden escanear simultáneamente desde diferentes celulares sin duplicar accesos.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 5: ANALÍTICA & BANQUETE                                           */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Attendance Breakdown */}
              <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                  Resumen Global de Asistencia
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Confirmados</span>
                      <span className="text-[#4E8281]">184 personas (73.6%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#4E8281] h-full w-[73.6%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Pendientes</span>
                      <span className="text-amber-600">42 personas (16.8%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[16.8%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Declinados</span>
                      <span className="text-rose-600">24 personas (9.6%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-rose-400 h-full w-[9.6%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Catering Restrictions */}
              <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                  Reporte de Dietas para Banquetería
                </h3>
                <div className="divide-y divide-[#D3B48C]/20 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-[#162E2D]">Menú Tradicional (Carne/Pescado)</span>
                    <span className="font-bold text-[#4E8281]">142 platos</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-[#162E2D]">Vegetariano / Vegano</span>
                    <span className="font-bold text-[#4E8281]">22 platos</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-[#162E2D]">Sin Gluten (Celíacos)</span>
                    <span className="font-bold text-[#D3B48C]">12 platos</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-[#162E2D]">Alergia a Mariscos</span>
                    <span className="font-bold text-[#778F8C]">8 platos</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Restricted Modal for Live Sending in Demo Mode */}
      <DemoRestrictedModal
        isOpen={restrictedModalOpen}
        onClose={() => setRestrictedModalOpen(false)}
        actionTitle={restrictedModalAction}
      />
    </div>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <DemoPlaygroundPage />
    </Suspense>
  );
}
