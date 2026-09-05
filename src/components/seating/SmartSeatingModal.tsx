'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Wand2, Users, ArrowRight, CheckCircle2, Sparkles, AlertCircle, Check, X, Layers, Compass } from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { SeatingTable, Guest } from '@/types';
import confetti from 'canvas-confetti';

interface SmartSeatingSuggestion {
  id: string;
  guestId: string;
  tableId: string;
  guestName: string;
  guestProfile: string;
  guestGroup: string;
  guestCount: number;
  tableName: string;
  tableNumber: number;
  tableZone: string;
  tableCapacity: number;
  currentOccupancy: number;
  reason: string;
}

interface SmartSeatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onApplied?: () => void;
}

export default function SmartSeatingModal({
  isOpen,
  onClose,
  eventId,
  onApplied,
}: SmartSeatingModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSeatingSuggestion[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const tables = InvitaStore.getTablesForEvent(eventId);
  const guests = InvitaStore.getGuestsForEvent(eventId);
  const allAssigned = new Set(tables.flatMap((t) => t.assignedGuestIds));
  const unassignedGuests = guests.filter((g) => g.status === 'CONFIRMED' && !allAssigned.has(g.id));

  useEffect(() => {
    if (isOpen) {
      setSuggestions([]);
      setHasRun(false);
      setIsGenerating(false);
    }
  }, [isOpen]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const results = InvitaStore.generateSmartSeatingSuggestions(eventId);
      setSuggestions(results);
      setIsGenerating(false);
      setHasRun(true);
    }, 900);
  };

  const handleAcceptOne = (sug: SmartSeatingSuggestion) => {
    InvitaStore.assignGuestToTable(eventId, sug.guestId, sug.tableId);
    setSuggestions((prev) => prev.filter((s) => s.id !== sug.id));
    if (onApplied) onApplied();
  };

  const handleRejectOne = (sugId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== sugId));
  };

  const handleAcceptAll = () => {
    suggestions.forEach((sug) => {
      InvitaStore.assignGuestToTable(eventId, sug.guestId, sug.tableId);
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4E8281', '#D3B48C', '#97B8B3'],
      });
    } catch {
      // ignore
    }

    setSuggestions([]);
    if (onApplied) onApplied();
    onClose();
  };

  const getProfileBadgeStyle = (profile: string) => {
    switch (profile) {
      case 'VIP':
      case 'INVITADO ESPECIAL':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'FAMILIA':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'AMIGO':
      case 'PAREJA':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'EMPRESA':
      case 'PROVEEDOR':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'STAFF':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Acomodo Inteligente de Mesas"
      subtitle="Motor de Distribución Automatizada • Smart Guest Control"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2424] via-[#162E2D] to-[#0A1818] p-6 text-white border-2 border-[#D3B48C]/50 shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Wand2 className="h-40 w-40 text-[#D3B48C]" />
          </div>

          <div className="relative z-10 space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#D3B48C]/40 text-[#D3B48C] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-[#D3B48C]" />
                <span>Optimización Algorítmica</span>
              </div>
              <h3 className="text-xl font-bold font-cinzel text-white">
                Distribución por Afinidad & Zonas
              </h3>
              <p className="text-xs text-[#C0D3CC] max-w-md">
                Analiza a los <strong>{unassignedGuests.length} invitados confirmados sin mesa</strong> y las <strong>{tables.length} mesas del salón</strong> para agrupar familias y optimizar capacidades.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || unassignedGuests.length === 0}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D3B48C] to-[#C49A45] hover:from-[#E5CAA5] hover:to-[#D4AC59] text-[#0F2424] font-bold text-xs uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isGenerating ? 'Analizando Variables...' : '✦ Generar Acomodo'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-white/10 text-[11px] text-[#FAF6F0]/80">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Grupos familiares juntos</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Respeto a zonas VIP/Honor</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Capacidad optimizada</span>
            </span>
          </div>
        </div>

        {/* Suggestions List */}
        {hasRun && suggestions.length > 0 && (
          <div className="space-y-3 animate-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#162E2D] flex items-center gap-2">
                <span>Sugerencias Encontradas</span>
                <span className="px-2 py-0.5 rounded-full bg-[#4E8281] text-white text-[10px]">
                  {suggestions.length} asignaciones
                </span>
              </h4>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="text-xs font-bold text-[#4E8281] hover:underline"
              >
                Aceptar Todas ({suggestions.length})
              </button>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#4E8281] transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Guest Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-[#162E2D]">{sug.guestName}</h5>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getProfileBadgeStyle(sug.guestProfile)}`}>
                          {sug.guestProfile}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#778F8C] flex items-center gap-1">
                        <Users className="h-3 w-3 text-[#4E8281]" />
                        <span>{sug.guestCount} {sug.guestCount === 1 ? 'persona' : 'personas'}</span>
                        <span>• Grupo: {sug.guestGroup}</span>
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#D3B48C] shrink-0 hidden sm:block" />

                    {/* Table Assignment Target */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#4E8281]">{sug.tableName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#D3B48C]/40 text-[#162E2D] font-semibold">
                          {sug.tableZone}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#778F8C]">
                        Ocupación resultante: {sug.currentOccupancy + sug.guestCount} / {sug.tableCapacity} asientos
                      </p>
                    </div>
                  </div>

                  {/* Justification & Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleAcceptOne(sug)}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Aceptar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectOne(sug.id)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#778F8C] hover:text-[#162E2D] border border-slate-300 font-semibold text-xs transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasRun && suggestions.length === 0 && (
          <div className="p-8 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm text-[#162E2D]">Todos los invitados confirmados están asignados</h4>
            <p className="text-xs text-[#778F8C]">
              No hay invitados pendientes por acomodar en este momento o las mesas han alcanzado su capacidad máxima.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-[#D3B48C]/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#EFE3D4] hover:bg-[#E5D7C5] text-[#162E2D] font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
          {suggestions.length > 0 && (
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-6 py-2 rounded-full bg-[#4E8281] hover:bg-[#3D6E6D] text-white font-bold text-xs shadow-md transition-colors"
            >
              Aplicar Todas las Asignaciones
            </button>
          )}
        </div>

      </div>
    </Modal>
  );
}
