export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZER' | 'STAFF' | 'CLIENT';

export type PlanTier = 'ESENCIAL' | 'ELEGANCE' | 'IMPERIAL';
export type PlanType = PlanTier | 'FREE' | 'PRO' | 'ENTERPRISE';

export interface PlanFeatures {
  tier: PlanTier;
  name: string;
  badgeColor: string;
  badgeIcon: string;
  maxGuests: number;
  canEditDesign: boolean;
  canManageGuests: boolean;
  canSeatingPlan: boolean;
  canWhatsAppHub: boolean;
  canCheckInQr: boolean;
  canAnalytics: boolean;
  canLiveGallery: boolean;
  desc: string;
}

export const PLAN_CONFIG: Record<PlanTier, PlanFeatures> = {
  ESENCIAL: {
    tier: 'ESENCIAL',
    name: 'Plan Esencial',
    badgeColor: '#778F8C',
    badgeIcon: '🌿',
    maxGuests: 100,
    canEditDesign: true,
    canManageGuests: true,
    canSeatingPlan: false,
    canWhatsAppHub: true,
    canCheckInQr: false,
    canAnalytics: false,
    canLiveGallery: false,
    desc: 'Invitación digital, confirmación RSVP básica y lista de hasta 100 invitados.',
  },
  ELEGANCE: {
    tier: 'ELEGANCE',
    name: 'Plan Elegance (Pro)',
    badgeColor: '#D3B48C',
    badgeIcon: '✨',
    maxGuests: 300,
    canEditDesign: true,
    canManageGuests: true,
    canSeatingPlan: true,
    canWhatsAppHub: true,
    canCheckInQr: true,
    canAnalytics: true,
    canLiveGallery: false,
    desc: 'Salón 2D de Acomodo de Mesas, Recepción QR, Analítica y hasta 300 invitados.',
  },
  IMPERIAL: {
    tier: 'IMPERIAL',
    name: 'Plan Imperial (VIP)',
    badgeColor: '#4E8281',
    badgeIcon: '👑',
    maxGuests: 9999,
    canEditDesign: true,
    canManageGuests: true,
    canSeatingPlan: true,
    canWhatsAppHub: true,
    canCheckInQr: true,
    canAnalytics: true,
    canLiveGallery: true,
    desc: 'Acceso ilimitado a todas las herramientas premium, salón virtual y galería live.',
  },
};

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  plan: PlanTier;
  eventId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type EventCategory =
  | 'boda'
  | 'xv'
  | 'cumpleanos'
  | 'bautizo'
  | 'baby_shower'
  | 'despedida'
  | 'graduacion'
  | 'aniversario'
  | 'primera_comunion'
  | 'empresarial'
  | 'fiesta_infantil'
  | 'reunion_familiar'
  | 'privado'
  | 'otro';

export type GuestProfile =
  | 'VIP'
  | 'FAMILIA'
  | 'AMIGO'
  | 'PAREJA'
  | 'EMPRESA'
  | 'PROVEEDOR'
  | 'PRENSA'
  | 'STAFF'
  | 'INVITADO ESPECIAL'
  | 'REGULAR';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type GuestGroup =
  | 'Familia'
  | 'Amigos'
  | 'Trabajo'
  | 'Novios'
  | 'VIP'
  | 'Proveedores'
  | 'Otros'
  | string;

export type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED' | 'CHECKED_IN';

export interface Companion {
  id: string;
  name: string;
  dietaryRestrictions?: string;
}

export type TableShape = 'ROUND' | 'RECTANGULAR' | 'SQUARE' | 'HONOR';

export interface SeatingTable {
  id: string;
  eventId: string;
  name: string;
  tableNumber: number;
  shape: TableShape;
  capacity: number;
  zone?: string;
  posX?: number;
  posY?: number;
  assignedGuestIds: string[];
  assignedSplits?: { guestId: string; count: number; nameLabel?: string }[];
  notes?: string;
}

export interface Guest {
  id: string;
  eventId: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  profile?: GuestProfile;
  group: GuestGroup;
  status: GuestStatus;
  allowedCompanions: number;
  confirmedCompanions: number;
  companionNames: string[];
  dietaryRestrictions?: string;
  tableNumber?: string;
  tableId?: string;
  seatIds?: string[];
  zone?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
  rsvpRespondedAt?: string;
  notes?: string;
  invitationOpened?: boolean;
  lastContactAt?: string;
}


export interface EventSectionHero {
  enabled: boolean;
  title: string;
  subtitle: string;
  dateText: string;
  timeText: string;
  backgroundImage?: string;
}


export interface EventSectionCountdown {
  enabled: boolean;
  targetDate: string;
}

