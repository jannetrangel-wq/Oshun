'use client';

import { Event, EventDesign, Guest, MessageTemplate, User, EventStats, GuestStatus, SeatingTable, PlanTier, PlanFeatures, PLAN_CONFIG } from '@/types';

import { CURRENT_USER, SUPER_ADMIN_USER, INITIAL_USERS, INITIAL_EVENTS, generateInitialGuests, DEFAULT_MESSAGE_TEMPLATES, INITIAL_TABLES } from './mock-data';

const STORAGE_KEYS = {
  USER: 'oshun_active_user',
  USERS_LIST: 'oshun_all_users',
  EVENTS: 'invitamx_events',
  GUESTS: 'invitamx_guests',
  TEMPLATES: 'invitamx_msg_templates',
  TABLES: 'invitamx_seating_tables',
};

export class InvitaStore {
  private static isClient = typeof window !== 'undefined';

  public static getUsers(): User[] {
    if (!this.isClient) return INITIAL_USERS;
    const stored = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Asegurar que siempre esté presente el Super Admin maestro
          const hasMasterAdmin = parsed.some((u: User) => u.username?.toLowerCase() === 'administradorgeneral');
          if (!hasMasterAdmin) {
            parsed.unshift(SUPER_ADMIN_USER);
            this.saveUsers(parsed);
          }
          return parsed;
        }
      } catch (e) { /* fallback */ }
    }
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }

  public static saveUsers(users: User[]): void {
    if (this.isClient) {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    }
  }

  public static getUser(): User | null {
    if (!this.isClient) return CURRENT_USER;
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) { /* fallback */ }
    }
    return null;
  }

  public static setUser(user: User | null): void {
    if (this.isClient) {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  }

  public static login(usernameInput: string, passwordInput: string): { success: boolean; user?: User; error?: string } {
    const trimmedUser = usernameInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    // Verificación especial para Administrador General
    if (
      (trimmedUser === 'administradorgeneral' || trimmedUser === 'admin@oshun.com') &&
      trimmedPass === 'JanetySergio2908'
    ) {
      this.setUser(SUPER_ADMIN_USER);
      return { success: true, user: SUPER_ADMIN_USER };
    }

    const allUsers = this.getUsers();
    const found = allUsers.find(
      (u) =>
        (u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedUser) &&
        (u.password === trimmedPass || (!u.password && trimmedPass === 'JanSer2026'))
    );

    if (found) {
      this.setUser(found);
      return { success: true, user: found };
    }

    return {
      success: false,
      error: 'Usuario o contraseña incorrectos. Verifica tus credenciales de acceso.',
    };
  }

  public static logout(): void {
    this.setUser(null);
  }

  public static registerClientForEvent(
    eventId: string,
    eventTitle: string,
    plan: PlanTier = 'ELEGANCE'
  ): { user: User; rawPassword: string } {
    const cleanSlug = eventTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 20);

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const username = `cliente-${cleanSlug || 'evento'}-${randomSuffix}`;
    const rawPassword = `OSHUN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password: rawPassword,
      name: eventTitle || 'Cliente OSHUN',
      email: `${username}@cliente.oshun.com`,
      role: 'CLIENT',
      tenantId: `tenant-${Date.now()}`,
      plan,
      eventId,
      createdAt: new Date().toISOString(),
    };

    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    return { user: newUser, rawPassword };
  }

  public static updateUserPlan(userId: string, newPlan: PlanTier): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].plan = newPlan;
      this.saveUsers(users);

      const current = this.getUser();
      if (current && current.id === userId) {
        this.setUser(users[idx]);
      }
    }
  }

  public static getUserPlanFeatures(user: User | null): PlanFeatures {
    if (!user) return PLAN_CONFIG.ESENCIAL;
    if (user.role === 'SUPER_ADMIN') return PLAN_CONFIG.IMPERIAL;
    return PLAN_CONFIG[user.plan] || PLAN_CONFIG.ESENCIAL;
  }

  public static getEvents(): Event[] {
    if (!this.isClient) return INITIAL_EVENTS;
    const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    this.saveEvents(INITIAL_EVENTS);
    return INITIAL_EVENTS;
  }

  public static saveEvents(events: Event[]): void {
    if (this.isClient) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }
  }

  public static getEventById(id: string): Event | undefined {
    const events = this.getEvents();
    return events.find((e) => e.id === id || e.slug === id);
  }

  public static getEventBySlug(slug: string): Event | undefined {
    const events = this.getEvents();
    const found = events.find((e) => e.slug === slug || e.id === slug);
    if (found) return found;

    // Check if slug matches a template ID
    const { TEMPLATES_DATA } = require('./templates-data');
    const template = TEMPLATES_DATA.find((t: any) => t.id === slug || t.id.replace(/-/g, '') === slug.replace(/-/g, ''));
    if (template) {
      const design = template.defaultDesign;
      return {
        id: `event-${template.id}`,
        tenantId: 'tenant-demo',
        userId: 'user-demo',
        title: design.sections?.hero?.title || template.name,
        slug: template.id,
        category: template.category as any,
        date: '2026-07-20',
        time: '17:00',
        venueName: design.sections?.location?.venueName || 'Hacienda San José',
        address: design.sections?.location?.address || 'Carretera Transpeninsular Km 18.5',
        city: design.sections?.location?.city || 'Los Cabos, B.C.S.',
        description: design.sections?.story?.content || template.description,
        status: 'PUBLISHED',
        guestsCount: 250,
        confirmedCount: 184,
        pendingCount: 42,
        declinedCount: 24,
        checkInCount: 167,
        createdAt: '2026-01-15T12:00:00Z',
        updatedAt: '2026-02-01T15:30:00Z',
        design: design,
      };
    }

    return events[0];
  }

  public static updateEvent(id: string, updates: Partial<Event>): Event | undefined {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id || e.slug === id);
    if (index === -1) return undefined;

    const updated = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    events[index] = updated;
    this.saveEvents(events);
    return updated;
  }

  public static updateEventDesign(id: string, design: EventDesign): Event | undefined {
    return this.updateEvent(id, { design });
  }


  public static createEvent(newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
    const events = this.getEvents();
    const event: Event = {
      ...newEvent,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    events.unshift(event);
    this.saveEvents(events);

    // Initialise empty guest list for this event
    const allGuests = this.getAllGuests();
    this.saveAllGuests(allGuests);

    return event;
  }

  public static deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id && e.slug !== id);
    if (filtered.length !== events.length) {
      this.saveEvents(filtered);
      return true;
    }
    return false;
  }

  // --- GUESTS MANAGEMENT ---
  public static getAllGuests(): Record<string, Guest[]> {
    if (!this.isClient) {
      return { 'event-01': generateInitialGuests('event-01') };
    }
    const stored = localStorage.getItem(STORAGE_KEYS.GUESTS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) { /* fallback */ }
    }
    const initial = { 'event-01': generateInitialGuests('event-01') };
    this.saveAllGuests(initial);
    return initial;
  }

  public static saveAllGuests(allGuests: Record<string, Guest[]>): void {
    if (this.isClient) {
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(allGuests));
    }
  }

  public static getGuestsForEvent(eventId: string): Guest[] {
    const all = this.getAllGuests();
    if (!all[eventId]) {
      if (eventId === 'event-01') {
        all[eventId] = generateInitialGuests('event-01');
        this.saveAllGuests(all);
      } else {
        all[eventId] = [];
        this.saveAllGuests(all);
      }
    }
    return all[eventId];
  }

  public static saveGuestsForEvent(eventId: string, guests: Guest[]): void {
    const all = this.getAllGuests();
    all[eventId] = guests;
    this.saveAllGuests(all);
  }

  public static getGuestByCode(eventId: string, code: string): Guest | undefined {
    const guests = this.getGuestsForEvent(eventId);
    return guests.find((g) => g.code.toLowerCase() === code.toLowerCase() || g.id === code);
  }

  public static addGuest(eventId: string, guestData: Omit<Guest, 'id' | 'eventId'>): Guest {
    const guests = this.getGuestsForEvent(eventId);
    const guest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      eventId,
    };
    guests.unshift(guest);
    this.saveGuestsForEvent(eventId, guests);
    return guest;
  }

  public static updateGuest(eventId: string, guestId: string, updates: Partial<Guest>): Guest | undefined {
    const guests = this.getGuestsForEvent(eventId);
    const index = guests.findIndex((g) => g.id === guestId || g.code.toLowerCase() === guestId.toLowerCase());
    if (index === -1) return undefined;

    const updated = {
      ...guests[index],
      ...updates,
    };
    guests[index] = updated;
    this.saveGuestsForEvent(eventId, guests);
    return updated;
  }

  public static deleteGuest(eventId: string, guestId: string): boolean {
    const guests = this.getGuestsForEvent(eventId);
    const filtered = guests.filter((g) => g.id !== guestId);
    if (filtered.length !== guests.length) {
      this.saveGuestsForEvent(eventId, filtered);
      return true;
    }
    return false;
  }

  public static recordCheckIn(
    eventId: string,
    guestId: string,
    confirmedCompanions?: number,
    staffName = 'Staff Entrada',
    method = 'QR_SCAN'
  ): { success: boolean; message: string; guest?: Guest; alreadyCheckedIn?: boolean } {

    const guest = this.getGuestByCode(eventId, guestId) || this.getGuestsForEvent(eventId).find(g => g.id === guestId);
    if (!guest) {
      return { success: false, message: 'Invitado no encontrado en la lista del evento' };
    }

    if (guest.checkedIn) {
      return {
        success: false,
        alreadyCheckedIn: true,
        message: `Este pase ya fue registrado a las ${new Date(guest.checkedInAt || '').toLocaleTimeString()} por ${guest.checkedInBy || 'Staff'}`,
        guest,
      };
    }

    const updated = this.updateGuest(eventId, guest.id, {
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
      checkedInBy: staffName,
      confirmedCompanions: confirmedCompanions !== undefined ? confirmedCompanions : guest.confirmedCompanions,
    });

    return {
      success: true,
      message: `¡Bienvenido/a, ${guest.name}! Acceso validado correctamente.`,
      guest: updated,
    };
  }

  public static getCheckInLogs(eventId: string): Array<{
    id: string;
    guestName: string;
    guestCode: string;
    headcount: number;
    timestamp: string;
  }> {
    const guests = this.getGuestsForEvent(eventId);
    return guests
      .filter((g) => g.checkedIn)
      .map((g) => ({
        id: `log-${g.id}`,
        guestName: g.name,
        guestCode: g.code,
        headcount: g.confirmedCompanions || g.allowedCompanions || 1,
        timestamp: g.checkedInAt || new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }


  public static recordRsvp(
    eventId: string,
    guestCodeOrId: string,
    status: 'CONFIRMED' | 'DECLINED',
    confirmedCompanions: number,
    companionNames: string[],
    dietaryRestrictions: string,
    notes?: string
  ): { success: boolean; message: string; guest?: Guest } {
    const guest = this.getGuestByCode(eventId, guestCodeOrId) || this.getGuestsForEvent(eventId).find(g => g.id === guestCodeOrId);
    if (!guest) {
      return { success: false, message: 'No se encontró la invitación solicitada' };
    }

    const updated = this.updateGuest(eventId, guest.id, {
      status,
      confirmedCompanions: status === 'CONFIRMED' ? confirmedCompanions : 0,
      companionNames: status === 'CONFIRMED' ? companionNames : [],
      dietaryRestrictions,
      notes: notes || guest.notes,
      rsvpRespondedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: status === 'CONFIRMED' ? '¡Gracias por confirmar tu asistencia!' : 'Lamentamos que no puedas asistir. ¡Gracias por avisarnos!',
      guest: updated,
    };
  }

  public static getEventStats(eventId: string): EventStats {
    const guests = this.getGuestsForEvent(eventId);
    const totalGuests = guests.length;
    let confirmed = 0;
    let pending = 0;
    let declined = 0;
    let checkedIn = 0;
    let companionsTotal = 0;

    guests.forEach((g) => {
      if (g.status === 'CONFIRMED') {
        confirmed++;
        companionsTotal += (g.confirmedCompanions || 0);
      } else if (g.status === 'DECLINED') {
        declined++;
      } else {
        pending++;
      }
      if (g.checkedIn) checkedIn++;
    });

    const confirmedRatio = totalGuests > 0 ? Math.round((confirmed / totalGuests) * 100) : 0;
    const checkedInRatio = confirmed > 0 ? Math.round((checkedIn / confirmed) * 100) : 0;

    return {
      totalGuests,
      confirmed,
      pending,
      declined,
      checkedIn,
      companionsTotal,
      confirmedCompanions: companionsTotal,
      confirmedTotalHeadcount: confirmed + companionsTotal,
      confirmedRatio,
      confirmationRate: confirmedRatio,
      checkedInRatio,
      checkInRate: checkedInRatio,
    };
  }


  // --- MESSAGE TEMPLATES ---
  public static getMessageTemplates(): MessageTemplate[] {
    if (!this.isClient) return DEFAULT_MESSAGE_TEMPLATES;
    const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    this.saveMessageTemplates(DEFAULT_MESSAGE_TEMPLATES);
    return DEFAULT_MESSAGE_TEMPLATES;
  }

  public static saveMessageTemplates(templates: MessageTemplate[]): void {
    if (this.isClient) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    }
  }

  // --- SEATING & TABLE MANAGEMENT ---
  public static getAllTables(): SeatingTable[] {
    if (!this.isClient) return INITIAL_TABLES;
    const stored = localStorage.getItem(STORAGE_KEYS.TABLES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    this.saveAllTables(INITIAL_TABLES);
    return INITIAL_TABLES;
  }

  public static saveAllTables(tables: SeatingTable[]): void {
    if (this.isClient) {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    }
  }

  public static getTablesForEvent(eventId: string): SeatingTable[] {
    const all = this.getAllTables();
    return all.filter((t) => t.eventId === eventId);
  }

  public static createTable(eventId: string, newTableData: Partial<SeatingTable>): SeatingTable {
    const all = this.getAllTables();
    const eventTables = all.filter((t) => t.eventId === eventId);
    const nextNumber = eventTables.length > 0 ? Math.max(...eventTables.map((t) => t.tableNumber)) + 1 : 1;

    const newTable: SeatingTable = {
      id: `tbl-${Date.now()}`,
      eventId,
      name: newTableData.name || `Mesa ${nextNumber}`,
      tableNumber: newTableData.tableNumber || nextNumber,
      shape: newTableData.shape || 'ROUND',
      capacity: newTableData.capacity || 10,
      zone: newTableData.zone || 'Salón Principal',
      assignedGuestIds: newTableData.assignedGuestIds || [],
      notes: newTableData.notes || '',
    };

    all.push(newTable);
    this.saveAllTables(all);
    return newTable;
  }

  public static updateTable(eventId: string, tableId: string, updates: Partial<SeatingTable>): SeatingTable | undefined {
    const all = this.getAllTables();
    const idx = all.findIndex((t) => t.id === tableId);
    if (idx === -1) return undefined;

    const updated = { ...all[idx], ...updates };
    all[idx] = updated;
    this.saveAllTables(all);
    return updated;
  }

  public static deleteTable(eventId: string, tableId: string): boolean {
    const all = this.getAllTables();
    const filtered = all.filter((t) => t.id !== tableId);
    if (filtered.length !== all.length) {
      this.saveAllTables(filtered);
      return true;
    }
    return false;
  }

  public static assignGuestToTable(eventId: string, guestId: string, tableId: string): boolean {
    const all = this.getAllTables();
    const table = all.find((t) => t.id === tableId);
    if (!table) return false;

    // Remove guest from any other table first
    all.forEach((t) => {
      t.assignedGuestIds = t.assignedGuestIds.filter((id) => id !== guestId);
    });

    if (!table.assignedGuestIds.includes(guestId)) {
      table.assignedGuestIds.push(guestId);
    }

    this.saveAllTables(all);

    // Also update guest's tableNumber field in guests store
    const guest = this.getGuestById(eventId, guestId);
    if (guest) {
      this.updateGuest(eventId, guestId, { tableNumber: table.name });
    }

    return true;
  }

  public static updateTablePosition(eventId: string, tableId: string, posX: number, posY: number): void {
    const all = this.getAllTables();
    const table = all.find((t) => t.id === tableId);
    if (table) {
      table.posX = Math.max(2, Math.min(98, Number(posX.toFixed(2))));
      table.posY = Math.max(2, Math.min(98, Number(posY.toFixed(2))));
      this.saveAllTables(all);
    }
  }

  public static splitFamilyAcrossTables(
    eventId: string,
    guestId: string,
    splits: { tableId: string; count: number; nameLabel?: string }[]
  ): boolean {
    const all = this.getAllTables();
    const guest = this.getGuestById(eventId, guestId);
    if (!guest) return false;

    // Remove this guest and existing splits from all tables first
    all.forEach((t) => {
      t.assignedGuestIds = t.assignedGuestIds.filter((id) => id !== guestId);
      if (t.assignedSplits) {
        t.assignedSplits = t.assignedSplits.filter((s) => s.guestId !== guestId);
      }
    });

    // Apply new splits
    const tableNames: string[] = [];
    splits.forEach((split) => {
      if (split.count > 0) {
        const table = all.find((t) => t.id === split.tableId);
        if (table) {
          if (!table.assignedSplits) table.assignedSplits = [];
          table.assignedSplits.push({
            guestId,
            count: split.count,
            nameLabel: split.nameLabel || guest.name,
          });
          if (!table.assignedGuestIds.includes(guestId)) {
            table.assignedGuestIds.push(guestId);
          }
          tableNames.push(`${table.name} (${split.count} pases)`);
        }
      }
    });

    this.saveAllTables(all);
    this.updateGuest(eventId, guestId, {
      tableNumber: tableNames.length > 0 ? tableNames.join(' / ') : undefined,
    });
    return true;
  }

  public static removeGuestFromTable(eventId: string, guestId: string, tableId: string): boolean {
    const all = this.getAllTables();
    const table = all.find((t) => t.id === tableId);
    if (!table) return false;

    table.assignedGuestIds = table.assignedGuestIds.filter((id) => id !== guestId);
    if (table.assignedSplits) {
      table.assignedSplits = table.assignedSplits.filter((s) => s.guestId !== guestId);
    }
    this.saveAllTables(all);

    // Update guest's tableNumber field
    const guest = this.getGuestById(eventId, guestId);
    if (guest) {
      const remainingTables = all.filter((t) => t.assignedGuestIds.includes(guestId));
      this.updateGuest(eventId, guestId, {
        tableNumber: remainingTables.length > 0 ? remainingTables.map((t) => t.name).join(', ') : undefined,
      });
    }

    return true;
  }

  public static autoAssignConfirmedGuests(eventId: string): { assigned: number; tablesUsed: number } {
    const tables = this.getTablesForEvent(eventId);
    const guests = this.getGuestsForEvent(eventId).filter((g) => g.status === 'CONFIRMED');
    let assigned = 0;

    // Reset current assignments or fill empty seats
    for (const guest of guests) {
      const isAlreadyAssigned = tables.some((t) => t.assignedGuestIds.includes(guest.id));
      if (!isAlreadyAssigned) {
        // Find matching table by group or first available table with capacity
        const groupMatch = tables.find((t) => {
          const usedSeats = t.assignedGuestIds.reduce((sum, gId) => {
            const g = guests.find((x) => x.id === gId);
            return sum + (g?.confirmedCompanions || g?.allowedCompanions || 1);
          }, 0);
          const needed = guest.confirmedCompanions || guest.allowedCompanions || 1;
          return usedSeats + needed <= t.capacity && t.name.toLowerCase().includes(guest.group.toLowerCase());
        });

        const targetTable = groupMatch || tables.find((t) => {
          const usedSeats = t.assignedGuestIds.reduce((sum, gId) => {
            const g = guests.find((x) => x.id === gId);
            return sum + (g?.confirmedCompanions || g?.allowedCompanions || 1);
          }, 0);
          const needed = guest.confirmedCompanions || guest.allowedCompanions || 1;
          return usedSeats + needed <= t.capacity;
        });

        if (targetTable) {
          targetTable.assignedGuestIds.push(guest.id);
          this.updateGuest(eventId, guest.id, { tableNumber: targetTable.name });
          assigned++;
        }
      }
    }

    this.saveAllTables(this.getAllTables());
    const tablesUsed = tables.filter((t) => t.assignedGuestIds.length > 0).length;
    return { assigned, tablesUsed };
  }
}
