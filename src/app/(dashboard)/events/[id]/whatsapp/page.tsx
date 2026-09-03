'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  MessageSquare,
  Smartphone,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  Copy,
  Check,
  Filter,
  ExternalLink,
  Download,
  Image as ImageIcon,
  FileText,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Crown,
  Eye,
  RefreshCw,
  Gift,
  Shirt,
  Navigation,
  Compass,
  Volume2,
  VolumeX,
  Music,
  UserCheck,
  Award
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { MESSAGE_TEMPLATES } from '@/lib/mock-data';
import { compileTemplate, buildWhatsAppUrl } from '@/lib/whatsapp';
import { formatDate } from '@/lib/utils';
import { generateQrDataUrl } from '@/lib/qr';
import { Event, Guest } from '@/types';
import EventNavTabs from '@/components/ui/EventNavTabs';

export default function WhatsAppHubPage() {
  const params = useParams();
  const eventId = params.id as string;

  const event = InvitaStore.getEventById(eventId) || InvitaStore.getEvents()[0];
  const guests = InvitaStore.getGuestsForEvent(event?.id || 'event-01');

  // Dispatch Mode: 'VISUAL_TEMPLATE' (Invitación Completa de la Plantilla Personalizada) or 'TEXT' (Mensaje de Texto Clásico)
  const [dispatchMode, setDispatchMode] = useState<'VISUAL_TEMPLATE' | 'TEXT'>('VISUAL_TEMPLATE');

  const [selectedTemplateId, setSelectedTemplateId] = useState(MESSAGE_TEMPLATES[0].id);
  const [selectedGuestId, setSelectedGuestId] = useState(guests[0]?.id || '');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [guestFilter, setGuestFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'VIP'>('ALL');
  const [guestQrUrl, setGuestQrUrl] = useState<string>('');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [copiedClabe, setCopiedClabe] = useState(false);

  const currentTemplate = MESSAGE_TEMPLATES.find((t) => t.id === selectedTemplateId) || MESSAGE_TEMPLATES[0];
  const currentGuest = guests.find((g) => g.id === selectedGuestId) || guests[0];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com';
  const guestInvitationUrl = `${origin}/i/${event?.slug || 'boda'}${currentGuest ? `/${currentGuest.code}` : ''}`;

  // Generate QR Code for the active guest
  useEffect(() => {
    if (!currentGuest || !event) return;
    generateQrDataUrl(guestInvitationUrl, {
      darkColor: '#0F2424',
      lightColor: '#FFFFFF',
      width: 200,
    }).then((url) => {
      setGuestQrUrl(url);
    });
  }, [currentGuest?.id, event?.id, guestInvitationUrl]);

  if (!event) return null;

  const design = event.design || {
    backgroundColor: '#97B8B3',
    fontFamilyTitle: 'Cinzel',
    fontFamilyBody: 'Montserrat',
    coverImageUrl: '/images/templates/template-wedding-classic.jpg',
    primaryColor: '#4E8281',
    secondaryColor: '#D3B48C',
    accentColor: '#97B8B3',
    sections: {
      hero: { title: event.title, subtitle: 'Te invitamos a celebrar juntos', date: event.date },
      countdown: { enabled: true },
      story: { enabled: true, title: 'Nuestra Historia', content: 'Un día lleno de amor y celebración.' },
      schedule: { enabled: false, items: [] },
      location: { enabled: true, venueName: event.venueName, address: event.venueAddress, mapsUrl: '' },
      dressCode: { enabled: true, code: event.dressCode || 'Formal', description: 'Vestimenta formal de gala' },
      giftRegistry: { enabled: false },
      gallery: { enabled: false, images: [] },
      rsvp: { enabled: true },
    },
  };
  const sections = design.sections || {
    hero: { title: event.title, subtitle: 'Te invitamos a celebrar juntos', date: event.date },
    countdown: { enabled: true },
    schedule: { enabled: false, items: [] },
  };

  // Text message compilation
  const compiledTextMessage = currentGuest
    ? compileTemplate(currentTemplate.content, {
        nombre: currentGuest.name,
        evento: event.title,
        fecha: formatDate(event.date),
        hora: event.time,
        lugar: event.venueName,
        url: guestInvitationUrl,
        pases: String(currentGuest.allowedCompanions),
        mesa: currentGuest.tableNumber || 'Por asignar',
      })
    : '';

  // Visual Template Invitation WhatsApp message
  const visualTemplateWhatsAppMessage = currentGuest
    ? `✨ *${event.title.toUpperCase()}* ✨\n\nEstimado/a *${currentGuest.name}*,\n\nCon gran alegría te compartimos tu *Invitación Digital Personalizada* para acompañarnos en nuestro evento.\n\n🎟️ *Tus Pases Asignados:* ${currentGuest.allowedCompanions} persona(s)\n📍 *Lugar:* ${event.venueName}, ${event.city}\n🗓️ *Fecha:* ${formatDate(event.date)} a las ${event.time} hrs\n\n👇 *Toca el siguiente enlace para abrir tu invitación digital, ver el itinerario, la ubicación y confirmar tu asistencia:*\n${guestInvitationUrl}\n\n_¡Esperamos contar con tu presencia!_`
    : '';

  const activeWhatsAppText = dispatchMode === 'VISUAL_TEMPLATE' ? visualTemplateWhatsAppMessage : compiledTextMessage;
  const whatsAppUrl = currentGuest ? buildWhatsAppUrl(currentGuest.phone, activeWhatsAppText) : '#';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(activeWhatsAppText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestInvitationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredGuests = guests.filter((g) => {
    if (guestFilter === 'PENDING') return g.status === 'PENDING';
    if (guestFilter === 'CONFIRMED') return g.status === 'CONFIRMED';
    if (guestFilter === 'VIP') return g.group?.toLowerCase().includes('vip');
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Event Sub-Navigation Tabs */}
      <EventNavTabs />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
            Centro de Automatización & Reenvío • OSHUN
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Hub de WhatsApp
          </h2>
          <p className="text-xs text-[#778F8C]">
            Reenvía la <strong>invitación personalizada completa</strong> con el diseño de la plantilla o un mensaje de texto formal.
          </p>
        </div>

        {/* Global Dispatch Mode Toggle */}
        <div className="flex items-center p-1 rounded-full bg-white border border-[#D3B48C]/50 shadow-sm">
          <button
            onClick={() => setDispatchMode('VISUAL_TEMPLATE')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              dispatchMode === 'VISUAL_TEMPLATE'
                ? 'bg-[#4E8281] text-white shadow'
                : 'text-[#778F8C] hover:text-[#162E2D]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Invitación Completa (Plantilla)</span>
          </button>

          <button
            onClick={() => setDispatchMode('TEXT')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              dispatchMode === 'TEXT'
                ? 'bg-[#4E8281] text-white shadow'
                : 'text-[#778F8C] hover:text-[#162E2D]'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Mensaje de Texto Simple</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Guest Selector & Mode Info */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Event & Template Banner */}
          <div className="rounded-3xl bg-white border border-[#D3B48C]/50 p-5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
                Evento Seleccionado
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#4E8281]/10 text-[#4E8281]">
                Plantilla: {design.templateName || 'OSHUN Insignia'}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
              {event.title}
            </h3>
            <p className="text-xs text-[#778F8C]">
              {formatDate(event.date)} • {event.time} hrs • {event.venueName}
            </p>
          </div>

          {/* If in Text Mode: Template Selector */}
          {dispatchMode === 'TEXT' && (
            <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#162E2D] uppercase tracking-wider font-serif">
                Plantilla de Redacción
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {MESSAGE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedTemplateId === tmpl.id
                        ? 'border-[#4E8281] bg-[#4E8281]/10 shadow-sm ring-1 ring-[#4E8281]'
                        : 'border-[#D3B48C]/30 bg-[#FAF6F0] hover:border-[#4E8281]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#162E2D] block">{tmpl.title}</span>
                    <span className="text-[10px] text-[#778F8C] line-clamp-1 block mt-0.5">
                      {tmpl.content.replace(/\n/g, ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guest Selector List */}
          <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#162E2D] uppercase tracking-wider font-serif">
                Lista de Invitados ({filteredGuests.length})
              </h3>

              <div className="flex gap-1">
                {(['ALL', 'PENDING', 'CONFIRMED', 'VIP'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setGuestFilter(f)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all ${
                      guestFilter === f ? 'bg-[#4E8281] text-white font-bold' : 'bg-[#FAF6F0] text-[#778F8C]'
                    }`}
                  >
                    {f === 'ALL' ? 'Todos' : f === 'PENDING' ? 'Pend.' : f === 'CONFIRMED' ? 'Conf.' : 'VIP'}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[480px] overflow-y-auto divide-y divide-[#D3B48C]/20 border border-[#D3B48C]/30 rounded-2xl">
              {filteredGuests.map((guest) => {
                const isSelected = guest.id === selectedGuestId;
                const gUrl = buildWhatsAppUrl(
                  guest.phone,
                  dispatchMode === 'VISUAL_TEMPLATE'
                    ? `✨ *${event.title}* ✨\nHola *${guest.name}*, te compartimos tu invitación digital personalizada:\n${origin}/i/${event.slug}/${guest.code}`
                    : compileTemplate(currentTemplate.content, {
                        nombre: guest.name,
                        evento: event.title,
                        fecha: formatDate(event.date),
                        hora: event.time,
                        lugar: event.venueName,
                        url: `${origin}/i/${event.slug}/${guest.code}`,
                        pases: String(guest.allowedCompanions),
                        mesa: guest.tableNumber || 'Por asignar',
                      })
                );

                return (
                  <div
                    key={guest.id}
                    onClick={() => setSelectedGuestId(guest.id)}
                    className={`p-3 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#EADBC6]/50 border-l-4 border-l-[#4E8281]' : 'hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 shrink-0 rounded-full bg-[#4E8281] text-white flex items-center justify-center font-bold text-[10px]">
                        {guest.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[#162E2D] block truncate">{guest.name}</span>
                        <span className="text-[10px] text-[#778F8C] block">
                          #{guest.code} • {guest.allowedCompanions} {guest.allowedCompanions > 1 ? 'pases' : 'pase'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                          guest.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-800'
                            : guest.status === 'DECLINED'
                            ? 'bg-rose-500/10 text-rose-800'
                            : 'bg-amber-500/10 text-amber-800'
                        }`}
                      >
                        {guest.status === 'CONFIRMED' ? '✓ Conf.' : guest.status === 'DECLINED' ? '✕ Dec.' : '⏳ Pend.'}
                      </span>

                      <a
                        href={gUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all"
                        title="Enviar WhatsApp"
                      >
                        <Send className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Full Live Invitation Preview / Simulator */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-3">
          
          {/* Top Actions Bar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-[#D3B48C]/40 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#162E2D] font-serif">
                Invitación para: <strong>{currentGuest?.name}</strong>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D3B48C] text-[#0F2424]">
                #{currentGuest?.code}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#EFE3D4] text-[#162E2D] text-xs font-semibold flex items-center gap-1 border border-[#D3B48C]/40"
              >
                {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-[#4E8281]" />}
                <span>{copiedLink ? 'Copiado' : 'Copiar Link'}</span>
              </button>

              <a
                href={guestInvitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4E8281] text-xs font-semibold flex items-center gap-1 border border-[#4E8281]/40"
              >
                <Eye className="h-3 w-3" />
                <span>Ver en Nueva Pestaña</span>
              </a>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Send className="h-3 w-3" />
                <span>Reenviar a WhatsApp</span>
              </a>
            </div>
          </div>

          {/* FULL INVITATION SCROLLABLE PREVIEW FRAME */}
          {dispatchMode === 'VISUAL_TEMPLATE' ? (
            <div className="w-full max-w-[440px] rounded-[44px] border-[8px] border-[#0F2424] shadow-2xl overflow-hidden bg-black ring-2 ring-[#D3B48C]/40">
              
              {/* Scrollable Container with Template Background */}
              <div
                className="w-full overflow-y-auto max-h-[720px] relative text-[#162E2D] selection:bg-[#4E8281] selection:text-white"
                style={{
                  backgroundColor: design.backgroundColor || '#97B8B3',
                  fontFamily: `${design.fontFamilyBody || 'Montserrat'}, sans-serif`,
                }}
              >
                <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-20">
                  
                  {/* TOP LOGO */}
                  <div className="text-center space-y-1 pt-2">
                    <OshunLogo variant="isotipo" size="md" />
                    <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#0F2424] block font-cinzel">
                      Invitación Digital Oficial
                    </span>
                  </div>

                  {/* PERSONALIZED GUEST WELCOME BANNER */}
                  <div className="p-5 rounded-3xl bg-white/95 border-2 border-[#D3B48C] shadow-xl text-center space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#D3B48C]">
                      <span>✦</span>
                      <span>Pase Exclusivo #{currentGuest?.code}</span>
                      <span>✦</span>
                    </div>

                    <h3
                      className="text-lg font-bold text-[#4E8281]"
                      style={{ fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
                    >
                      ¡Hola, {currentGuest?.name}!
                    </h3>

                    <p className="text-xs text-[#162E2D] leading-relaxed">
                      Con gran alegría te invitamos a celebrar juntos. Hemos reservado{' '}
                      <strong>{currentGuest?.allowedCompanions} {currentGuest?.allowedCompanions > 1 ? 'lugares' : 'lugar'}</strong>{' '}
                      especialmente para ti.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30 text-center">
                        <span className="text-[8px] font-bold text-[#778F8C] uppercase block">Lugares Reservados</span>
                        <span className="text-xs font-bold text-[#4E8281]">{currentGuest?.allowedCompanions} {((currentGuest?.allowedCompanions || 1) > 1) ? 'Personas' : 'Persona'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30 text-center">
                        <span className="text-[8px] font-bold text-[#778F8C] uppercase block">Código de Acceso</span>
                        <span className="text-xs font-bold text-[#162E2D]">#{currentGuest?.code}</span>
                      </div>
                    </div>
                  </div>

                  {/* HERO SECTION */}
                  <section className="text-center space-y-3 p-5 rounded-3xl bg-[#FAF6F0]/95 border-2 border-[#D3B48C]/40 shadow-xl">
                    <p className="text-[10px] tracking-widest text-[#778F8C] uppercase font-semibold">
                      {sections.hero?.subtitle || 'Te invitamos a celebrar juntos'}
                    </p>

                    <h1
                      className="text-2xl font-bold tracking-widest text-[#4E8281] leading-tight"
                      style={{ fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
                    >
                      {event.title}
                    </h1>

                    <div className="flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[#162E2D]">
                      <span>{formatDate(event.date).toUpperCase()}</span>
                      <span className="text-[#D3B48C]">✦</span>
                      <span>{event.time} HRS</span>
                    </div>

                    <div className="relative h-56 w-full rounded-2xl overflow-hidden border-2 border-[#D3B48C]/40 shadow-md bg-[#EFE3D4] mt-2">
                      <img
                        src={design.coverImageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2424]/60 via-transparent to-transparent" />
                      <p className="absolute bottom-2 left-2 right-2 text-[11px] text-white font-medium italic text-center drop-shadow">
                        {event.venueName} • {event.city}
                      </p>
                    </div>
                  </section>

                  {/* COUNTDOWN */}
                  <section className="p-4 rounded-2xl bg-[#FAF6F0]/95 border border-[#D3B48C]/40 shadow-md text-center space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#D3B48C] font-cinzel">
                      Solo Faltan
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: 'DÍAS', value: '138' },
                        { label: 'HORAS', value: '07' },
                        { label: 'MINUTOS', value: '42' },
                        { label: 'SEGUNDOS', value: '19' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-[#EFE3D4]/70 border border-[#D3B48C]/30 text-center">
                          <span className="text-lg font-bold text-[#4E8281] block leading-none font-cinzel">
                            {item.value}
                          </span>
                          <span className="text-[7px] font-bold text-[#778F8C] uppercase mt-0.5 block">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SCHEDULE */}
                  {sections.schedule?.enabled && (
                    <section className="p-5 rounded-3xl bg-[#FAF6F0]/95 border border-[#D3B48C]/40 shadow-md space-y-3">
                      <h4 className="text-xs font-bold text-[#4E8281] uppercase tracking-wider text-center font-cinzel">
                        Itinerario del Día
                      </h4>
                      <div className="divide-y divide-[#D3B48C]/20 text-xs">
                        {sections.schedule.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-start gap-3">
                            <span className="font-bold text-[#4E8281] shrink-0 w-16 text-right">{item.time}</span>
                            <div>
                              <p className="font-bold text-[#162E2D]">{item.title}</p>
                              <p className="text-[10px] text-[#778F8C]">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* LOCATION */}
                  <section className="p-5 rounded-3xl bg-[#FAF6F0]/95 border border-[#D3B48C]/40 shadow-md text-center space-y-3">
                    <MapPin className="h-5 w-5 mx-auto text-[#4E8281]" />
                    <div>
                      <h4 className="text-sm font-bold text-[#4E8281] font-cinzel">{event.venueName}</h4>
                      <p className="text-[11px] text-[#778F8C]">{event.address}, {event.city}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="py-2 rounded-full text-white bg-[#4E8281] font-bold flex items-center justify-center gap-1 shadow">
                        <Navigation className="h-3 w-3" />
                        <span>Google Maps</span>
                      </div>
                      <div className="py-2 rounded-full text-[#4E8281] bg-white border border-[#4E8281] font-bold flex items-center justify-center gap-1 shadow-sm">
                        <Compass className="h-3 w-3" />
                        <span>Waze</span>
                      </div>
                    </div>
                  </section>

                  {/* QR PASS & CONFIRMATION */}
                  <section className="p-6 rounded-3xl bg-[#0F2424] text-white border-2 border-[#D3B48C] shadow-2xl text-center space-y-3">
                    <h4 className="text-sm font-bold text-[#D3B48C] font-cinzel tracking-wider">
                      Confirmar Asistencia
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Toca el botón para confirmar tus {currentGuest?.allowedCompanions} lugares.
                    </p>

                    {guestQrUrl && (
                      <div className="p-2.5 rounded-2xl bg-white inline-block shadow">
                        <img src={guestQrUrl} alt="QR Pase" className="h-24 w-24 object-contain mx-auto" />
                        <span className="text-[9px] font-mono font-bold text-[#4E8281] block mt-0.5">
                          Boleto #{currentGuest?.code}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      className="w-full py-3 rounded-full bg-[#4E8281] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Heart className="h-3.5 w-3.5 text-[#D3B48C]" />
                      <span>Confirmar Asistencia (RSVP)</span>
                    </button>
                  </section>

                </div>
              </div>
            </div>
          ) : (
            /* TEXT SIMULATOR: WhatsApp Chat Bubble */
            <div className="w-[340px] rounded-[36px] bg-[#0b141a] p-3.5 shadow-2xl border-4 border-[#D3B48C]/40 text-white space-y-3 relative overflow-hidden">
              <div className="h-4 w-28 bg-white/10 rounded-full mx-auto" />
              <div className="p-3 rounded-2xl bg-[#202c33] flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-[#4E8281] text-white flex items-center justify-center font-bold text-xs">
                  {currentGuest?.name?.charAt(0) || 'I'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentGuest?.name || 'Invitado'}</p>
                  <p className="text-[10px] text-emerald-400">en línea</p>
                </div>
              </div>

              <div className="p-3 h-80 rounded-2xl bg-[#0b141a] overflow-y-auto space-y-2.5 text-xs bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="p-3.5 rounded-2xl rounded-tr-none bg-[#005c4b] text-white ml-auto max-w-[90%] shadow space-y-1.5 leading-relaxed">
                  <p className="whitespace-pre-line text-[11px]">{compiledTextMessage}</p>
                  <span className="text-[9px] text-emerald-200 block text-right">18:30 ✓✓</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar a {currentGuest?.name?.split(' ')[0]}</span>
                </a>

                <button
                  onClick={handleCopyMessage}
                  className="w-full py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedText ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedText ? 'Copiado al portapapeles' : 'Copiar Texto'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