export interface EventSectionStory {
  enabled: boolean;
  title: string;
  content: string;
  image?: string;
}


export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  icon?: string;
}

export interface EventSectionSchedule {
  enabled: boolean;
  title: string;
  items: ScheduleItem[];
}

export interface EventSectionLocation {
  enabled: boolean;
  title: string;
  venueName: string;
  address: string;
  city: string;
  mapEmbedUrl?: string;
  googleMapsUrl?: string;
  wazeUrl?: string;
}

export interface EventSectionGallery {
  enabled: boolean;
  title: string;
  images: string[];
}

export interface EventSectionDressCode {
  enabled: boolean;
  title: string;
  type: string; // e.g. "Rigurosa Etiqueta", "Formal de Guayabera", "Cóctel Elegante"
  description: string;
  colors?: string[]; // hex color swatches
}


export interface GiftItem {
  title: string;
  type: 'store' | 'bank' | 'envelope';
  url?: string;
  bankName?: string;
  clabe?: string;
  accountHolder?: string;
  notes?: string;
}

export interface EventSectionGiftRegistry {
  enabled: boolean;
  title: string;
  description: string;
  items: GiftItem[];
}

export interface EventSectionRsvp {
  enabled: boolean;
  title: string;
  deadline: string;
  maxCompanionsPerGuest: number;
  allowDietaryRestrictions: boolean;
  customMessage?: string;
}


export interface EventSectionQrPass {
  enabled: boolean;
  title: string;
  instructions: string;
}

export interface EventSectionSeating {
  enabled: boolean;
  title: string;
  subtitle?: string;
  description?: string;
  allowGuestLookup?: boolean;
  showTableMap?: boolean;
  showZones?: boolean;
}

export type AnimationType =
  | 'none'
  | 'fade'
  | 'petals'
  | 'bokeh'
  | 'envelope'
  | 'glow-lights'
  | 'confetti-caps'
  | 'clouds-stars'
  | 'doves-floral'
  | 'geometry'
  | 'tropical-breeze';

export type AnimationIntensity = 'low' | 'medium' | 'high';

export type AudioTrackId = 'romantico' | 'vals' | 'acustico' | 'fiesta' | 'brisa' | 'custom';

export interface DesignEffects {
  backgroundAnimation: boolean;
  animationType: AnimationType;
  animationIntensity: AnimationIntensity;
  soundEnabled: boolean;
  microInteractions: boolean;
  hasEnvelopeIntro?: boolean;
}

export interface DesignAudio {
  trackId: AudioTrackId;
  trackName?: string;
  customAudioUrl?: string;
  musicAutoplay: boolean;
  volume?: number;
}

export interface EventDesign {
  templateId: string;
  templateName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  cardBackground: string;
  fontFamilyTitle: string;
  fontFamilyBody: string;
  coverImageUrl: string;
  musicUrl?: string;
  musicAutoplay: boolean;
  badgeStyle?: 'gold' | 'minimal' | 'modern' | 'romantic';
  galleryCapacity?: number;
  galleryImages?: string[];
  effects?: DesignEffects;
  audio?: DesignAudio;
  sections: {
    hero: EventSectionHero;
    countdown: EventSectionCountdown;
    story: EventSectionStory;
    schedule: EventSectionSchedule;
    location: EventSectionLocation;
    gallery: EventSectionGallery;
    dressCode: EventSectionDressCode;
    giftRegistry: EventSectionGiftRegistry;
    rsvp: EventSectionRsvp;
    qrPass: EventSectionQrPass;
    seating?: EventSectionSeating;
  };
}

export interface Event {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  slug: string;
  category: EventCategory;
  date: string;
  time: string;
  venueName: string;
  address: string;
  city: string;
  description: string;
  status: EventStatus;
  design: EventDesign;
  guestsCount?: number;
  confirmedCount?: number;
  pendingCount?: number;
  declinedCount?: number;
  checkedInCount?: number;
  checkInCount?: number;
  createdAt: string;
  updatedAt: string;
}



export interface MessageTemplate {
  id: string;
  type: 'INVITATION' | 'REMINDER' | 'CONFIRMATION' | 'LAST_NOTICE' | 'THANK_YOU';
  title: string;
  content: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  badge?: string;
  isPremium?: boolean;
  thumbnail?: string;
  previewImage: string;
  tags: string[];
  defaultDesign: Partial<EventDesign>;
}




export interface EventStats {
  totalGuests: number;
  confirmed: number;
  pending: number;
  declined: number;
  checkedIn: number;
  companionsTotal: number;
  confirmedCompanions?: number;
  confirmedTotalHeadcount?: number;
  confirmedRatio: number;
  confirmationRate?: number;
  checkedInRatio: number;
  checkInRate?: number;
}

