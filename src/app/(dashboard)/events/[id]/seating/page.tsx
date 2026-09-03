'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  LayoutGrid,
  Users,
  Plus,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  UserCheck,
  UserPlus,
  ArrowRight,
  Download,
  Printer,
  ChevronRight,
  AlertCircle,
  Armchair,
  Check,
  X,
  Layers,
  MapPin,
  MoveRight,
  Utensils,
  Scissors,
  Split,
  Move,
  Maximize2,
  Compass,
  RotateCcw,
  Sliders,
  Eye,
  ArrowLeftRight,
  Heart,
  Crown,
  Star,
  GraduationCap,
  Cake,
  Briefcase,
  Baby,
  Settings2,
  Camera,
  Music2,
  ToggleLeft,
  ToggleRight,
  PartyPopper
} from 'lucide-react';
import EventNavTabs from '@/components/ui/EventNavTabs';
import { InvitaStore } from '@/lib/store';
import { Event, Guest, SeatingTable, TableShape, EventCategory } from '@/types';
import Modal from '@/components/ui/Modal';
import confetti from 'canvas-confetti';
import FeatureGuard from '@/components/auth/FeatureGuard';

interface LandmarkPosition {
  id: string;
  title: string;
  subtitle: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  enabled: boolean;
  type: 'dance_floor' | 'bar' | 'garden' | 'entrance' | 'dessert' | 'photobooth' | 'stage' | 'custom';
  className: string;
}

const DEFAULT_LANDMARKS: LandmarkPosition[] = [
  {
    id: 'dance_floor',
    title: '💃 Pista de Baile & Escenario DJ',
    subtitle: 'Zona Central',
    x: 50,
    y: 12,
    enabled: true,
    type: 'dance_floor',
    className: 'w-64 h-16 rounded-2xl bg-[#EFE3D4] border-2 border-dashed border-[#D3B48C] text-[#4E8281]',
  },
  {
    id: 'bar',
    title: '🍸 Bar & Cocktails',
    subtitle: 'Bebidas & Coctelería',
    x: 88,
    y: 12,
    enabled: true,
    type: 'bar',
    className: 'p-3 rounded-2xl bg-white/95 border border-[#D3B48C] text-[#162E2D]',
  },
  {
    id: 'garden',
    title: '🌿 Terraza Jardín',
    subtitle: 'Área al aire libre',
    x: 12,
    y: 12,
    enabled: true,
    type: 'garden',
    className: 'p-3 rounded-2xl bg-emerald-50/95 border border-emerald-300 text-emerald-900',
  },
  {
    id: 'entrance',
    title: '🚪 Entrada Principal & Recepción',
    subtitle: 'Check-in y bienvenida',
    x: 50,
    y: 95,
    enabled: true,
    type: 'entrance',
    className: 'px-6 py-2 rounded-full bg-[#0F2424] text-white border border-[#D3B48C]',
  },
  {
    id: 'dessert',
    title: '🍰 Mesa de Postres & Pastel',
    subtitle: 'Candy Bar',
    x: 12,
    y: 90,
    enabled: false,
    type: 'dessert',
    className: 'p-2.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900',
  },
  {
    id: 'photobooth',
    title: '📸 Cabina de Fotos / Photobooth',
    subtitle: 'Recuerdos y fotos',
    x: 88,
    y: 90,
    enabled: false,
    type: 'photobooth',
    className: 'p-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900',
  },
];

const EVENT_TYPE_OPTIONS: { id: EventCategory; label: string; icon: string; mainTableName: string; defaultCapacity: number; fixedTwoPersons: boolean; desc: string }[] = [
  { id: 'boda', label: '👰 Boda', icon: '💍', mainTableName: 'Mesa de Novios', defaultCapacity: 2, fixedTwoPersons: true, desc: 'Lleva Mesa de Novios exclusiva (2 personas fijas)' },
  { id: 'xv', label: '👑 XV Años (Quinceañera)', icon: '👑', mainTableName: 'Mesa de Quinceañera', defaultCapacity: 8, fixedTwoPersons: false, desc: 'Pregunta si lleva mesa principal y número de personas (Quinceañera, Chambelanes, Padres)' },
  { id: 'cumpleanos', label: '🎂 Cumpleaños', icon: '🎂', mainTableName: 'Mesa del Festejado(a)', defaultCapacity: 6, fixedTwoPersons: false, desc: 'Pregunta si lleva mesa de honor para el cumpleañero y acompañantes' },
  { id: 'graduacion', label: '🎓 Graduación', icon: '🎓', mainTableName: 'Mesa de Graduados / Honor', defaultCapacity: 8, fixedTwoPersons: false, desc: 'Mesa de honor para los graduados y familiares' },
  { id: 'bautizo', label: '🕊️ Bautizo', icon: '🕊️', mainTableName: 'Mesa de Honor / Padrinos', defaultCapacity: 6, fixedTwoPersons: false, desc: 'Mesa de honor para padres y padrinos' },
  { id: 'baby_shower', label: '👶 Baby Shower', icon: '👶', mainTableName: 'Mesa de los Futuros Papás', defaultCapacity: 4, fixedTwoPersons: false, desc: 'Mesa principal para la mamá / futuros papás' },
  { id: 'aniversario', label: '🥂 Aniversario', icon: '🥂', mainTableName: 'Mesa de Honor (Aniversario)', defaultCapacity: 4, fixedTwoPersons: false, desc: 'Mesa para la pareja celebrante y familia cercana' },
  { id: 'empresarial', label: '💼 Corporativo / Gala', icon: '⭐', mainTableName: 'Mesa Presidencial / VIP', defaultCapacity: 10, fixedTwoPersons: false, desc: 'Mesa directiva o presidencial para ejecutivos y ponentes' },
  { id: 'otro', label: '🎉 Otro Evento Social', icon: '⭐', mainTableName: 'Mesa Principal', defaultCapacity: 6, fixedTwoPersons: false, desc: 'Configuración libre de mesa principal' },
];

