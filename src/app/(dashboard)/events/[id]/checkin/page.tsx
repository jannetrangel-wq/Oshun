'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Users,
  Camera,
  History,
  Sparkles,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { Guest } from '@/types';
import { generateQrDataUrl } from '@/lib/qr';
import Modal from '@/components/ui/Modal';
import EventNavTabs from '@/components/ui/EventNavTabs';
import FeatureGuard from '@/components/auth/FeatureGuard';

export default function CheckInPortalPage() {
  const params = useParams();
  const eventId = params.id as string;

  const event = InvitaStore.getEventById(eventId) || InvitaStore.getEvents()[0];
  const guests = InvitaStore.getGuestsForEvent(event?.id || 'event-01');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean;
    alreadyCheckedIn?: boolean;
    guest?: Guest;
    message: string;
  } | null>(null);

  // QR Modal for ticket printing
  const [qrModalGuest, setQrModalGuest] = useState<Guest | null>(null);
  const [qrModalDataUrl, setQrModalDataUrl] = useState('');

  if (!event) return null;

  const stats = InvitaStore.getEventStats(event.id);
  const recentLogs = InvitaStore.getCheckInLogs(event.id).slice(0, 10);

  const filteredGuests = searchTerm.trim()
    ? guests.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.phone.includes(searchTerm)
      )
    : [];

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setHeadcount(guest.confirmedCompanions || guest.allowedCompanions || 1);
    setCheckInResult(null);
  };

  const handlePerformCheckIn = () => {
    if (!selectedGuest) return;

    const res = InvitaStore.recordCheckIn(
      event.id,
      selectedGuest.code,
      headcount,
      'Staff Entrada',
      'QR_SCAN'
    );

    setCheckInResult(res);
  };

  const handleOpenQrModal = async (guest: Guest) => {
    setQrModalGuest(guest);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com';
    const url = `${origin}/i/${event.slug}/${guest.code}`;
    const qr = await generateQrDataUrl(url, { darkColor: '#0F2424', lightColor: '#FFFFFF', width: 260 });
    setQrModalDataUrl(qr);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Event Sub-Navigation Tabs */}
      <EventNavTabs />

      <FeatureGuard
        feature="canCheckInQr"
        featureName="Recepción & Escáner de Boletos QR"
        requiredPlan="ELEGANCE"
      >
        {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
            Control de Acceso en Puerta • OSHUN
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Recepción & Escáner de Boletos
          </h2>
          <p className="text-xs text-[#778F8C]">
            Valida los pases con código QR y registra el ingreso físico de los invitados y sus acompañantes.
          </p>
        </div>

        {/* Live Headcount Badge */}
        <div className="p-3 rounded-2xl bg-white border border-[#D3B48C]/40 shadow-sm flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#4E8281] text-white flex items-center justify-center font-bold">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-[#778F8C] block">Ingresaron en Sala</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[#4E8281]">{stats.checkedIn}</span>
              <span className="text-xs text-[#778F8C]">/ {stats.confirmedTotalHeadcount} confirmados ({stats.checkInRate}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Scanner & Search Bar */}
        <div className="lg:col-span-7 space-y-5">
          {/* Search / QR Scanner Box */}
          <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-sm font-bold text-[#162E2D]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                1. Búsqueda Rápida o Escaneo de Boleto
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#4E8281] bg-[#C0D3CC]/30 px-2 py-0.5 rounded-full">
                Cámara Activa
              </span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Escribe el código (ej. VIP01) o nombre del invitado..."
                className="w-full rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 pl-10 pr-4 py-3 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>

            {/* Matching Guests Dropdown List */}
            {filteredGuests.length > 0 && (
              <div className="max-h-56 overflow-y-auto divide-y divide-[#D3B48C]/20 border border-[#D3B48C]/30 rounded-2xl bg-[#FAF6F0]">
                {filteredGuests.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => handleSelectGuest(g)}
                    className="p-3 flex items-center justify-between text-xs hover:bg-[#EADBC6]/40 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-[#162E2D] block">{g.name}</span>
                      <span className="text-[10px] text-[#778F8C]">
                        Pase #{g.code} • {g.group} • {g.tableNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#4E8281]">
                        {g.allowedCompanions} {g.allowedCompanions > 1 ? 'pases' : 'pase'}
                      </span>
                      {g.checkedIn ? (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Ya ingresó
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Disponible
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Camera Viewport Simulation */}
            <div className="p-8 rounded-2xl bg-[#0F2424] text-center space-y-3 relative overflow-hidden border border-[#D3B48C]/40">
              <div className="h-32 w-32 mx-auto rounded-2xl border-2 border-dashed border-[#D3B48C] flex flex-col items-center justify-center text-white/80 space-y-1 relative">
                <QrCode className="h-10 w-10 text-[#D3B48C]" />
                <span className="text-[9px] font-bold text-slate-300">Apunta el QR</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Acerca el boleto digital en la pantalla del celular del invitado para escanear automáticamente.
              </p>
            </div>
          </div>

          {/* Selected Guest Details & Check-In Action */}
          {selectedGuest && (
            <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
                    Boleto Seleccionado
                  </span>
                  <h3
                    className="text-lg font-bold text-[#162E2D]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {selectedGuest.name}
                  </h3>
                  <p className="text-xs text-[#778F8C]">
                    Código: <strong className="text-[#4E8281]">#{selectedGuest.code}</strong> • Grupo: {selectedGuest.group}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenQrModal(selectedGuest)}
                  className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#EADBC6] text-[#4E8281] border border-[#D3B48C]/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Ver Boleto</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/30 text-center text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#778F8C] block">Mesa Asignada</span>
                  <span className="font-bold text-[#4E8281] text-sm block">{selectedGuest.tableNumber || 'Mesa 1'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#778F8C] block">Pases Autorizados</span>
                  <span className="font-bold text-[#162E2D] text-sm block">{selectedGuest.allowedCompanions}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#778F8C] block">Estado</span>
                  <span className="font-bold text-emerald-700 text-sm block">
                    {selectedGuest.status === 'CONFIRMED' ? 'Confirmado' : 'Pendiente'}
                  </span>
                </div>
              </div>

              {/* Headcount Input */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-[#162E2D]">
                  Personas que ingresan en este momento:
                </span>
                <select
                  value={headcount}
                  onChange={(e) => setHeadcount(parseInt(e.target.value, 10))}
                  className="rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-3 py-1.5 text-xs font-bold text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
                >
                  {Array.from({ length: selectedGuest.allowedCompanions }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'Persona' : 'Personas'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Validation Result Alert */}
              {checkInResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
                    checkInResult.alreadyCheckedIn
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : checkInResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {checkInResult.alreadyCheckedIn ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  ) : checkInResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  )}
                  <span className="font-semibold">{checkInResult.message}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handlePerformCheckIn}
                className="w-full py-3.5 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-[#4E8281]/25 flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Registrar Entrada ({headcount} {headcount === 1 ? 'Pase' : 'Pases'})</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Access Log Feed */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#D3B48C]/40 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-sm font-bold text-[#162E2D]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Registro de Accesos en Vivo
              </h3>
              <History className="h-4 w-4 text-[#D3B48C]" />
            </div>

            <div className="divide-y divide-[#D3B48C]/20 max-h-[500px] overflow-y-auto">
              {recentLogs.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#778F8C]">
                  No hay registros de acceso aún. Escanea un código para comenzar.
                </p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#162E2D] block">{log.guestName}</span>
                      <span className="text-[10px] text-[#778F8C]">
                        #{log.guestCode} • Ingreso: {log.headcount} {log.headcount === 1 ? 'persona' : 'personas'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full block">
                        ✓ Acceso Concedido
                      </span>
                      <span className="text-[9px] text-[#778F8C] block mt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Printable Modal */}
      <Modal
        isOpen={!!qrModalGuest}
        onClose={() => setQrModalGuest(null)}
        title="Boleto Digital de Acceso"
        subtitle={qrModalGuest?.name || ''}
        maxWidth="sm"
      >
        {qrModalGuest && (
          <div className="p-4 space-y-4 text-center">
            <OshunLogo variant="isotipo" size="md" />

            <div>
              <h4
                className="text-base font-bold text-[#162E2D]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {event.title}
              </h4>
              <p className="text-xs text-[#778F8C]">Pase #{qrModalGuest.code}</p>
            </div>

            {qrModalDataUrl && (
              <img src={qrModalDataUrl} alt="QR Code" className="h-44 w-44 mx-auto rounded-2xl border border-[#D3B48C]/40 p-2 shadow" />
            )}

            <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30 text-xs text-[#162E2D]">
              <p className="font-bold">{qrModalGuest.name}</p>
              <p className="text-[#778F8C]">Mesa: {qrModalGuest.tableNumber || 'Asignada'} • Pases: {qrModalGuest.allowedCompanions}</p>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-full bg-[#4E8281] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir Boleto</span>
            </button>
          </div>
        )}
      </Modal>
      </FeatureGuard>
    </div>
  );
}
