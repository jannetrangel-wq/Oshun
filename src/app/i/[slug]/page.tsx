'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OshunLogo from '@/components/ui/OshunLogo';
import Modal from '@/components/ui/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  Shirt,
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  Navigation,
  Compass,
  Check,
  Crown,
  Star,
  Wine,
  Camera,
  Layers,
  Sparkle,
  Image as ImageIcon
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { Event, Guest } from '@/types';
import { generateQrDataUrl } from '@/lib/qr';
import { PREINSTALLED_AUDIO_TRACKS } from '@/lib/audio-tracks';
import confetti from 'canvas-confetti';
import BackgroundEffects from '@/components/invitation/BackgroundEffects';
import EnvelopeIntro from '@/components/invitation/EnvelopeIntro';
import FloatingAudioPlayer from '@/components/invitation/FloatingAudioPlayer';

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [confirmedGuestCode, setConfirmedGuestCode] = useState<string | null>(null);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'YES' | 'NO'>('YES');
  const [rsvpCompanionsCount, setRsvpCompanionsCount] = useState<number>(2);
  const [rsvpDietary, setRsvpDietary] = useState('');
  const [rsvpNotes, setRsvpNotes] = useState('');

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const currentEvent = InvitaStore.getEventBySlug(slug) || InvitaStore.getEvents()[0];
    if (currentEvent) {
      setEvent(currentEvent);
    }
  }, [slug]);

  // Countdown timer calculation
  useEffect(() => {
    if (!event) return;
    const target = new Date(event.design.sections.countdown?.targetDate || `${event.date}T${event.time}:00`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  const handleCopyClabe = (clabe: string) => {
    navigator.clipboard.writeText(clabe);
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2000);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !rsvpName.trim()) return;

    const guestCode = `OSH${Math.floor(100 + Math.random() * 900)}`;

    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      eventId: event.id,
      code: guestCode,
      name: rsvpName.trim(),
      phone: rsvpPhone.trim() || '+525500000000',
      group: 'General',
      status: rsvpAttending === 'YES' ? 'CONFIRMED' : 'DECLINED',
      allowedCompanions: rsvpCompanionsCount,
      confirmedCompanions: rsvpAttending === 'YES' ? rsvpCompanionsCount : 0,
      companionNames: [],
      dietaryRestrictions: rsvpDietary,
      notes: rsvpNotes,
      checkedIn: false,
    };

    InvitaStore.addGuest(event.id, newGuest);
    setConfirmedGuestCode(guestCode);

    if (rsvpAttending === 'YES') {
      const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com'}/i/${event.slug}/${guestCode}`;
      const qr = await generateQrDataUrl(url, { darkColor: '#0F2424', lightColor: '#FFFFFF', width: 220 });
      setQrDataUrl(qr);

      // Confetti celebration if microInteractions enabled
      if (event.design.effects?.microInteractions !== false) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4E8281', '#D3B48C', '#97B8B3', '#F4EDE2'],
        });
      }
    }

    setRsvpSuccess(true);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#97B8B3] flex items-center justify-center text-[#0F2424] font-semibold text-sm">
        Cargando invitación OSHUN...
      </div>
    );
  }

  const { design } = event;
  const activeAudioTrack = PREINSTALLED_AUDIO_TRACKS.find((t) => t.id === design.audio?.trackId) || PREINSTALLED_AUDIO_TRACKS[0];
  const resolvedAudioUrl = design.audio?.trackId === 'custom' && design.audio.customAudioUrl ? design.audio.customAudioUrl : (design.musicUrl || activeAudioTrack.audioUrl);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundColor: design.backgroundColor || '#FAF6F0',
        color: design.textColor || '#162E2D',
        fontFamily: design.fontFamilyBody || 'Montserrat, sans-serif',
      }}
    >
      {/* 1. Royal Gold Envelope Intro Simulation */}
      {design.effects?.hasEnvelopeIntro && !isEnvelopeOpened && (
        <EnvelopeIntro
          title={event.title}
          subtitle={design.sections.hero?.subtitle || 'Te invitamos a celebrar juntos'}
          dateText={`${event.date} • ${event.time} HRS`}
          onOpen={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* 2. Dynamic Background Particle Animation Engine */}
      <BackgroundEffects
        enabled={design.effects?.backgroundAnimation ?? true}
        animationType={design.effects?.animationType || 'petals'}
        intensity={design.effects?.animationIntensity || 'medium'}
      />

      {/* 3. Floating Audio Player Component */}
      <FloatingAudioPlayer
        audioUrl={resolvedAudioUrl}
        autoplay={design.audio?.musicAutoplay || design.musicAutoplay || false}
        enabled={design.effects?.soundEnabled ?? true}
        trackName={design.audio?.trackName || activeAudioTrack.name}
      />

      {/* 4. Main Public Invitation Container */}
      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-8 pb-32 relative z-10">
        
        {/* Top Emblem & Brand */}
        <div className="text-center space-y-2 pt-2">
          <OshunLogo variant="isotipo" size="md" />
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D3B48C] block font-cinzel">
            Invitación Oficial
          </span>
        </div>

        {/* HERO SECTION */}
        <section
          className="text-center space-y-4 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md border-2"
          style={{
            backgroundColor: design.cardBackground || 'rgba(250, 246, 240, 0.95)',
            borderColor: design.accentColor || '#D3B48C',
          }}
        >
          <p className="text-xs tracking-widest uppercase font-semibold text-[#778F8C]">
            {design.sections.hero?.subtitle || 'Te invitamos a celebrar juntos'}
          </p>

          <h1
            className="text-3xl sm:text-5xl font-bold tracking-widest leading-tight"
            style={{
              color: design.primaryColor || '#4E8281',
              fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif`,
            }}
          >
            {design.sections.hero?.title || event.title}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-bold pt-1">
            <span>{formatDate(event.date).toUpperCase()}</span>
            <span style={{ color: design.accentColor || '#D3B48C' }}>✦</span>
            <span>{event.time} HRS</span>
          </div>

          <div className="pt-2">
            <div
              className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border-2"
              style={{ borderColor: `${design.accentColor || '#D3B48C'}80` }}
            >
              <img
                src={design.coverImageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2424]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-xs text-white font-medium italic drop-shadow">
                  {event.venueName} • {event.city}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN SECTION */}
        {design.sections.countdown?.enabled !== false && (
          <section
            className="p-6 rounded-3xl shadow-xl text-center space-y-3 border"
            style={{
              backgroundColor: design.cardBackground || 'rgba(250, 246, 240, 0.95)',
              borderColor: `${design.accentColor || '#D3B48C'}60`,
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest block"
              style={{ color: design.accentColor || '#D3B48C', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
            >
              Solo Faltan
            </span>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { label: 'DÍAS', value: timeLeft.days },
                { label: 'HORAS', value: timeLeft.hours },
                { label: 'MINUTOS', value: timeLeft.minutes },
                { label: 'SEGUNDOS', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-[#EFE3D4]/50 border border-[#D3B48C]/30 text-center">
                  <span
                    className="text-2xl sm:text-3xl font-bold block leading-none"
                    style={{ color: design.primaryColor || '#4E8281', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
                  >
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-bold text-[#778F8C] tracking-wider uppercase mt-1 block">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXTENDED PHOTO GALLERY SECTION (IF MULTI-PHOTO TEMPLATE) */}
        {design.sections.gallery?.enabled !== false && (design.galleryCapacity || 1) > 1 && (design.galleryImages?.length || 0) > 1 && (
          <section
            className="p-7 rounded-3xl shadow-xl space-y-4 border"
            style={{
              backgroundColor: design.cardBackground || 'rgba(250, 246, 240, 0.95)',
              borderColor: `${design.accentColor || '#D3B48C'}60`,
            }}
          >
            <div className="text-center space-y-1">
              <span
                className="text-[10px] font-bold uppercase tracking-widest block"
                style={{ color: design.accentColor || '#D3B48C', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
              >
                Nuestros Momentos
              </span>
              <h3
                className="text-lg font-bold"
                style={{ color: design.primaryColor || '#4E8281', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
              >
                Galería de Recuerdos
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {design.galleryImages?.map((gUrl, idx) => (
                <div key={idx} className="h-32 sm:h-36 rounded-2xl overflow-hidden border border-[#D3B48C]/40 shadow-sm group">
                  <img
                    src={gUrl}
                    alt={`Galería ${idx + 1}`}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SCHEDULE */}
        {design.sections.schedule?.enabled !== false && (
          <section
            className="p-7 rounded-3xl shadow-xl space-y-4 border"
            style={{
              backgroundColor: design.cardBackground || 'rgba(250, 246, 240, 0.95)',
              borderColor: `${design.accentColor || '#D3B48C'}60`,
            }}
          >
            <div className="text-center space-y-1">
              <span
                className="text-[10px] font-bold uppercase tracking-widest block"
                style={{ color: design.accentColor || '#D3B48C', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
              >
                Cronograma
              </span>
              <h3
                className="text-lg font-bold"
                style={{ color: design.primaryColor || '#4E8281', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
              >
                Itinerario del Gran Día
              </h3>
            </div>
            <div className="divide-y divide-[#D3B48C]/20 pt-2">
              {design.sections.schedule?.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-start gap-4 text-xs">
                  <span
                    className="font-bold tracking-wider shrink-0 w-20 text-right"
                    style={{ color: design.primaryColor || '#4E8281', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
                  >
                    {item.time}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-[#778F8C] text-[11px]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LOCATION & MAPS */}
        {design.sections.location?.enabled !== false && (
          <section
            className="p-7 rounded-3xl shadow-xl text-center space-y-4 border"
            style={{
              backgroundColor: design.cardBackground || 'rgba(250, 246, 240, 0.95)',
              borderColor: `${design.accentColor || '#D3B48C'}60`,
            }}
          >
            <MapPin className="h-6 w-6 mx-auto" style={{ color: design.primaryColor || '#4E8281' }} />
            <div>
              <h3
                className="text-lg font-bold"
                style={{ color: design.primaryColor || '#4E8281', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
              >
                {event.venueName}
              </h3>
              <p className="text-xs text-[#778F8C]">{event.address}, {event.city}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={design.sections.location?.googleMapsUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-full text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
                style={{ backgroundColor: design.primaryColor || '#4E8281' }}
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Google Maps</span>
              </a>
              <a
                href={design.sections.location?.wazeUrl || 'https://waze.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-full text-xs font-bold bg-white border shadow-sm flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
                style={{ color: design.primaryColor || '#4E8281', borderColor: design.primaryColor || '#4E8281' }}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Waze</span>
              </a>
            </div>
          </section>
        )}

        {/* GIFT REGISTRY & BANK CLABE */}
        {design.sections.giftRegistry?.enabled !== false && (
          <section
            className="p-7 rounded-3xl shadow-xl text-center space-y-4 border"
            style={{
              backgroundColor: design.cardBackground || 'rgba(250, 246, 240, 0.95)',
              borderColor: `${design.accentColor || '#D3B48C'}60`,
            }}
          >
            <Gift className="h-6 w-6 mx-auto" style={{ color: design.accentColor || '#D3B48C' }} />
            <h3
              className="text-base font-bold"
              style={{ color: design.primaryColor || '#4E8281', fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
            >
              Mesa de Regalos
            </h3>
            <p className="text-xs text-[#778F8C]">El mejor regalo es tu compañía. Si deseas obsequiarnos un detalle:</p>
            <div className="p-3.5 rounded-2xl bg-[#EFE3D4]/80 border border-[#D3B48C]/40 flex items-center justify-between text-xs">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-[#4E8281] block">Transferencia BBVA</span>
                <span className="font-mono text-xs font-bold text-[#162E2D]">CLABE: 012180001234567890</span>
              </div>
              <button
                onClick={() => handleCopyClabe('012180001234567890')}
                className="px-3 py-1.5 rounded-full bg-[#4E8281] text-white text-[11px] font-bold shadow hover:bg-[#3E6D6C]"
              >
                {copiedClabe ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </section>
        )}

        {/* RSVP ACTION BUTTON */}
        <section className="p-8 rounded-3xl bg-[#0F2424] text-white border-2 border-[#D3B48C] shadow-2xl text-center space-y-4">
          <h3 className="text-xl font-bold tracking-wider text-[#D3B48C] font-cinzel">Confirmación de Asistencia</h3>
          <p className="text-xs text-slate-300">Confirma antes del 20 de Junio de 2026 para reservar tus lugares y atender detalles de banquete.</p>
          <button
            onClick={() => setIsRsvpOpen(true)}
            className="w-full py-4 rounded-full text-white font-bold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{ backgroundColor: design.primaryColor || '#4E8281' }}
          >
            <span>Confirmar Asistencia (RSVP)</span>
            <Heart className="h-4 w-4 text-[#D3B48C]" />
          </button>
        </section>

      </main>

      {/* RSVP Modal */}
      {renderRsvpModal()}
    </div>
  );

  function renderRsvpModal() {
    return (
      <Modal
        isOpen={isRsvpOpen}
        onClose={() => {
          setIsRsvpOpen(false);
          setRsvpSuccess(false);
        }}
        title="Confirmar Asistencia"
        subtitle={event?.title || 'Invitación Digital'}
        maxWidth="md"
      >
        {!rsvpSuccess ? (
          <form onSubmit={handleRsvpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#162E2D] mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Ej. Roberto Garza Sada"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D3B48C]/50 bg-[#FAF6F0] focus:ring-2 focus:ring-[#4E8281] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#162E2D] mb-1">Teléfono WhatsApp *</label>
              <input
                type="tel"
                required
                value={rsvpPhone}
                onChange={(e) => setRsvpPhone(e.target.value)}
                placeholder="+52 81 1234 5678"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#D3B48C]/50 bg-[#FAF6F0] focus:ring-2 focus:ring-[#4E8281] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#162E2D] mb-1">¿Asistirás al evento? *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpAttending('YES')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    rsvpAttending === 'YES' ? 'bg-[#4E8281] text-white border-[#4E8281]' : 'bg-[#FAF6F0] text-[#778F8C] border-[#D3B48C]/40'
                  }`}
                >
                  ✓ Sí, asistiré con gusto
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpAttending('NO')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    rsvpAttending === 'NO' ? 'bg-rose-600 text-white border-rose-600' : 'bg-[#FAF6F0] text-[#778F8C] border-[#D3B48C]/40'
                  }`}
                >
                  ✕ No podré asistir
                </button>
              </div>
            </div>
            {rsvpAttending === 'YES' && (
              <div>
                <label className="block text-xs font-bold text-[#162E2D] mb-1">Total de Personas (Incluyéndote)</label>
                <select
                  value={rsvpCompanionsCount}
                  onChange={(e) => setRsvpCompanionsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D3B48C]/50 bg-[#FAF6F0] outline-none"
                >
                  <option value={1}>1 Pase (Solo yo)</option>
                  <option value={2}>2 Pases (Con acompañante)</option>
                  <option value={3}>3 Pases</option>
                  <option value={4}>4 Pases (Familia)</option>
                </select>
              </div>
            )}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Enviar Confirmación
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#162E2D] font-cinzel">
              {rsvpAttending === 'YES' ? '¡Asistencia Confirmada!' : 'Gracias por avisarnos'}
            </h3>
            <p className="text-xs text-[#778F8C]">
              {rsvpAttending === 'YES'
                ? `Hemos registrado tu confirmación con ${rsvpCompanionsCount} pases. Tu código de acceso es #${confirmedGuestCode}.`
                : 'Lamentamos que no puedas acompañarnos, gracias por informarnos.'}
            </p>
            {qrDataUrl && (
              <div className="p-3 rounded-2xl bg-white border border-[#D3B48C]/40 inline-block shadow">
                <img src={qrDataUrl} alt="QR" className="h-36 w-36 mx-auto" />
                <span className="text-[10px] font-mono font-bold text-[#4E8281] block mt-1">Pase #{confirmedGuestCode}</span>
              </div>
            )}
            <button
              onClick={() => {
                setIsRsvpOpen(false);
                setRsvpSuccess(false);
              }}
              className="w-full py-2.5 rounded-full bg-[#EFE3D4] text-[#162E2D] text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    );
  }
}