export default function SeatingPlanPage() {
  const params = useParams();
  const eventId = params.id as string;

  const event = InvitaStore.getEventById(eventId) || InvitaStore.getEvents()[0];
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  // Event Type State (Boda, XV Años, Cumpleaños, Graduación, etc.)
  const [eventType, setEventType] = useState<EventCategory>(event?.category || 'boda');

  // View Mode: 'FLOOR_PLAN_2D' (Salón Ficticio Interactivo) or 'CARDS' (Tarjetas y Lista)
  const [viewMode, setViewMode] = useState<'FLOOR_PLAN_2D' | 'CARDS'>('FLOOR_PLAN_2D');

  // Active Selected Table on Floor Plan
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Edit Landmarks / Hall Zones Mode (Mover Pista, Bar, Jardín, Entrada)
  const [isEditLandmarksMode, setIsEditLandmarksMode] = useState(false);
  const [landmarks, setLandmarks] = useState<LandmarkPosition[]>(DEFAULT_LANDMARKS);
  const [draggingLandmarkId, setDraggingLandmarkId] = useState<string | null>(null);

  // Modal: Personalizar Zonas Arquitectónicas
  const [isCustomZonesModalOpen, setIsCustomZonesModalOpen] = useState(false);
  const [newZoneTitle, setNewZoneTitle] = useState('');
  const [newZoneSubtitle, setNewZoneSubtitle] = useState('');

  // Modal: Configuración de Tipo de Evento & Mesa Principal
  const [isMainTableModalOpen, setIsMainTableModalOpen] = useState(false);
  const [modalEventType, setModalEventType] = useState<EventCategory>(event?.category || 'boda');
  const [modalIncludeMainTable, setModalIncludeMainTable] = useState(true);
  const [modalMainTableCapacity, setModalMainTableCapacity] = useState<number>(
    event?.category === 'boda' ? 2 : event?.category === 'xv' ? 8 : 6
  );
  const [modalMainTableName, setModalMainTableName] = useState<string>('Mesa de Novios');

  // Dragging states
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const [draggingGuestId, setDraggingGuestId] = useState<string | null>(null);
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null);

  // Floor Plan container ref for coordinate calculations
  const floorPlanRef = useRef<HTMLDivElement>(null);

  // Active dragging state (Window-level smooth dragging)
  const [activeDragItem, setActiveDragItem] = useState<{
    type: 'table' | 'landmark';
    id: string;
    startClientX: number;
    startClientY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  // Modal: Crear / Editar Mesa
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<SeatingTable | null>(null);
  const [tableName, setTableName] = useState('');
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [tableShape, setTableShape] = useState<TableShape>('ROUND');
  const [tableCapacity, setTableCapacity] = useState<number>(10);
  const [tableZone, setTableZone] = useState<string>('Salón Principal');
  const [tableNotes, setTableNotes] = useState<string>('');

  // Modal: Gestión Detallada de Invitados en Mesa (Doble Clic)
  const [isTableGuestsModalOpen, setIsTableGuestsModalOpen] = useState(false);
  const [activeTableForGuests, setActiveTableForGuests] = useState<SeatingTable | null>(null);

  // Modal: Separar Familia / Grupo en Diferentes Mesas (Split)
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splittingGuest, setSplittingGuest] = useState<Guest | null>(null);
  const [splitAssignments, setSplitAssignments] = useState<{ tableId: string; count: number; nameLabel: string }[]>([
    { tableId: '', count: 1, nameLabel: 'Parte 1 (Adultos)' },
    { tableId: '', count: 1, nameLabel: 'Parte 2 (Jóvenes / Niños)' },
  ]);

  // Modal: Asignar Invitado a Mesa
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetTableForAssign, setTargetTableForAssign] = useState<SeatingTable | null>(null);

  // Modal: Vista Hostess / Recepción en Puerta
  const [isHostessModalOpen, setIsHostessModalOpen] = useState(false);
  const [hostessSearch, setHostessSearch] = useState('');

  // Toast Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = () => {
    const cur = InvitaStore.getEventById(eventId) || InvitaStore.getEvents()[0];
    if (!cur) return;
    const currentTables = InvitaStore.getTablesForEvent(cur.id);
    const currentGuests = InvitaStore.getGuestsForEvent(cur.id);

    setTables(currentTables);
    setGuests(currentGuests);

    if (activeTableForGuests) {
      const refreshed = currentTables.find((t) => t.id === activeTableForGuests.id);
      if (refreshed) setActiveTableForGuests(refreshed);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  // Active dragging state using Ref to avoid stale closure state bugs
  const activeDragRef = useRef<{
    type: 'table' | 'landmark';
    id: string;
    startClientX: number;
    startClientY: number;
    startPosX: number;
    startPosY: number;
    currentX: number;
    currentY: number;
    hasMoved: boolean;
  } | null>(null);

  const justFinishedDragRef = useRef<boolean>(false);

  // Window-level dragging listener for 100% reliable continuous mouse movement
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const drag = activeDragRef.current;
      if (!drag || !floorPlanRef.current) return;

      const rect = floorPlanRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - drag.startClientX) / rect.width) * 100;
      const deltaY = ((e.clientY - drag.startClientY) / rect.height) * 100;

      if (Math.abs(e.clientX - drag.startClientX) > 2 || Math.abs(e.clientY - drag.startClientY) > 2) {
        drag.hasMoved = true;
      }

      const newX = Math.max(3, Math.min(97, Number((drag.startPosX + deltaX).toFixed(2))));
      const newY = Math.max(3, Math.min(97, Number((drag.startPosY + deltaY).toFixed(2))));

      drag.currentX = newX;
      drag.currentY = newY;

      if (drag.type === 'table') {
        setTables((prev) =>
          prev.map((t) => (t.id === drag.id ? { ...t, posX: newX, posY: newY } : t))
        );
      } else if (drag.type === 'landmark') {
        setLandmarks((prev) =>
          prev.map((l) => (l.id === drag.id ? { ...l, x: newX, y: newY } : l))
        );
      }
    };

    const handleGlobalMouseUp = () => {
      const drag = activeDragRef.current;
      if (!drag) return;

      if (drag.hasMoved) {
        justFinishedDragRef.current = true;
        setTimeout(() => {
          justFinishedDragRef.current = false;
        }, 200);

        const curEventId = eventId || 'event-01';
        if (drag.type === 'table') {
          InvitaStore.updateTablePosition(curEventId, drag.id, drag.currentX, drag.currentY);
        }
      }

      activeDragRef.current = null;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [eventId]);

  if (!event) return null;

  // Helper to calculate total seats used on a table
  const getTableOccupancy = (table: SeatingTable) => {
    let count = 0;
    table.assignedGuestIds.forEach((gId) => {
      const split = table.assignedSplits?.find((s) => s.guestId === gId);
      if (split) {
        count += split.count;
      } else {
        const g = guests.find((x) => x.id === gId);
        count += g?.confirmedCompanions || g?.allowedCompanions || 1;
      }
    });
    return count;
  };

  // Derived metrics
  const totalChairsCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
  const seatedHeadcount = tables.reduce((sum, t) => sum + getTableOccupancy(t), 0);
  const availableSeats = Math.max(0, totalChairsCapacity - seatedHeadcount);
  const occupancyPercentage =
    totalChairsCapacity > 0 ? Math.min(100, Math.round((seatedHeadcount / totalChairsCapacity) * 100)) : 0;

  // Confirmed guests who are unassigned or partially assigned
  const allAssignedGuestIds = new Set(tables.flatMap((t) => t.assignedGuestIds));
  const unassignedConfirmedGuests = guests.filter(
    (g) => g.status === 'CONFIRMED' && !allAssignedGuestIds.has(g.id)
  );

  // Filter tables
  const filteredTables = tables.filter((t) => {
    const matchesZone = selectedZone === 'ALL' || t.zone === selectedZone;
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedGuestIds.some((gId) => {
        const g = guests.find((x) => x.id === gId);
        return g?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    return matchesZone && matchesSearch;
  });

  // Identify the single Main / Honor / Sweetheart table
  const mainTable = tables.find(
    (t) =>
      t.shape === 'HONOR' ||
      t.name.toLowerCase().includes('novio') ||
      t.name.toLowerCase().includes('quinceañera') ||
      t.name.toLowerCase().includes('xv') ||
      t.name.toLowerCase().includes('principal') ||
      t.name.toLowerCase().includes('festejado')
  );
  const hasMainTable = !!mainTable;

  // Current event type definition
  const currentEventTypeConfig =
    EVENT_TYPE_OPTIONS.find((opt) => opt.id === eventType) || EVENT_TYPE_OPTIONS[0];

  // Open Main Table Config Modal
  const handleOpenMainTableModal = () => {
    setModalEventType(eventType);
    setModalIncludeMainTable(hasMainTable);
    if (mainTable) {
      setModalMainTableCapacity(mainTable.capacity);
      setModalMainTableName(mainTable.name);
    } else {
      setModalMainTableCapacity(currentEventTypeConfig.defaultCapacity);
      setModalMainTableName(currentEventTypeConfig.mainTableName);
    }
    setIsMainTableModalOpen(true);
  };

  // Save Main Table Config from Modal
  const handleSaveMainTableConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setEventType(modalEventType);

    if (!modalIncludeMainTable) {
      if (mainTable) {
        InvitaStore.deleteTable(event.id, mainTable.id);
        showNotification('Mesa principal removida del salón.');
      }
      setIsMainTableModalOpen(false);
      loadData();
      return;
    }

    const finalCapacity = modalEventType === 'boda' ? 2 : Math.max(1, modalMainTableCapacity);
    const finalName =
      modalEventType === 'boda'
        ? 'Mesa de Novios'
        : modalMainTableName.trim() || currentEventTypeConfig.mainTableName;

    if (mainTable) {
      InvitaStore.updateTable(event.id, mainTable.id, {
        name: finalName,
        capacity: finalCapacity,
        shape: 'HONOR',
      });
      showNotification(`Mesa principal actualizada: "${finalName}" (${finalCapacity} personas).`);
    } else {
      InvitaStore.createTable(event.id, {
        name: finalName,
        tableNumber: 0,
        shape: 'HONOR',
        capacity: finalCapacity,
        zone: 'Frente a Pista de Baile',
        notes: `Mesa Principal para ${currentEventTypeConfig.label} (${finalCapacity} personas)`,
        posX: 50,
        posY: 24,
        assignedGuestIds: [],
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D3B48C', '#4E8281', '#FFD1DC', '#FFFFFF'],
      });

      showNotification(`¡"${finalName}" (${finalCapacity} personas) colocada en el salón!`);
    }

    setIsMainTableModalOpen(false);
    loadData();
  };

  // Open Create Standard Table Modal
  const handleOpenCreateTable = () => {
    setEditingTable(null);
    const nextNum = tables.length > 0 ? Math.max(...tables.map((t) => t.tableNumber)) + 1 : 1;
    setTableName(`Mesa ${nextNum}`);
    setTableNumber(nextNum);
    setTableShape('ROUND');
    setTableCapacity(10);
    setTableZone('Salón Principal');
    setTableNotes('');
    setIsTableModalOpen(true);
  };

  // Open Edit Table Modal
  const handleOpenEditTable = (t: SeatingTable) => {
    setEditingTable(t);
    setTableName(t.name);
    setTableNumber(t.tableNumber);
    setTableShape(t.shape);
    setTableCapacity(t.capacity);
    setTableZone(t.zone || 'Salón Principal');
    setTableNotes(t.notes || '');
    setIsTableModalOpen(true);
  };

  // Open Double Click Table Modal
  const handleTableDoubleClick = (t: SeatingTable) => {
    setActiveTableForGuests(t);
    setIsTableGuestsModalOpen(true);
  };

  // Quick capacity modifier on table (+1 / -1)
  const handleAdjustTableCapacity = (tableId: string, delta: number) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    if (eventType === 'boda' && (table.shape === 'HONOR' || table.name.toLowerCase().includes('novio'))) {
      showNotification('La Mesa de Novios en boda es fija para 2 personas.');
      return;
    }
    const newCap = Math.max(1, Math.min(24, table.capacity + delta));
    InvitaStore.updateTable(event.id, tableId, { capacity: newCap });
    loadData();
  };

  // Save Table (Create / Update)
  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName.trim()) return;

    const isHonor = tableShape === 'HONOR' || tableName.toLowerCase().includes('novio') || tableName.toLowerCase().includes('quinceañera') || tableName.toLowerCase().includes('principal');
    const finalCapacity = eventType === 'boda' && isHonor ? 2 : tableCapacity;

    if (editingTable) {
      InvitaStore.updateTable(event.id, editingTable.id, {
        name: tableName.trim(),
        tableNumber,
        shape: tableShape,
        capacity: finalCapacity,
        zone: tableZone,
        notes: tableNotes,
      });
      showNotification(`Mesa "${tableName}" actualizada.`);
    } else {
      InvitaStore.createTable(event.id, {
        name: tableName.trim(),
        tableNumber,
        shape: tableShape,
        capacity: finalCapacity,
        zone: tableZone,
        notes: tableNotes,
        posX: 50,
        posY: 50,
        assignedGuestIds: [],
      });
      showNotification(`Mesa "${tableName}" agregada al salón.`);
    }

    setIsTableModalOpen(false);
    loadData();
  };

  // Delete Table
  const handleDeleteTable = (tableId: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la "${name}"? Los invitados asignados pasarán a la lista de pendientes.`)) {
      InvitaStore.deleteTable(event.id, tableId);
      showNotification(`"${name}" eliminada.`);
      loadData();
    }
  };

  // Assign Guest to Table
  const handleAssignGuest = (guestId: string, tableId: string) => {
    InvitaStore.assignGuestToTable(event.id, guestId, tableId);
    const g = guests.find((x) => x.id === guestId);
    const t = tables.find((x) => x.id === tableId);
    showNotification(`¡${g?.name} asignado a ${t?.name}!`);
    loadData();
    setIsAssignModalOpen(false);
  };

  // Move Guest from one table to another
  const handleMoveGuestToTable = (guestId: string, fromTableId: string, targetTableId: string) => {
    if (!targetTableId || targetTableId === fromTableId) return;
    InvitaStore.assignGuestToTable(event.id, guestId, targetTableId);
    const g = guests.find((x) => x.id === guestId);
    const targetT = tables.find((x) => x.id === targetTableId);
    showNotification(`¡${g?.name} movido a ${targetT?.name}!`);
    loadData();
  };

  // Remove Guest from Table
  const handleRemoveGuest = (guestId: string, tableId: string) => {
    InvitaStore.removeGuestFromTable(event.id, guestId, tableId);
    const g = guests.find((x) => x.id === guestId);
    showNotification(`${g?.name} removido de la mesa.`);
    loadData();
  };

  // Auto-Assign Confirmed Guests
  const handleAutoAssign = () => {
    const res = InvitaStore.autoAssignConfirmedGuests(event.id);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4E8281', '#D3B48C', '#97B8B3'],
    });
    showNotification(`¡Auto-Acomodo listo! Se asignaron ${res.assigned} invitados en ${res.tablesUsed} mesas.`);
    loadData();
  };

  // Reset Salon Floor Plan Layout
  const handleResetFloorPlan = () => {
    tables.forEach((t, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const px = 20 + col * 30;
      const py = 25 + row * 26;
      InvitaStore.updateTablePosition(event.id, t.id, px, py);
    });
    setLandmarks(DEFAULT_LANDMARKS);
    showNotification('Plano del salón y zonas reordenadas armónicamente.');
    loadData();
  };

  // Open Split Family Modal
  const handleOpenSplitModal = (guest: Guest) => {
    setSplittingGuest(guest);
    const totalPases = guest.confirmedCompanions || guest.allowedCompanions || 2;
    const half1 = Math.ceil(totalPases / 2);
    const half2 = totalPases - half1;

    setSplitAssignments([
      { tableId: tables[0]?.id || '', count: half1, nameLabel: `${guest.name} (Adultos)` },
      { tableId: tables[1]?.id || '', count: half2, nameLabel: `${guest.name} (Jóvenes / Niños)` },
    ]);
    setIsSplitModalOpen(true);
  };

  // Save Split Family
  const handleSaveSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!splittingGuest) return;

    const totalAssigned = splitAssignments.reduce((sum, s) => sum + (Number(s.count) || 0), 0);
    const maxPases = splittingGuest.confirmedCompanions || splittingGuest.allowedCompanions || 1;

    if (totalAssigned > maxPases) {
      alert(`El total de pases asignados (${totalAssigned}) excede los pases de la familia (${maxPases}).`);
      return;
    }

    InvitaStore.splitFamilyAcrossTables(
      event.id,
      splittingGuest.id,
      splitAssignments.filter((s) => s.tableId && s.count > 0)
    );

    showNotification(`Familia "${splittingGuest.name}" dividida en mesas separadas.`);
    setIsSplitModalOpen(false);
    loadData();
  };

  // Toggle Landmark enabled status
  const handleToggleLandmark = (landmarkId: string) => {
    setLandmarks((prev) =>
      prev.map((l) => (l.id === landmarkId ? { ...l, enabled: !l.enabled } : l))
    );
  };

  // Update Landmark Title
  const handleUpdateLandmarkText = (landmarkId: string, title: string, subtitle: string) => {
    setLandmarks((prev) =>
      prev.map((l) => (l.id === landmarkId ? { ...l, title, subtitle } : l))
    );
  };

  // Add Custom Landmark Zone
  const handleAddCustomZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneTitle.trim()) return;

    const newZone: LandmarkPosition = {
      id: `custom_${Date.now()}`,
      title: newZoneTitle.trim(),
      subtitle: newZoneSubtitle.trim() || 'Zona personalizada',
      x: 50,
      y: 50,
      enabled: true,
      type: 'custom',
      className: 'p-3 rounded-2xl bg-indigo-50 border border-indigo-300 text-indigo-900',
    };

    setLandmarks((prev) => [...prev, newZone]);
    setNewZoneTitle('');
    setNewZoneSubtitle('');
    showNotification(`Zona "${newZone.title}" agregada al salón.`);
  };

  // Drop Guest on Table
  const handleDropOnTable = (tableId: string) => {
    if (draggingGuestId) {
      handleAssignGuest(draggingGuestId, tableId);
      setDraggingGuestId(null);
      setHoveredTableId(null);
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];
  const activeLandmarks = landmarks.filter((l) => l.enabled);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Event Sub-Navigation Tabs */}
      <EventNavTabs />

      <FeatureGuard
        feature="canSeatingPlan"
        featureName="Acomodo de Mesas & Salón Ficticio 2D"
        requiredPlan="ELEGANCE"
      >
        {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-[#0F2424] text-[#FAF6F0] px-4 py-2.5 rounded-2xl shadow-2xl border border-[#D3B48C] flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D3B48C]/30 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
            Gestión de Salón & Plano Digital • OSHUN
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Acomodo de Mesas & Salón Ficticio
          </h2>
          <p className="text-xs text-[#778F8C]">
            Tipo de Evento: <strong>{currentEventTypeConfig.label}</strong> • {currentEventTypeConfig.desc}
          </p>
        </div>

        {/* View Mode Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Button: Selector de Tipo de Evento */}
          <button
            onClick={handleOpenMainTableModal}
            className="px-3.5 py-2 rounded-full bg-white text-[#162E2D] border border-[#D3B48C]/60 text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#FAF6F0] transition-all"
            title="Cambiar tipo de evento (Boda, XV Años, Cumpleaños, Graduación, etc.) y configurar mesa principal"
          >
            <PartyPopper className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Tipo: {currentEventTypeConfig.label.split(' ')[1] || currentEventTypeConfig.label}</span>
          </button>

          {/* Dynamic Main Table Button */}
          <button
            onClick={handleOpenMainTableModal}
            className={`px-3.5 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
              hasMainTable
                ? 'bg-rose-50 border border-rose-300 text-rose-900 ring-1 ring-rose-300 hover:bg-rose-100'
                : 'bg-gradient-to-r from-[#D3B48C] to-[#EADBC6] text-[#0F2424] hover:scale-105 ring-1 ring-[#D3B48C]'
            }`}
            title="Configurar mesa principal, capacidad de personas y ubicación"
          >
            {eventType === 'boda' ? (
              <Heart className="h-3.5 w-3.5 text-rose-700 fill-rose-700" />
            ) : eventType === 'xv' ? (
              <Crown className="h-3.5 w-3.5 text-amber-600" />
            ) : (
              <Star className="h-3.5 w-3.5 text-amber-600" />
            )}
            <span>
              {eventType === 'boda'
                ? hasMainTable ? '💍 Mesa de Novios (2p) ✓' : '+ Mesa de Novios (2p)'
                : eventType === 'xv'
                ? hasMainTable ? `👑 Mesa de XVñera (${mainTable?.capacity || 8}p) ✓` : '+ Mesa de XVñera'
                : hasMainTable ? `⭐ Mesa Principal (${mainTable?.capacity || 6}p) ✓` : '+ Mesa Principal'}
            </span>
          </button>

          {/* Toggle View Mode */}
          <div className="flex items-center p-1 rounded-full bg-white border border-[#D3B48C]/50 shadow-sm">
            <button
              onClick={() => setViewMode('FLOOR_PLAN_2D')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'FLOOR_PLAN_2D'
                  ? 'bg-[#4E8281] text-white shadow'
                  : 'text-[#778F8C] hover:text-[#162E2D]'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Salón 2D</span>
            </button>

            <button
              onClick={() => setViewMode('CARDS')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'CARDS'
                  ? 'bg-[#4E8281] text-white shadow'
                  : 'text-[#778F8C] hover:text-[#162E2D]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Tarjetas</span>
            </button>
          </div>

          {/* Button: Personalizar Zonas */}
          <button
            onClick={() => setIsCustomZonesModalOpen(true)}
            className="px-3.5 py-2 rounded-full bg-white text-[#162E2D] border border-[#D3B48C]/50 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#FAF6F0]"
            title="Personalizar nombres, activar o desactivar zonas (pista, bar, jardín, postres, photobooth)"
          >
            <Settings2 className="h-3.5 w-3.5 text-[#4E8281]" />
            <span>Zonas del Salón</span>
          </button>

          {/* Button: Mover Pista, Bar, Jardín y Entrada */}
          <button
            onClick={() => {
              setIsEditLandmarksMode(!isEditLandmarksMode);
              showNotification(
                !isEditLandmarksMode
                  ? 'Modo Reubicar Zonas activado: Arrastra la pista, bar, jardín o entrada.'
                  : 'Modo de zonas guardado.'
              );
            }}
            className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-sm transition-all ${
              isEditLandmarksMode
                ? 'bg-[#D3B48C] text-[#0F2424] border-[#D3B48C] ring-2 ring-[#4E8281]'
                : 'bg-white text-[#162E2D] border-[#D3B48C]/50 hover:bg-[#FAF6F0]'
            }`}
            title="Mover libremente la pista de baile, bar, jardín y entrada"
          >
            <Move className="h-3.5 w-3.5 text-[#4E8281]" />
            <span>{isEditLandmarksMode ? '✓ Guardar Zonas' : '🏗️ Mover Zonas'}</span>
          </button>

          <button
            onClick={() => setIsHostessModalOpen(true)}
            className="px-3.5 py-2 rounded-full bg-white text-[#162E2D] border border-[#D3B48C]/50 text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#FAF6F0]"
          >
            <Users className="h-3.5 w-3.5 text-[#4E8281]" />
            <span>Hostess</span>
          </button>

          <button
            onClick={handleAutoAssign}
            className="px-3.5 py-2 rounded-full bg-[#EADBC6]/60 hover:bg-[#D3B48C]/40 text-[#162E2D] text-xs font-bold flex items-center gap-1.5 border border-[#D3B48C] shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Auto-Acomodo</span>
          </button>

          <button
            onClick={() => handleOpenCreateTable()}
            className="btn-oshun-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Mesa</span>
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#D3B48C]/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#778F8C]">Capacidad Salón</span>
            <Armchair className="h-4 w-4 text-[#4E8281]" />
          </div>
          <p className="text-2xl font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
            {totalChairsCapacity} <span className="text-xs font-normal text-[#778F8C]">sillas</span>
          </p>
          <span className="text-[10px] text-[#778F8C] block">{tables.length} mesas en el salón</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D3B48C]/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#778F8C]">Lugares Asignados</span>
            <UserCheck className="h-4 w-4 text-[#4E8281]" />
          </div>
          <p className="text-2xl font-bold text-[#4E8281]" style={{ fontFamily: 'Cinzel, serif' }}>
            {seatedHeadcount} <span className="text-xs font-normal text-[#778F8C]">personas</span>
          </p>
          <span className="text-[10px] text-[#778F8C] block">{occupancyPercentage}% de ocupación</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D3B48C]/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#778F8C]">Sillas Libres</span>
            <LayoutGrid className="h-4 w-4 text-[#D3B48C]" />
          </div>
          <p className="text-2xl font-bold text-[#D3B48C]" style={{ fontFamily: 'Cinzel, serif' }}>
            {availableSeats} <span className="text-xs font-normal text-[#778F8C]">disponibles</span>
          </p>
          <span className="text-[10px] text-[#778F8C] block">Para nuevos confirmados</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D3B48C]/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#778F8C]">Confirmados Sin Mesa</span>
            <AlertCircle className={`h-4 w-4 ${unassignedConfirmedGuests.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
          </div>
          <p className="text-2xl font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
            {unassignedConfirmedGuests.length} <span className="text-xs font-normal text-[#778F8C]">familias</span>
          </p>
          <span className="text-[10px] text-[#778F8C] block">
            {unassignedConfirmedGuests.length === 0 ? '✓ Todos los confirmados tienen mesa' : 'Arrastra o asigna'}
          </span>
        </div>
      </div>

      {/* WORKSPACE: SALÓN FICTICIO 2D + PANEL DE INVITADOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Floor Plan Canvas */}
        <div className="lg:col-span-8 space-y-4">
          
          {viewMode === 'FLOOR_PLAN_2D' ? (
            <div className="space-y-3">
              {/* Floor Controls Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-[#D3B48C]/40 shadow-sm text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#162E2D] font-serif flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-[#4E8281]" />
                    <span>Salón de Recepción Interactivo</span>
                  </span>
                  {isEditLandmarksMode ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-bold text-[10px] animate-pulse">
                      🏗️ Arrastra la pista, bar, jardín o entrada para reubicarlos
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#778F8C]">
                      (💡 Haz <strong>doble clic</strong> en una mesa para ver o cambiar sus invitados)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetFloorPlan}
                    className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EFE3D4] text-[#162E2D] border border-[#D3B48C]/40"
                    title="Reiniciar posiciones"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenCreateTable()}
                    className="px-3 py-1.5 rounded-full bg-[#4E8281] text-white text-[11px] font-bold flex items-center gap-1 shadow"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Añadir Mesa</span>
                  </button>
                </div>
              </div>

              {/* INTERACTIVE SALON FLOOR CANVAS */}
              <div
                ref={floorPlanRef}
                onClick={(e) => {
                  if (justFinishedDragRef.current) return;
                  // Si hay una mesa seleccionada y se hace clic en el fondo del salón, mover la mesa directamente allí
                  if (selectedTableId && floorPlanRef.current) {
                    const rect = floorPlanRef.current.getBoundingClientRect();
                    const clickX = Math.max(4, Math.min(96, Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(2))));
                    const clickY = Math.max(4, Math.min(96, Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(2))));
                    
                    InvitaStore.updateTablePosition(event.id, selectedTableId, clickX, clickY);
                    setTables((prev) => prev.map((t) => (t.id === selectedTableId ? { ...t, posX: clickX, posY: clickY } : t)));
                    const selTable = tables.find((t) => t.id === selectedTableId);
                    showNotification(`Mesa "${selTable?.name || selectedTableId}" colocada en (${Math.round(clickX)}%, ${Math.round(clickY)}%).`);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                className="w-full h-[640px] rounded-3xl bg-[#FAF6F0] border-2 border-[#D3B48C] shadow-inner relative select-none bg-[radial-gradient(#D3B48C_0.8px,transparent_0.8px)] [background-size:24px_24px] cursor-crosshair"
              >
                {/* 1. CUSTOMIZABLE ARCHITECTURAL LANDMARKS (Pista, Bar, Jardín, Entrada, Postres, etc.) */}
                {activeLandmarks.map((lm) => (
                  <div
                    key={lm.id}
                    onMouseDown={(e) => {
                      if (!isEditLandmarksMode || e.button !== 0) return;
                      e.stopPropagation();
                      activeDragRef.current = {
                        type: 'landmark',
                        id: lm.id,
                        startClientX: e.clientX,
                        startClientY: e.clientY,
                        startPosX: lm.x,
                        startPosY: lm.y,
                        currentX: lm.x,
                        currentY: lm.y,
                        hasMoved: false,
                      };
                    }}
                    style={{
                      left: `${lm.x}%`,
                      top: `${lm.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute text-center shadow-sm z-0 select-none ${lm.className} ${
                      isEditLandmarksMode
                        ? 'cursor-grab active:cursor-grabbing ring-2 ring-[#4E8281] scale-105 shadow-xl animate-pulse z-40'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isEditLandmarksMode && <Move className="h-3 w-3 text-[#4E8281]" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest font-cinzel block">
                        {lm.title}
                      </span>
                    </div>
                    <span className="text-[8px] text-[#778F8C] block mt-0.5">{lm.subtitle}</span>
                  </div>
                ))}

                {/* 2. RENDER INTERACTIVE TABLE PODS */}
                {tables.map((table) => {
                  const tableOccupants = getTableOccupancy(table);
                  const isFull = tableOccupants >= table.capacity;
                  const isSelected = selectedTableId === table.id;
                  const isHovered = hoveredTableId === table.id;
                  
                  const isHonorTable =
                    table.shape === 'HONOR' ||
                    table.name.toLowerCase().includes('novio') ||
                    table.name.toLowerCase().includes('quinceañera') ||
                    table.name.toLowerCase().includes('xv') ||
                    table.name.toLowerCase().includes('principal') ||
                    table.name.toLowerCase().includes('festejado');

                  const isSweetheartWedding = eventType === 'boda' && isHonorTable;
                  const isQuinceTable = eventType === 'xv' && isHonorTable;

                  const posX = table.posX ?? 50;
                  const posY = table.posY ?? 50;

                  return (
                    <div
                      key={table.id}
                      onMouseDown={(e) => {
                        if (isEditLandmarksMode || e.button !== 0) return;
                        e.stopPropagation();
                        setSelectedTableId(table.id);
                        activeDragRef.current = {
                          type: 'table',
                          id: table.id,
                          startClientX: e.clientX,
                          startClientY: e.clientY,
                          startPosX: posX,
                          startPosY: posY,
                          currentX: posX,
                          currentY: posY,
                          hasMoved: false,
                        };
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setHoveredTableId(table.id);
                      }}
                      onDragLeave={() => setHoveredTableId(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropOnTable(table.id);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTableId(table.id);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleTableDoubleClick(table);
                      }}
                      onMouseEnter={() => setHoveredTableId(table.id)}
                      style={{
                        left: `${posX}%`,
                        top: `${posY}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`absolute cursor-grab active:cursor-grabbing group select-none ${
                        isSelected ? 'scale-110 z-30 ring-4 ring-[#4E8281] rounded-full' : isHovered ? 'z-50' : 'hover:scale-105 z-10'
                      }`}
                    >
                      {/* CHAIR DOTS AROUND THE TABLE */}
                      <div className="relative flex items-center justify-center">
                        {isSweetheartWedding ? (
                          /* EXACTAMENTE 2 SILLAS PARA BODA (NOVIA Y NOVIO) */
                          [
                            { cx: -28, cy: 0, label: 'Novia' },
                            { cx: 28, cy: 0, label: 'Novio' },
                          ].map((chair, chairIdx) => {
                            const isChairOccupied = chairIdx < tableOccupants;
                            return (
                              <div
                                key={chairIdx}
                                style={{
                                  transform: `translate(${chair.cx}px, ${chair.cy}px)`,
                                }}
                                className={`absolute h-4 w-4 rounded-full border shadow-sm transition-colors ${
                                  isChairOccupied
                                    ? 'bg-rose-600 border-rose-900 ring-1 ring-white'
                                    : 'bg-white border-[#D3B48C]'
                                }`}
                                title={`Lugar de ${chair.label} (${isChairOccupied ? 'Ocupado' : 'Libre'})`}
                              />
                            );
                          })
                        ) : (
                          /* SILLAS DISTRIBUIDAS (PARA XV AÑOS, CUMPLEAÑOS, O MESAS DE BANQUETE) */
                          Array.from({ length: table.capacity }).map((_, chairIdx) => {
                            const angle = (chairIdx / table.capacity) * (2 * Math.PI);
                            const radius = table.capacity <= 2 ? 30 : table.capacity > 10 ? 46 : 40;
                            const cx = Math.cos(angle) * radius;
                            const cy = Math.sin(angle) * radius;
                            const isChairOccupied = chairIdx < tableOccupants;

                            return (
                              <div
                                key={chairIdx}
                                style={{
                                  transform: `translate(${cx}px, ${cy}px)`,
                                }}
                                className={`absolute ${isHonorTable ? 'h-4 w-4' : 'h-3.5 w-3.5'} rounded-full border shadow-xs transition-colors ${
                                  isHonorTable
                                    ? isChairOccupied ? 'bg-amber-600 border-amber-900' : 'bg-white border-[#D3B48C]'
                                    : isChairOccupied ? 'bg-[#4E8281] border-[#162E2D]' : 'bg-white border-[#D3B48C] hover:bg-emerald-200'
                                }`}
                                title={`Silla ${chairIdx + 1} (${isChairOccupied ? 'Ocupada' : 'Libre'})`}
                              />
                            );
                          })
                        )}

                        {/* TABLE CENTER DISK */}
                        <div
                          className={`rounded-full flex flex-col items-center justify-center p-1.5 text-center shadow-xl border-2 transition-all ${
                            isSweetheartWedding
                              ? 'h-20 w-20 bg-gradient-to-b from-[#FAF6F0] to-[#EFE3D4] border-[#D3B48C] ring-2 ring-[#D3B48C]'
                              : isQuinceTable
                              ? 'h-22 w-22 bg-gradient-to-b from-rose-50 to-[#FAF6F0] border-rose-300 ring-2 ring-rose-400'
                              : isHonorTable
                              ? 'h-22 w-22 bg-[#EFE3D4] border-[#D3B48C] text-[#0F2424]'
                              : isHovered
                              ? 'h-22 w-22 ring-4 ring-emerald-500 bg-emerald-50 border-emerald-600 scale-105'
                              : isSelected
                              ? 'h-22 w-22 ring-4 ring-[#4E8281] border-[#4E8281] bg-white'
                              : isFull
                              ? 'h-22 w-22 bg-emerald-50 border-emerald-600 text-emerald-900'
                              : 'h-22 w-22 bg-white border-[#D3B48C] text-[#162E2D]'
                          }`}
                        >
                          {isSweetheartWedding ? (
                            <div className="flex flex-col items-center">
                              <Heart className="h-3.5 w-3.5 text-rose-600 fill-rose-600 animate-pulse" />
                              <span className="text-[8px] font-extrabold text-[#0F2424] font-cinzel leading-tight mt-0.5">
                                NOVIOS
                              </span>
                              <span className="text-[8px] font-mono font-bold text-[#4E8281]">
                                {tableOccupants}/2
                              </span>
                            </div>
                          ) : isQuinceTable ? (
                            <div className="flex flex-col items-center">
                              <Crown className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
                              <span className="text-[8px] font-extrabold text-[#0F2424] font-cinzel leading-tight mt-0.5">
                                XV AÑOS
                              </span>
                              <span className="text-[8px] font-mono font-bold text-[#4E8281]">
                                {tableOccupants}/{table.capacity}
                              </span>
                            </div>
                          ) : isHonorTable ? (
                            <div className="flex flex-col items-center">
                              <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-400" />
                              <span className="text-[8px] font-extrabold text-[#0F2424] font-cinzel leading-tight mt-0.5 truncate max-w-[65px]">
                                PRINCIPAL
                              </span>
                              <span className="text-[8px] font-mono font-bold text-[#4E8281]">
                                {tableOccupants}/{table.capacity}
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className="text-[10px] font-extrabold uppercase font-cinzel leading-none">
                                #{table.tableNumber}
                              </span>
                              <span className="text-[8px] font-bold text-[#4E8281] truncate max-w-[68px] block mt-0.5">
                                {table.name.replace(/Mesa \d+ —? ?/, '') || `Mesa ${table.tableNumber}`}
                              </span>
                              <span
                                className={`text-[9px] font-mono font-bold mt-0.5 px-1.5 py-0.2 rounded-full ${
                                  isFull ? 'bg-emerald-600 text-white' : 'bg-[#FAF6F0] text-[#778F8C]'
                                }`}
                              >
                                {tableOccupants}/{table.capacity}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* SMART HOVER CARD */}
                      <div
                        className={`opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity absolute w-64 p-3 rounded-2xl bg-[#0F2424] text-white shadow-2xl border border-[#D3B48C] text-xs z-[70] space-y-1.5 animate-in fade-in zoom-in-95 ${
                          posY < 35 ? 'top-26' : '-top-40'
                        } ${
                          posX < 26 ? 'left-0 translate-x-0' : posX > 74 ? 'right-0 translate-x-0' : 'left-1/2 -translate-x-1/2'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-white/20 pb-1">
                          <span className="font-bold text-[#D3B48C] font-serif truncate">
                            {isSweetheartWedding
                              ? '💍 Mesa de Novios'
                              : isQuinceTable
                              ? '👑 Mesa de Quinceañera'
                              : isHonorTable
                              ? `⭐ ${table.name}`
                              : `#${table.tableNumber} ${table.name}`}
                          </span>
                          <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.2 rounded text-white">
                            {tableOccupants}/{table.capacity}
                          </span>
                        </div>

                        <div className="max-h-24 overflow-y-auto space-y-1 text-[11px] pr-1">
                          {table.assignedGuestIds.length === 0 ? (
                            <p className="text-slate-400 italic text-[10px]">Mesa libre (0 invitados)</p>
                          ) : (
                            table.assignedGuestIds.map((gId) => {
                              const g = guests.find((x) => x.id === gId);
                              if (!g) return null;
                              const splitRec = table.assignedSplits?.find((s) => s.guestId === gId);
                              const passCount = splitRec ? splitRec.count : g.confirmedCompanions || g.allowedCompanions || 1;
                              return (
                                <div key={g.id} className="flex items-center justify-between text-slate-200">
                                  <span className="truncate max-w-[140px] block">
                                    • {splitRec ? splitRec.nameLabel : g.name}
                                  </span>
                                  <span className="text-[9px] font-bold text-[#D3B48C] shrink-0">
                                    {passCount} {passCount > 1 ? 'pases' : 'pase'}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>

                        <div className="pt-1 text-[9px] text-[#D3B48C] flex items-center justify-between border-t border-white/10">
                          <span>🖱️ Doble clic para gestionar</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTableDoubleClick(table);
                            }}
                            className="text-white hover:underline font-bold"
                          >
                            Abrir →
                          </button>
                        </div>
                      </div>

                      {/* QUICK BOTTOM STEPPER TOOLBAR */}
                      <div
                        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute flex items-center gap-1 bg-[#0F2424] text-white p-1 rounded-full shadow-xl text-[9px] whitespace-nowrap z-40 ${
                          posY < 35 ? '-top-7 left-1/2 -translate-x-1/2' : '-bottom-7 left-1/2 -translate-x-1/2'
                        }`}
                      >
                        {isSweetheartWedding ? (
                          <span className="font-bold text-[#D3B48C] px-2.5 py-0.5 text-[10px]">
                            💍 2 Lugares Exclusivos (Novios)
                          </span>
                        ) : isHonorTable ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdjustTableCapacity(table.id, -1);
                              }}
                              className="px-1.5 py-0.5 rounded hover:bg-white/20 font-bold"
                              title="Reducir 1 silla"
                            >
                              -1
                            </button>
                            <span className="font-bold text-[#D3B48C] px-1">
                              {eventType === 'xv' ? '👑' : '⭐'} {table.capacity} sillas
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdjustTableCapacity(table.id, 1);
                              }}
                              className="px-1.5 py-0.5 rounded hover:bg-white/20 font-bold"
                              title="Añadir 1 silla"
                            >
                              +1
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdjustTableCapacity(table.id, -1);
                              }}
                              className="px-1.5 py-0.5 rounded hover:bg-white/20 font-bold"
                              title="Reducir 1 silla"
                            >
                              -1
                            </button>
                            <span className="font-bold text-[#D3B48C]">{table.capacity} sillas</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdjustTableCapacity(table.id, 1);
                              }}
                              className="px-1.5 py-0.5 rounded hover:bg-white/20 font-bold"
                              title="Añadir 1 silla"
                            >
                              +1
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SELECTED TABLE INSPECTOR CARD */}
              {selectedTable && (
                <div className="p-4 rounded-3xl bg-white border border-[#D3B48C]/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4E8281] text-white">
                        Mesa #{selectedTable.tableNumber}
                      </span>
                      <h4 className="text-sm font-bold text-[#162E2D] font-serif">{selectedTable.name}</h4>
                      <span className="text-xs text-[#778F8C]">({selectedTable.zone || 'Salón Principal'})</span>
                    </div>
                    <p className="text-xs text-[#778F8C]">
                      Ocupación: <strong>{getTableOccupancy(selectedTable)} de {selectedTable.capacity} sillas</strong> •{' '}
                      Posición: ({Math.round(selectedTable.posX ?? 50)}%, {Math.round(selectedTable.posY ?? 50)}%)
                    </p>
                  </div>

                  {/* Tactile Directional Nudge Pad & Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-2xl border border-[#D3B48C]/40">
                      <span className="text-[10px] font-bold text-[#778F8C] px-1 hidden sm:inline">Mover:</span>
                      <button
                        onClick={() => {
                          const newX = Math.max(4, Math.min(96, Number(((selectedTable.posX ?? 50) - 4).toFixed(2))));
                          const newY = selectedTable.posY ?? 50;
                          InvitaStore.updateTablePosition(event.id, selectedTable.id, newX, newY);
                          setTables((prev) => prev.map((t) => (t.id === selectedTable.id ? { ...t, posX: newX } : t)));
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-[#EFE3D4] border border-[#D3B48C]/30 text-[#162E2D] text-xs font-bold shadow-xs"
                        title="Mover a la izquierda"
                      >
                        ⬅️
                      </button>
                      <button
                        onClick={() => {
                          const newX = selectedTable.posX ?? 50;
                          const newY = Math.max(4, Math.min(96, Number(((selectedTable.posY ?? 50) - 4).toFixed(2))));
                          InvitaStore.updateTablePosition(event.id, selectedTable.id, newX, newY);
                          setTables((prev) => prev.map((t) => (t.id === selectedTable.id ? { ...t, posY: newY } : t)));
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-[#EFE3D4] border border-[#D3B48C]/30 text-[#162E2D] text-xs font-bold shadow-xs"
                        title="Mover hacia arriba"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => {
                          const newX = selectedTable.posX ?? 50;
                          const newY = Math.max(4, Math.min(96, Number(((selectedTable.posY ?? 50) + 4).toFixed(2))));
                          InvitaStore.updateTablePosition(event.id, selectedTable.id, newX, newY);
                          setTables((prev) => prev.map((t) => (t.id === selectedTable.id ? { ...t, posY: newY } : t)));
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-[#EFE3D4] border border-[#D3B48C]/30 text-[#162E2D] text-xs font-bold shadow-xs"
                        title="Mover hacia abajo"
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => {
                          const newX = Math.max(4, Math.min(96, Number(((selectedTable.posX ?? 50) + 4).toFixed(2))));
                          const newY = selectedTable.posY ?? 50;
                          InvitaStore.updateTablePosition(event.id, selectedTable.id, newX, newY);
                          setTables((prev) => prev.map((t) => (t.id === selectedTable.id ? { ...t, posX: newX } : t)));
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-[#EFE3D4] border border-[#D3B48C]/30 text-[#162E2D] text-xs font-bold shadow-xs"
                        title="Mover a la derecha"
                      >
                        ➡️
                      </button>
                    </div>

                    <button
                      onClick={() => handleTableDoubleClick(selectedTable)}
                      className="px-4 py-1.5 rounded-full bg-[#4E8281] text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Invitados</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditTable(selectedTable)}
                      className="p-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-[#162E2D] hover:bg-[#EFE3D4]"
                      title="Editar Mesa"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteTable(selectedTable.id, selectedTable.name)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                      title="Eliminar Mesa"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TRADITIONAL CARDS VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTables.map((table) => {
                const tableOccupants = getTableOccupancy(table);
                const isFull = tableOccupants >= table.capacity;
                const isHonor =
                  table.shape === 'HONOR' ||
                  table.name.toLowerCase().includes('novio') ||
                  table.name.toLowerCase().includes('quinceañera') ||
                  table.name.toLowerCase().includes('principal');
                const percent = Math.min(100, Math.round((tableOccupants / table.capacity) * 100));

                return (
                  <div
                    key={table.id}
                    onDoubleClick={() => handleTableDoubleClick(table)}
                    className={`rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-sm hover:shadow-lg cursor-pointer ${
                      isHonor
                        ? 'bg-gradient-to-b from-[#FAF6F0] to-[#EFE3D4] border-[#D3B48C] ring-2 ring-[#D3B48C]'
                        : 'bg-white border-[#D3B48C]/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                              isHonor
                                ? 'bg-[#D3B48C] text-[#0F2424]'
                                : 'bg-[#4E8281] text-white'
                            }`}
                          >
                            {isHonor ? (eventType === 'boda' ? '💍' : eventType === 'xv' ? '👑' : '⭐') : `#${table.tableNumber}`}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#162E2D] font-serif leading-tight">{table.name}</h4>
                            <span className="text-[9px] text-[#778F8C] block">{table.zone || 'Salón Principal'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditTable(table);
                            }}
                            className="p-1.5 rounded-lg text-[#778F8C] hover:text-[#4E8281] hover:bg-[#FAF6F0]"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTable(table.id, table.name);
                            }}
                            className="p-1.5 rounded-lg text-[#778F8C] hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#778F8C]">Ocupación:</span>
                          <span className={`font-bold ${isFull ? 'text-emerald-700' : 'text-[#4E8281]'}`}>
                            {tableOccupants} / {table.capacity} sillas {isFull ? '(Completa)' : ''}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#FAF6F0] rounded-full overflow-hidden border border-[#D3B48C]/20">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isFull ? 'bg-emerald-500' : 'bg-[#4E8281]'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="my-4 space-y-2 max-h-48 overflow-y-auto pr-1">
                      {table.assignedGuestIds.length === 0 ? (
                        <div className="py-4 text-center text-xs text-[#778F8C] bg-[#FAF6F0] rounded-2xl border border-dashed border-[#D3B48C]/40">
                          <p>Mesa disponible (0 asignados)</p>
                        </div>
                      ) : (
                        table.assignedGuestIds.map((gId) => {
                          const guest = guests.find((x) => x.id === gId);
                          if (!guest) return null;
                          const splitRecord = table.assignedSplits?.find((s) => s.guestId === gId);
                          const seatCount = splitRecord ? splitRecord.count : guest.confirmedCompanions || guest.allowedCompanions || 1;

                          return (
                            <div
                              key={guest.id}
                              className="p-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30 flex items-center justify-between text-xs group"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[#162E2D] truncate block">
                                    {splitRecord ? splitRecord.nameLabel : guest.name}
                                  </span>
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-[#4E8281] border border-[#D3B48C]/30 shrink-0">
                                    {seatCount} {seatCount > 1 ? 'pases' : 'pase'}
                                  </span>
                                </div>
                                {splitRecord && (
                                  <span className="text-[9px] text-[#4E8281] font-semibold block">
                                    ✂️ Grupo dividido
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveGuest(guest.id, table.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-100 text-rose-600 transition-opacity ml-1"
                                title="Remover de esta mesa"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTableDoubleClick(table);
                      }}
                      className="w-full py-2 rounded-full text-xs font-bold bg-[#4E8281]/10 hover:bg-[#4E8281] text-[#4E8281] hover:text-white border border-[#4E8281]/30 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Gestionar Invitados de Mesa</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column (4 cols): Panel de Invitados Confirmados & Separador de Familias */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <div className="rounded-3xl bg-white border border-[#D3B48C]/50 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#D3B48C]/30 pb-3">
              <div>
                <h3 className="text-xs font-bold text-[#162E2D] uppercase tracking-wider font-serif">
                  Invitados por Acomodar
                </h3>
                <p className="text-[10px] text-[#778F8C]">
                  Arrastra a una mesa o usa ✂️ para separar
                </p>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800">
                {unassignedConfirmedGuests.length} pendientes
              </span>
            </div>

            {/* Draggable Guests List */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {unassignedConfirmedGuests.length === 0 ? (
                <div className="py-8 text-center space-y-2 bg-[#FAF6F0] rounded-2xl border border-dashed border-[#D3B48C]/40 p-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                  <h4 className="text-xs font-bold text-[#162E2D]">¡Salón 100% Organizado!</h4>
                  <p className="text-[11px] text-[#778F8C]">
                    Todos los invitados confirmados están sentados en su mesa.
                  </p>
                </div>
              ) : (
                unassignedConfirmedGuests.map((guest) => {
                  const passCount = guest.confirmedCompanions || guest.allowedCompanions || 1;
                  const canSplit = passCount > 1;

                  return (
                    <div
                      key={guest.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggingGuestId(guest.id);
                        e.dataTransfer.setData('guestId', guest.id);
                      }}
                      className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 shadow-sm space-y-2 cursor-grab active:cursor-grabbing hover:border-[#4E8281] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-[#162E2D] block truncate">
                            {guest.name}
                          </span>
                          <span className="text-[10px] text-[#778F8C] block">
                            {guest.group} • <strong>{passCount} {passCount > 1 ? 'pases' : 'pase'}</strong>
                          </span>
                        </div>

                        {/* Split Family Action Button */}
                        {canSplit && (
                          <button
                            onClick={() => handleOpenSplitModal(guest)}
                            className="px-2 py-1 rounded-lg bg-white border border-[#D3B48C]/50 text-[#4E8281] hover:bg-[#4E8281] hover:text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                            title="Dividir pases de esta familia en mesas diferentes"
                          >
                            <Scissors className="h-3 w-3" />
                            <span>Separar</span>
                          </button>
                        )}
                      </div>

                      {/* Quick Dropdown Selector */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-[#D3B48C]/20">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignGuest(guest.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className="w-full text-[11px] rounded-xl bg-white border border-[#D3B48C]/50 px-2.5 py-1.5 text-[#162E2D] outline-none"
                        >
                          <option value="" disabled>
                            Mover a mesa...
                          </option>
                          {tables.map((tbl) => {
                            const occ = getTableOccupancy(tbl);
                            const isFull = occ >= tbl.capacity;
                            return (
                              <option key={tbl.id} value={tbl.id} disabled={isFull}>
                                #{tbl.tableNumber} - {tbl.name} ({occ}/{tbl.capacity}) {isFull ? '🔴 Llena' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: CONFIGURAR TIPO DE EVENTO & MESA PRINCIPAL */}
      <Modal
        isOpen={isMainTableModalOpen}
        onClose={() => setIsMainTableModalOpen(false)}
        title="Tipo de Evento & Mesa Principal"
        subtitle="Configura si tu evento lleva mesa de honor y cuántas personas la integran"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveMainTableConfig} className="space-y-5 text-xs">
          {/* Step 1: Select Event Type */}
          <div>
            <label className="block font-bold text-[#162E2D] mb-2 text-xs">
              1. Selecciona el Tipo de Evento:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EVENT_TYPE_OPTIONS.map((opt) => {
                const isSelected = modalEventType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setModalEventType(opt.id);
                      setModalMainTableCapacity(opt.defaultCapacity);
                      setModalMainTableName(opt.mainTableName);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#4E8281] text-white border-[#4E8281] shadow-md ring-2 ring-[#4E8281]'
                        : 'bg-white text-[#162E2D] border-[#D3B48C]/40 hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <span className="text-sm font-bold block">{opt.label}</span>
                    <span className={`text-[10px] mt-1 block leading-tight ${isSelected ? 'text-white/80' : 'text-[#778F8C]'}`}>
                      {opt.id === 'boda'
                        ? 'Mesa de Novios (2p fija)'
                        : opt.id === 'xv'
                        ? 'Mesa de XVñera (editable)'
                        : 'Mesa de Honor (editable)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Main Table Toggle & Capacity Questions */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/50 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D3B48C]/30 pb-3">
              <div>
                <h4 className="font-bold text-[#162E2D] text-xs font-serif">
                  {modalEventType === 'boda'
                    ? '💍 Mesa de Novios (Sweetheart)'
                    : modalEventType === 'xv'
                    ? '👑 Mesa de Quinceañera (XV Años)'
                    : '⭐ Mesa Principal / de Honor'}
                </h4>
                <p className="text-[11px] text-[#778F8C]">
                  {modalEventType === 'boda'
                    ? 'En bodas, la mesa principal es exclusivamente para los 2 Novios.'
                    : 'Indica si tu evento llevará mesa de honor y cuántas personas se sentarán en ella.'}
                </p>
              </div>

              {modalEventType !== 'boda' && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#162E2D]">
                    {modalIncludeMainTable ? 'Sí lleva' : 'No lleva'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalIncludeMainTable(!modalIncludeMainTable)}
                  >
                    {modalIncludeMainTable ? (
                      <ToggleRight className="h-6 w-6 text-[#4E8281]" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-slate-400" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Questions about Number of Persons */}
            {modalIncludeMainTable && (
              <div className="space-y-3 pt-1">
                {modalEventType === 'boda' ? (
                  <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center gap-3">
                    <Heart className="h-6 w-6 text-rose-600 fill-rose-600 shrink-0" />
                    <div>
                      <span className="font-bold text-[#162E2D] block">Capacidad Fija: 2 Personas (Novia & Novio)</span>
                      <p className="text-[10px] text-[#778F8C]">
                        Por protocolo de boda tradicional, la Mesa de Novios cuenta con exactamente 2 sillas presidenciales.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#162E2D] mb-1 text-[11px]">
                          Nombre de la Mesa Principal
                        </label>
                        <input
                          type="text"
                          required
                          value={modalMainTableName}
                          onChange={(e) => setModalMainTableName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#D3B48C]/50 text-xs font-semibold text-[#162E2D] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#162E2D] mb-1 text-[11px]">
                          ¿Cuántas personas van en la Mesa Principal? *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={24}
                          required
                          value={modalMainTableCapacity}
                          onChange={(e) => setModalMainTableCapacity(parseInt(e.target.value, 10) || 1)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#D3B48C]/50 text-xs font-bold text-[#4E8281] outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Suggestions for XV and others */}
                    <div>
                      <span className="text-[10px] font-bold text-[#778F8C] block mb-1">
                        Sugerencias Rápidas de Capacidad:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {modalEventType === 'xv' ? (
                          [
                            { cap: 1, label: '1 persona (Quinceañera sola en trono)' },
                            { cap: 2, label: '2 personas (Con acompañante)' },
                            { cap: 4, label: '4 personas (Con padres)' },
                            { cap: 6, label: '6 personas (Con chambelán y padres)' },
                            { cap: 8, label: '8 personas (Corte de Honor)' },
                            { cap: 12, label: '12 personas (Todos los Chambelanes)' },
                            { cap: 14, label: '14 personas (Corte Completa)' },
                          ].map((sug) => (
                            <button
                              key={sug.cap}
                              type="button"
                              onClick={() => setModalMainTableCapacity(sug.cap)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                modalMainTableCapacity === sug.cap
                                  ? 'bg-[#4E8281] text-white border-[#4E8281]'
                                  : 'bg-white text-[#162E2D] border-[#D3B48C]/40 hover:bg-[#FAF6F0]'
                              }`}
                            >
                              {sug.label}
                            </button>
                          ))
                        ) : (
                          [
                            { cap: 2, label: '2 personas' },
                            { cap: 4, label: '4 personas' },
                            { cap: 6, label: '6 personas' },
                            { cap: 8, label: '8 personas' },
                            { cap: 10, label: '10 personas' },
                            { cap: 12, label: '12 personas' },
                          ].map((sug) => (
                            <button
                              key={sug.cap}
                              type="button"
                              onClick={() => setModalMainTableCapacity(sug.cap)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                modalMainTableCapacity === sug.cap
                                  ? 'bg-[#4E8281] text-white border-[#4E8281]'
                                  : 'bg-white text-[#162E2D] border-[#D3B48C]/40 hover:bg-[#FAF6F0]'
                              }`}
                            >
                              {sug.label}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setIsMainTableModalOpen(false)}
              className="px-4 py-2 rounded-full bg-[#EFE3D4] text-[#162E2D] font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-oshun-primary px-6 py-2 uppercase font-bold tracking-wider text-xs"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: PERSONALIZAR ZONAS DEL SALÓN (PISTA, BAR, JARDÍN, ENTRADA, POSTRES, ETC.) */}
      <Modal
        isOpen={isCustomZonesModalOpen}
        onClose={() => setIsCustomZonesModalOpen(false)}
        title="Personalizar Zonas del Salón"
        subtitle="Activa, desactiva o renombra las áreas arquitectónicas de tu evento"
        maxWidth="lg"
      >
        <div className="space-y-5 text-xs">
          <p className="text-[#778F8C] leading-relaxed">
            Puedes cambiar los nombres de las zonas arquitectónicas para adaptarlas a tu espacio (ej. cambiar <em>Terraza Jardín</em> por <em>Zona de Alberca</em>) o activar áreas adicionales como la <em>Mesa de Postres</em> o <em>Photobooth</em>.
          </p>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {landmarks.map((lm) => (
              <div
                key={lm.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                  lm.enabled ? 'bg-white border-[#D3B48C]/50 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleLandmark(lm.id)}
                      className="text-lg"
                    >
                      {lm.enabled ? (
                        <ToggleRight className="h-6 w-6 text-[#4E8281]" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-slate-400" />
                      )}
                    </button>
                    <span className="font-bold text-[#162E2D] text-xs font-serif">
                      {lm.title}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lm.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {lm.enabled ? 'Activa en Plano' : 'Oculta'}
                  </span>
                </div>

                {lm.enabled && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#D3B48C]/20">
                    <div>
                      <label className="block text-[10px] font-bold text-[#778F8C] mb-0.5">Nombre / Título</label>
                      <input
                        type="text"
                        value={lm.title}
                        onChange={(e) => handleUpdateLandmarkText(lm.id, e.target.value, lm.subtitle)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-xs text-[#162E2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#778F8C] mb-0.5">Subtítulo descriptivo</label>
                      <input
                        type="text"
                        value={lm.subtitle}
                        onChange={(e) => handleUpdateLandmarkText(lm.id, lm.title, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-xs text-[#162E2D]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Custom Zone Form */}
          <form onSubmit={handleAddCustomZone} className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-2">
            <span className="font-bold text-xs text-[#162E2D] block">+ Agregar Nueva Área Personalizada</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newZoneTitle}
                onChange={(e) => setNewZoneTitle(e.target.value)}
                placeholder="Ej. 🎶 Escenario Mariachi / Banda"
                className="px-3 py-2 rounded-xl bg-white border border-[#D3B48C]/50 text-xs outline-none"
              />
              <input
                type="text"
                value={newZoneSubtitle}
                onChange={(e) => setNewZoneSubtitle(e.target.value)}
                placeholder="Ej. Frente a Pista"
                className="px-3 py-2 rounded-xl bg-white border border-[#D3B48C]/50 text-xs outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-[#4E8281] text-white font-bold text-xs shadow hover:bg-[#3E6D6C]"
            >
              Añadir Zona al Salón
            </button>
          </form>

          <div className="flex justify-end pt-2 border-t border-[#D3B48C]/30">
            <button
              onClick={() => setIsCustomZonesModalOpen(false)}
              className="btn-oshun-primary px-6 py-2 uppercase font-bold tracking-wider"
            >
              Guardar y Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL: GESTIÓN DETALLADA DE INVITADOS EN MESA (DOBLE CLIC) */}
      <Modal
        isOpen={isTableGuestsModalOpen}
        onClose={() => setIsTableGuestsModalOpen(false)}
        title={activeTableForGuests ? `Invitados en ${activeTableForGuests.name}` : 'Gestión de Mesa'}
        subtitle={`Capacidad: ${activeTableForGuests ? getTableOccupancy(activeTableForGuests) : 0} / ${activeTableForGuests?.capacity || 10} sillas`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#D3B48C]/40 flex items-center justify-between">
            <span className="font-bold text-[#162E2D]">
              Zona: {activeTableForGuests?.zone || 'Salón Principal'} • {activeTableForGuests?.capacity} sillas configuradas
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4E8281] text-white">
              {activeTableForGuests ? getTableOccupancy(activeTableForGuests) : 0} asientos ocupados
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            <h4 className="text-[11px] font-bold text-[#778F8C] uppercase tracking-wider font-cinzel">
              Personas y Familias Sentadas en Esta Mesa
            </h4>

            {activeTableForGuests?.assignedGuestIds.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-[#FAF6F0] rounded-2xl border border-dashed border-[#D3B48C]/40">
                <p>No hay invitados asignados a esta mesa actualmente.</p>
              </div>
            ) : (
              activeTableForGuests?.assignedGuestIds.map((gId) => {
                const guest = guests.find((x) => x.id === gId);
                if (!guest) return null;
                const splitRecord = activeTableForGuests.assignedSplits?.find((s) => s.guestId === gId);
                const passCount = splitRecord ? splitRecord.count : guest.confirmedCompanions || guest.allowedCompanions || 1;

                return (
                  <div
                    key={guest.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#D3B48C]/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#162E2D]">
                          {splitRecord ? splitRecord.nameLabel : guest.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4E8281]/10 text-[#4E8281]">
                          {passCount} {passCount > 1 ? 'pases' : 'pase'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#778F8C] block mt-0.5">
                        {guest.group} • Código: #{guest.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleMoveGuestToTable(guest.id, activeTableForGuests.id, e.target.value);
                          }
                        }}
                        defaultValue=""
                        className="text-[11px] rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 px-2.5 py-1.5 text-[#162E2D] outline-none"
                      >
                        <option value="" disabled>
                          🔄 Mover a otra mesa...
                        </option>
                        {tables
                          .filter((t) => t.id !== activeTableForGuests.id)
                          .map((tbl) => (
                            <option key={tbl.id} value={tbl.id}>
                              Mover a #{tbl.tableNumber} - {tbl.name}
                            </option>
                          ))}
                      </select>

                      <button
                        onClick={() => handleRemoveGuest(guest.id, activeTableForGuests.id)}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center gap-1 font-bold text-[11px]"
                        title="Remover de esta mesa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-[#D3B48C]/30 space-y-2">
            <h4 className="text-[11px] font-bold text-[#162E2D]">➕ Sentar a Alguien Más en Esta Mesa:</h4>
            <select
              onChange={(e) => {
                if (e.target.value && activeTableForGuests) {
                  handleAssignGuest(e.target.value, activeTableForGuests.id);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="w-full text-xs rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 px-3 py-2 text-[#162E2D] outline-none"
            >
              <option value="" disabled>
                Selecciona un invitado confirmado de la lista...
              </option>
              {unassignedConfirmedGuests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.confirmedCompanions || g.allowedCompanions} pases - {g.group})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setIsTableGuestsModalOpen(false)}
              className="px-5 py-2 rounded-full bg-[#EFE3D4] text-[#162E2D] font-bold text-xs"
            >
              Listo / Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL: SEPARAR FAMILIA / GRUPO EN MESAS DIFERENTES */}
      <Modal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        title="Dividir Familia entre Mesas"
        subtitle={splittingGuest ? `${splittingGuest.name} • ${splittingGuest.confirmedCompanions || splittingGuest.allowedCompanions} pases totales` : ''}
        maxWidth="md"
      >
        <form onSubmit={handleSaveSplit} className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-[#162E2D] space-y-1">
            <span className="font-bold block">💡 Distribución Flexible de Lugares:</span>
            <p className="text-[11px] text-[#778F8C]">
              Puedes acomodar una parte de la familia (ej. padres) en una mesa y el resto (ej. hijos o jóvenes) en otra mesa distinta.
            </p>
          </div>

          <div className="space-y-3">
            {splitAssignments.map((split, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#D3B48C]/50 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#162E2D]">Grupo {idx + 1}</span>
                  <input
                    type="text"
                    value={split.nameLabel}
                    onChange={(e) => {
                      const updated = [...splitAssignments];
                      updated[idx].nameLabel = e.target.value;
                      setSplitAssignments(updated);
                    }}
                    placeholder="Etiqueta (ej. Adultos, Jóvenes)"
                    className="text-xs px-2 py-1 rounded-lg bg-[#FAF6F0] border border-[#D3B48C]/40 text-[#162E2D] w-44"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-[#778F8C] mb-1">Pases asignados</label>
                    <input
                      type="number"
                      min={1}
                      max={splittingGuest?.confirmedCompanions || splittingGuest?.allowedCompanions || 10}
                      value={split.count}
                      onChange={(e) => {
                        const updated = [...splitAssignments];
                        updated[idx].count = parseInt(e.target.value, 10) || 1;
                        setSplitAssignments(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-xs text-[#162E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#778F8C] mb-1">Mesa destino</label>
                    <select
                      value={split.tableId}
                      onChange={(e) => {
                        const updated = [...splitAssignments];
                        updated[idx].tableId = e.target.value;
                        setSplitAssignments(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-xs text-[#162E2D]"
                    >
                      <option value="">Selecciona mesa...</option>
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          #{t.tableNumber} - {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setIsSplitModalOpen(false)}
              className="px-4 py-2 rounded-full bg-[#EFE3D4] text-[#162E2D] font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-oshun-primary px-6 py-2 uppercase tracking-wider font-bold"
            >
              Guardar Asignación Dividida
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CREAR / EDITAR MESA */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title={editingTable ? 'Editar Mesa' : 'Crear Nueva Mesa'}
        subtitle="Configuración de Banquete OSHUN"
        maxWidth="md"
      >
        <form onSubmit={handleSaveTable} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#162E2D] mb-1">Nombre de la Mesa *</label>
            <input
              type="text"
              required
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Ej. Mesa 1 — Familia Ramírez"
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 outline-none focus:ring-2 focus:ring-[#4E8281]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Número de Mesa</label>
              <input
                type="number"
                min={0}
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Capacidad de Sillas</label>
              <select
                value={tableCapacity}
                onChange={(e) => setTableCapacity(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 outline-none"
              >
                <option value={2}>2 Sillas</option>
                <option value={4}>4 Sillas</option>
                <option value={6}>6 Sillas</option>
                <option value={8}>8 Sillas</option>
                <option value={10}>10 Sillas (Estándar)</option>
                <option value={12}>12 Sillas</option>
                <option value={14}>14 Sillas</option>
                <option value={20}>20 Sillas (Imperial)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Forma de la Mesa</label>
              <select
                value={tableShape}
                onChange={(e) => setTableShape(e.target.value as TableShape)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 outline-none"
              >
                <option value="ROUND">Redonda</option>
                <option value="RECTANGULAR">Rectangular</option>
                <option value="SQUARE">Cuadrada</option>
                <option value="HONOR">Mesa de Honor / Principal</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Zona del Salón</label>
              <input
                type="text"
                value={tableZone}
                onChange={(e) => setTableZone(e.target.value)}
                placeholder="Frente a Pista, Jardín, Terraza..."
                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#162E2D] mb-1">Notas Especiales</label>
            <textarea
              rows={2}
              value={tableNotes}
              onChange={(e) => setTableNotes(e.target.value)}
              placeholder="Centro floral alto, cerca del bar, etc."
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setIsTableModalOpen(false)}
              className="px-4 py-2 rounded-full bg-[#EFE3D4] text-[#162E2D] font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-oshun-primary px-6 py-2 uppercase tracking-wider font-bold"
            >
              {editingTable ? 'Guardar Cambios' : 'Crear Mesa'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: VISTA HOSTESS / RECEPCIÓN EN PUERTA */}
      <Modal
        isOpen={isHostessModalOpen}
        onClose={() => setIsHostessModalOpen(false)}
        title="Plano de Salón & Vista Hostess"
        subtitle="Consulta rápida en recepción para ubicar mesas al ingresar"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
            <input
              type="text"
              value={hostessSearch}
              onChange={(e) => setHostessSearch(e.target.value)}
              placeholder="Buscar por nombre de invitado o familia..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 text-xs outline-none"
            />
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-[#D3B48C]/20 border border-[#D3B48C]/30 rounded-2xl">
            {guests
              .filter((g) => g.name.toLowerCase().includes(hostessSearch.toLowerCase()))
              .map((g) => {
                const assignedTable = tables.find((t) => t.assignedGuestIds.includes(g.id));
                return (
                  <div key={g.id} className="p-3.5 flex items-center justify-between hover:bg-[#FAF6F0]">
                    <div>
                      <span className="font-bold text-sm text-[#162E2D] block">{g.name}</span>
                      <span className="text-[10px] text-[#778F8C]">
                        Pase #{g.code} • {g.confirmedCompanions || g.allowedCompanions} pases • {g.group}
                      </span>
                    </div>

                    <div className="text-right">
                      {assignedTable ? (
                        <div className="inline-block px-3 py-1.5 rounded-xl bg-[#4E8281] text-white font-bold text-xs shadow-sm">
                          {assignedTable.name} ({assignedTable.zone})
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-700 font-semibold bg-amber-100 px-2 py-1 rounded-lg">
                          Sin mesa asignada
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsHostessModalOpen(false)}
              className="px-5 py-2 rounded-full bg-[#EFE3D4] text-[#162E2D] font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
      </FeatureGuard>

    </div>
  );
}
