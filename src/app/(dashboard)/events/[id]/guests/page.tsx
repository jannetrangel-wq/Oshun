'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MessageSquare,
  QrCode,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { Guest, GuestStatus } from '@/types';
import { exportGuestsToCsv, parseGuestsCsv } from '@/lib/export';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import Modal from '@/components/ui/Modal';
import EventNavTabs from '@/components/ui/EventNavTabs';

export default function GuestsCRMPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState(InvitaStore.getEventById(eventId) || InvitaStore.getEvents()[0]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | GuestStatus>('ALL');
  const [groupFilter, setGroupFilter] = useState<string>('ALL');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGroup, setFormGroup] = useState('Familia');
  const [formAllowed, setFormAllowed] = useState(2);
  const [formTable, setFormTable] = useState('Mesa 1');
  const [formNotes, setFormNotes] = useState('');

  const refreshGuests = () => {
    if (event) {
      const g = InvitaStore.getGuestsForEvent(event.id);
      setGuests(g);
    }
  };

  useEffect(() => {
    refreshGuests();
  }, [event]);

  if (!event) return null;

  const stats = InvitaStore.getEventStats(event.id);

  // Filters
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm) ||
      (g.tableNumber && g.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesGroup = groupFilter === 'ALL' || g.group === groupFilter;

    return matchesSearch && matchesStatus && matchesGroup;
  });

  const availableGroups = Array.from(new Set(guests.map((g) => g.group || 'General')));

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormGroup('Familia Novia');
    setFormAllowed(2);
    setFormTable('Mesa 1');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormPhone(guest.phone);
    setFormEmail(guest.email || '');
    setFormGroup(guest.group || 'General');
    setFormAllowed(guest.allowedCompanions);
    setFormTable(guest.tableNumber || '');
    setFormNotes(guest.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingGuest) {
      InvitaStore.updateGuest(event.id, editingGuest.id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        group: formGroup,
        allowedCompanions: formAllowed,
        tableNumber: formTable,
        notes: formNotes,
      });
    } else {
      const newCode = `OSH${Math.floor(100 + Math.random() * 900)}`;
      const newGuest: Guest = {
        id: `guest-${Date.now()}`,
        eventId: event.id,
        code: newCode,
        name: formName.trim(),
        phone: formPhone.trim() || '+525500000000',
        email: formEmail.trim(),
        group: formGroup,
        status: 'PENDING',
        allowedCompanions: formAllowed,
        confirmedCompanions: 0,
        companionNames: [],
        dietaryRestrictions: 'Ninguna',
        tableNumber: formTable,
        notes: formNotes,
        checkedIn: false,
      };
      InvitaStore.addGuest(event.id, newGuest);
    }

    setIsAddModalOpen(false);
    refreshGuests();
  };

  const handleDeleteGuest = (guestId: string) => {
    if (confirm('¿Estás seguro de eliminar a este invitado de la lista?')) {
      InvitaStore.deleteGuest(event.id, guestId);
      refreshGuests();
    }
  };

  const handleExportCsv = () => {
    exportGuestsToCsv(guests, `invitados-${event.slug}.csv`);
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const parsed = parseGuestsCsv(text);
        const formatted: Guest[] = parsed.map((p, idx) => ({
          id: `guest-imp-${Date.now()}-${idx}`,
          eventId: event.id,
          code: `OSH${Math.floor(100 + Math.random() * 900)}`,
          name: p.name || 'Invitado',
          phone: p.phone || '+525500000000',
          email: p.email || '',
          group: p.group || 'Importados',
          status: 'PENDING',

          allowedCompanions: p.allowedCompanions || 1,
          confirmedCompanions: 0,
          companionNames: [],
          dietaryRestrictions: 'Ninguna',
          tableNumber: p.tableNumber || 'Por asignar',
          checkedIn: false,
        }));
        InvitaStore.saveGuestsForEvent(event.id, [...guests, ...formatted]);
        refreshGuests();
      }
    };
    reader.readAsText(file);
  };


  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Event Sub-Navigation Tabs */}
      <EventNavTabs />

      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
            CRM & Control de Asistencia • OSHUN
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Lista de Invitados ({guests.length})
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#D3B48C]/40 text-xs font-semibold text-[#162E2D] hover:bg-[#FAF6F0] shadow-sm transition-all">
            <Upload className="h-3.5 w-3.5 text-[#4E8281]" />
            <span>Importar CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
          </label>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#D3B48C]/40 text-xs font-semibold text-[#162E2D] hover:bg-[#FAF6F0] shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5 text-[#4E8281]" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="btn-oshun-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar Invitado</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#D3B48C]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-[#778F8C] block">Total Cupos</span>
          <span className="text-xl font-bold text-[#162E2D]">{stats.totalGuests}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-emerald-500/30 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Confirmados</span>
          <span className="text-xl font-bold text-emerald-700">{stats.confirmed}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-amber-500/30 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-amber-800 block">Pendientes</span>
          <span className="text-xl font-bold text-amber-700">{stats.pending}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-rose-500/30 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-rose-800 block">Declinados</span>
          <span className="text-xl font-bold text-rose-700">{stats.declined}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white border border-[#D3B48C]/35 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, código (#VIP01), mesa..."
            className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30 pl-9 pr-4 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30 px-3 py-2 text-xs font-semibold text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="CONFIRMED">✓ Confirmados</option>
            <option value="PENDING">⏳ Pendientes</option>
            <option value="DECLINED">✕ Declinados</option>
          </select>

          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30 px-3 py-2 text-xs font-semibold text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
          >
            <option value="ALL">Todos los Grupos</option>
            {availableGroups.map((grp) => (
              <option key={grp} value={grp}>
                {grp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="rounded-3xl bg-white border border-[#D3B48C]/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#D3B48C]/30 text-[#778F8C] uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Invitado / Código</th>
                <th className="py-3 px-3">Grupo</th>
                <th className="py-3 px-3">Mesa</th>
                <th className="py-3 px-3 text-center">Pases</th>
                <th className="py-3 px-3">Estado RSVP</th>
                <th className="py-3 px-3 text-center">Check-in</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3B48C]/20">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#778F8C]">
                    No se encontraron invitados con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const whatsAppUrl = buildWhatsAppUrl(
                    guest.phone,
                    `¡Hola, ${guest.name}! 🌊 Te compartimos tu invitación formal para ${event.title}: ${
                      typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com'
                    }/i/${event.slug}/${guest.code}`
                  );

                  return (
                    <tr key={guest.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#EADBC6]/40 text-[#4E8281] flex items-center justify-center font-bold text-[11px] shrink-0">
                            {guest.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#162E2D] block">{guest.name}</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#778F8C]">
                              <span className="font-mono text-[#4E8281] font-bold">#{guest.code}</span>
                              <span>•</span>
                              <span>{guest.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EADBC6]/30 text-[#4E8281]">
                          {guest.group || 'General'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-xs font-semibold text-[#162E2D]">{guest.tableNumber || '—'}</span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-[#162E2D]">
                          {guest.confirmedCompanions || 0} / {guest.allowedCompanions}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            guest.status === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-800'
                              : guest.status === 'DECLINED'
                              ? 'bg-rose-500/10 text-rose-800'
                              : 'bg-amber-500/10 text-amber-800'
                          }`}
                        >
                          {guest.status === 'CONFIRMED' ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Confirmado</span>
                            </>
                          ) : guest.status === 'DECLINED' ? (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Declinó</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" />
                              <span>Pendiente</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {guest.checkedIn ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#C0D3CC]/40 text-[#4E8281] font-bold text-[10px]">
                            ✓ Ingresó
                          </span>
                        ) : (
                          <span className="text-[#778F8C] text-[10px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Direct Dispatch */}
                          <a
                            href={whatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="Enviar pase por WhatsApp"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </a>

                          {/* View Personal Ticket Link */}
                          <Link
                            href={`/i/${event.slug}/${guest.code}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-[#FAF6F0] text-[#4E8281] hover:bg-[#EFE3D4] transition-colors"
                            title="Ver boleto digital con QR"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(guest)}
                            className="p-1.5 rounded-lg bg-[#FAF6F0] text-[#778F8C] hover:text-[#162E2D] hover:bg-[#EFE3D4] transition-colors"
                            title="Editar invitado"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Eliminar invitado"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingGuest ? 'Editar Invitado' : 'Nuevo Invitado'}
        subtitle={event.title}
        maxWidth="md"
      >
        <form onSubmit={handleSaveGuest} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#162E2D] mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ej. Lic. Roberto Garza Sada"
              className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1">WhatsApp</label>
              <input
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+52 55 1234 5678"
                className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Grupo</label>
              <input
                type="text"
                value={formGroup}
                onChange={(e) => setFormGroup(e.target.value)}
                placeholder="Familia, Amigos, VIP..."
                className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Pases Asignados</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formAllowed}
                onChange={(e) => setFormAllowed(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Mesa</label>
              <input
                type="text"
                value={formTable}
                onChange={(e) => setFormTable(e.target.value)}
                placeholder="Mesa 1 (Honor)"
                className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#162E2D] mb-1">Notas Internas</label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Detalles sobre el invitado..."
              className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-full bg-[#EFE3D4] text-xs font-semibold text-[#162E2D]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-oshun-primary text-xs px-5 py-2"
            >
              {editingGuest ? 'Guardar Cambios' : 'Agregar Invitado'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
