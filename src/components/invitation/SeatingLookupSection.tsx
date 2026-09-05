'use client';

import React, { useState } from 'react';
import { Search, Armchair, Users, Sparkles, CheckCircle2, MapPin, Compass, ChevronRight, UserCheck } from 'lucide-react';
import { SeatingTable, Guest } from '@/types';
import { InvitaStore } from '@/lib/store';

interface SeatingLookupSectionProps {
  eventId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  primaryColor?: string;
  accentColor?: string;
  cardBackground?: string;
  fontFamilyTitle?: string;
  textColor?: string;
  tables?: SeatingTable[];
  isDemoPreview?: boolean;
}

export default function SeatingLookupSection({
  eventId = 'event-01',
  title = 'Acomodo de Mesas & Asignación',
  subtitle = 'CONSULTA TU MESA ASIGNADA',
  description = 'Escribe tu nombre o código de pase para localizar tu mesa y asiento reservado.',
  primaryColor = '#4E8281',
  accentColor = '#D3B48C',
  cardBackground = 'rgba(250, 246, 240, 0.95)',
  fontFamilyTitle = 'Cinzel',
  textColor = '#162E2D',
  tables,
  isDemoPreview = false,
}: SeatingLookupSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    guest?: Guest;
    table?: SeatingTable;
    tableGuests?: Guest[];
    seatNumber?: number;
    message?: string;
  } | null>(null);

  // Quick demo guests for instant testing in prototypes
  const demoGuests = [
    { name: 'Elena Vázquez', code: 'OSH101', table: 'Mesa 1 (VIP)' },
    { name: 'Mateo Morales', code: 'OSH102', table: 'Mesa 1 (VIP)' },
    { name: 'Familia González', code: 'OSH204', table: 'Mesa 8 (Familiar)' },
    { name: 'Carlos Ruiz', code: 'OSH305', table: 'Mesa 12 (Amigos)' },
  ];

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery !== undefined ? customQuery : searchQuery;
    if (!q.trim()) return;

    setHasSearched(true);
    const res = InvitaStore.findGuestSeatingInfo(eventId, q);

    if (!res.found && isDemoPreview) {
      // Elegant fallback for prototype demo previews
      setLookupResult({
        found: true,
        guest: {
          id: 'demo-g1',
          eventId,
          code: 'OSH-VIP-01',
          name: q.trim(),
          phone: '+52 81 8392 0192',
          group: 'VIP',
          status: 'CONFIRMED',
          allowedCompanions: 2,
          confirmedCompanions: 2,
          companionNames: ['Acompañante VIP'],
          checkedIn: false,
        },
        table: {
          id: 'demo-t1',
          eventId,
          name: 'Mesa 1 - Zona VIP & Honor',
          tableNumber: 1,
          shape: 'ROUND',
          capacity: 8,
          zone: 'Zona VIP & Honor',
          assignedGuestIds: ['demo-g1'],
          notes: 'Mesa con vista directa a la pista',
        },
        seatNumber: 2,
        message: `¡Asignación confirmada para ${q.trim()}!`,
      });
      return;
    }

    setLookupResult(res);
  };

  const currentTable = lookupResult?.table;
  const tableCapacity = currentTable?.capacity || 8;
  const activeSeatIndex = (lookupResult?.seatNumber || 1) - 1;

  const eventZones = [
    { name: 'Zona VIP & Honor', color: '#D3B48C', desc: 'Frente a pista de baile' },
    { name: 'Zona Familiar', color: '#4E8281', desc: 'Salón central y arcos' },
    { name: 'Zona Amigos & Jóvenes', color: '#778F8C', desc: 'Cerca del lounge y bar' },
  ];

  return (
    <section
      className="p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border transition-all duration-300"
      style={{
        backgroundColor: cardBackground,
        borderColor: `${accentColor}60`,
        color: textColor,
      }}
    >
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-[#D3B48C]/40 text-[10px] font-bold uppercase tracking-widest shadow-2xs">
          <Armchair className="h-3 w-3" style={{ color: primaryColor }} />
          <span style={{ color: primaryColor }}>{subtitle}</span>
        </div>
        <h3
          className="text-xl sm:text-2xl font-bold tracking-wide"
          style={{
            fontFamily: `${fontFamilyTitle}, serif`,
            color: primaryColor,
          }}
        >
          {title}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={(e) => handleSearch(e)} className="space-y-3 max-w-md mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (hasSearched) setHasSearched(false);
            }}
            placeholder="Escribe tu nombre o código (Ej. Elena)..."
            className="w-full pl-4 pr-24 py-3 rounded-2xl bg-white/95 border text-xs font-medium placeholder:text-slate-400 outline-none shadow-inner transition-all focus:ring-2"
            style={{
              borderColor: `${accentColor}80`,
              color: textColor,
            }}
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Buscar</span>
          </button>
        </div>

        {/* Quick Test Chips for Prototype Interaction */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center pt-1">
          <span className="text-[10px] text-slate-400 font-semibold">Probar con:</span>
          {demoGuests.map((dg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(dg.name);
                handleSearch(undefined, dg.name);
              }}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#D3B48C]/40 text-slate-600 hover:text-[#4E8281] hover:border-[#4E8281] transition-colors shadow-2xs"
            >
              {dg.name.split(' ')[0]} ({dg.table.split(' ')[1]})
            </button>
          ))}
        </div>
      </form>

      {/* Search Results Display */}
      {hasSearched && lookupResult && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {lookupResult.found && lookupResult.table ? (
            <div className="p-5 rounded-2xl bg-white border-2 shadow-lg space-y-4 text-center" style={{ borderColor: accentColor }}>
              
              {/* Badge & Table Title */}
              <div className="space-y-1">
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  {lookupResult.table.zone || 'Salón Principal'}
                </span>
                <h4
                  className="text-2xl sm:text-3xl font-black"
                  style={{
                    fontFamily: `${fontFamilyTitle}, serif`,
                    color: primaryColor,
                  }}
                >
                  {lookupResult.table.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Asiento Reservado: <strong className="text-slate-800 font-bold">Asiento #{lookupResult.seatNumber || 1}</strong> para{' '}
                  <strong className="text-[#4E8281]">{lookupResult.guest?.name}</strong>
                </p>
              </div>

              {/* Radial Round Table Seat Visualization (from Smart Guest Control) */}
              <div className="py-3 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 rounded-full border-4 border-dashed flex flex-col items-center justify-center shadow-inner select-none" style={{ borderColor: `${accentColor}` }}>
                  
                  {/* Center of table */}
                  <div className="text-center p-2 rounded-full bg-[#FAF6F0] border border-[#D3B48C]/40 shadow-xs">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Mesa</span>
                    <span className="text-xl font-black block leading-none" style={{ color: primaryColor }}>
                      {lookupResult.table.tableNumber}
                    </span>
                    <span className="text-[8px] text-slate-500 block font-semibold">{lookupResult.table.capacity}p</span>
                  </div>

                  {/* Circular seats around table */}
                  {Array.from({ length: tableCapacity }).map((_, i) => {
                    const angle = (i * 360) / tableCapacity;
                    const radius = 94; // distance from center
                    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                    const isMySeat = i === activeSeatIndex;

                    return (
                      <div
                        key={i}
                        className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all transform -ml-4 -mt-4 shadow-sm ${
                          isMySeat
                            ? 'bg-amber-400 border-amber-600 text-amber-950 ring-4 ring-amber-300/60 scale-120 z-20 font-black animate-pulse'
                            : 'bg-white border-slate-300 text-slate-600'
                        }`}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(${x}px, ${y}px) ${isMySeat ? 'scale(1.2)' : 'scale(1)'}`,
                        }}
                        title={isMySeat ? `¡Tu Asiento (#${i + 1})!` : `Asiento #${i + 1}`}
                      >
                        {isMySeat ? '★' : i + 1}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-3">
                  ★ Tu asiento se encuentra resaltado en dorado en la mesa.
                </span>
              </div>

              {/* Table Companions info */}
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#D3B48C]/30 text-xs text-left space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                    <span>Pases Confirmados:</span>
                  </span>
                  <span className="text-[#4E8281] font-bold">
                    {lookupResult.guest?.confirmedCompanions || lookupResult.guest?.allowedCompanions || 1} personas
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Presenta tu código <strong className="font-mono text-slate-700">#{lookupResult.guest?.code}</strong> con el personal de recepción / hostess al ingresar al evento.
                </p>
              </div>

            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1 text-xs text-amber-800">
              <p className="font-bold">{lookupResult.message || 'No se encontró asignación para esta búsqueda.'}</p>
              <p className="text-[11px] text-amber-700">
                Verifica que el nombre esté escrito tal como en la invitación o solicita apoyo a los anfitriones.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overview of Zones */}
      <div className="pt-2 border-t border-[#D3B48C]/30 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
          Zonas & Distribución del Salón
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {eventZones.map((z, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-white/70 border border-[#D3B48C]/30 text-center space-y-0.5 shadow-2xs">
              <span className="text-xs font-bold block" style={{ color: z.color }}>{z.name}</span>
              <span className="text-[10px] text-slate-500">{z.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
