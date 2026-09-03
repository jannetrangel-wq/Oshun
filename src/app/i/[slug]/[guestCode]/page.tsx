'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Gift,
  Shirt,
  Navigation,
  Compass,
  Download,
  Share2,
  Heart,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvitaStore } from '@/lib/store';
import { Event, Guest } from '@/types';
import { formatDate } from '@/lib/utils';
import { generateQrDataUrl } from '@/lib/qr';
import Modal from '@/components/ui/Modal';

export default function PersonalizedGuestInvitationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const guestCode = params.guestCode as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // RSVP Modal
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<'YES' | 'NO'>('YES');
  const [rsvpCompanionsCount, setRsvpCompanionsCount] = useState(1);
  const [rsvpDietary, setRsvpDietary] = useState('Ninguna');
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  useEffect(() => {
    const currentEvent = InvitaStore.getEventBySlug(slug) || InvitaStore.getEvents()[0];
    if (currentEvent) {
      setEvent(currentEvent);
      const foundGuest = InvitaStore.getGuestByCode(currentEvent.id, guestCode) || InvitaStore.getGuestsForEvent(currentEvent.id)[0];
      if (foundGuest) {
        setGuest(foundGuest);
        setRsvpCompanionsCount(foundGuest.confirmedCompanions || foundGuest.allowedCompanions || 1);
        setRsvpDietary(foundGuest.dietaryRestrictions || 'Ninguna');

        // Generar QR para este boleto
        const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com'}/i/${currentEvent.slug}/${foundGuest.code}`;
        generateQrDataUrl(url, { darkColor: '#0F2424', lightColor: '#FFFFFF', width: 260 }).then((qr) => {
          setQrDataUrl(qr);
        });
      }
    }
  }, [slug, guestCode]);

  // Countdown timer calculation
  useEffect(() => {
    if (!event) return;
    const target = new Date(event.design.sections.countdown.targetDate || `${event.date}T${event.time}:00`).getTime();

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

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !guest) return;

    const res = InvitaStore.recordRsvp(
      event.id,
      guest.id,
      rsvpAttending === 'YES' ? 'CONFIRMED' : 'DECLINED',
      rsvpAttending === 'YES' ? rsvpCompanionsCount : 0,
      [],
      rsvpDietary,
      rsvpNotes
    );

    if (res.guest) {
      setGuest(res.guest);
    }

    if (rsvpAttending === 'YES') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4E8281', '#D3B48C', '#97B8B3', '#F4EDE2'],
      });
    }

    setRsvpSuccess(true);
  };

  if (!event || !guest) {
    return (
      <div className="min-h-screen bg-[#97B8B3] flex items-center justify-center text-[#0F2424] font-semibold text-sm">
        Cargando tu invitación personalizada OSHUN...
      </div>
    );
  }

  const { design } = event;
  const sections = design.sections;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundColor: design.backgroundColor || '#97B8B3',
        color: design.textColor || '#162E2D',
        fontFamily: `${design.fontFamilyBody || 'Montserrat'}, sans-serif`,
      }}
    >
      {/* Floating Music Toggle */}
      <button
        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-[#D3B48C]/50"
        style={{ backgroundColor: design.primaryColor || '#4E8281', color: '#FFFFFF' }}
        aria-label="Música de fondo"
      >
        {isPlayingMusic ? <Volume2 className="h-5 w-5 animate-pulse" /> : <VolumeX className="h-5 w-5" />}
      </button>

      <main className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-8 pb-32">
        {/* Top Brand Logo */}
        <div className="text-center space-y-2 pt-2">
          <OshunLogo variant="isotipo" size="lg" />
          <span
            className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#0F2424] block"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Invitación Digital Personalizada
          </span>
        </div>

        {/* 1. PERSONALIZED GREETING BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6F0]/95 border-2 border-[#D3B48C] shadow-2xl text-center space-y-3 backdrop-blur-md animate-in fade-in">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D3B48C]">
            <span>✦</span>
            <span>Pase Reservado #{guest.code}</span>
            <span>✦</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-bold text-[#4E8281]"
            style={{ fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
          >
            ¡Hola, {guest.name}!
          </h2>

          <p className="text-xs text-[#162E2D] leading-relaxed">
            Con gran ilusión te invitamos a celebrar juntos. Tenemos reservados{' '}
            <strong>{guest.allowedCompanions} {guest.allowedCompanions > 1 ? 'pases' : 'pase'}</strong>{' '}
            especialmente para ti en nuestra celebración.
          </p>

          {/* Current RSVP Status Pill */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                guest.status === 'CONFIRMED'
                  ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/40'
                  : guest.status === 'DECLINED'
                  ? 'bg-rose-500/10 text-rose-800 border-rose-500/40'
                  : 'bg-amber-500/10 text-amber-800 border-amber-500/40'
              }`}
            >
              {guest.status === 'CONFIRMED'
                ? `✓ Confirmaste ${guest.confirmedCompanions} ${guest.confirmedCompanions > 1 ? 'pases' : 'pase'}`
                : guest.status === 'DECLINED'
                ? '✕ Declinaste la invitación'
                : '⏳ Asistencia Pendiente de Confirmar'}
            </span>
          </div>
        </div>

        {/* 2. HERO SECTION */}
        <section className="text-center space-y-4 p-6 sm:p-8 rounded-3xl bg-[#FAF6F0]/95 border-2 border-[#D3B48C]/50 shadow-2xl backdrop-blur-md">
          <p className="text-xs tracking-widest text-[#778F8C] uppercase font-semibold">
            {sections.hero.subtitle || 'Te invitamos a celebrar juntos'}
          </p>

          <h1
            className="text-3xl sm:text-5xl font-bold tracking-widest text-[#4E8281] leading-tight"
            style={{ fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
          >
            {event.title}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-bold text-[#162E2D] pt-1">
            <span>{formatDate(event.date).toUpperCase()}</span>
            <span className="text-[#D3B48C]">✦</span>
            <span>{event.time} HRS</span>
          </div>

          <div className="pt-2">
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border-2 border-[#D3B48C]/50 shadow-xl bg-[#EFE3D4]">
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

        {/* 3. COUNTDOWN TIMER */}
        <section className="p-6 rounded-3xl bg-[#FAF6F0]/95 border border-[#D3B48C] shadow-xl text-center space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D3B48C] font-cinzel">
            Solo Faltan
          </span>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { label: 'DÍAS', value: timeLeft.days },
              { label: 'HORAS', value: timeLeft.hours },
              { label: 'MINUTOS', value: timeLeft.minutes },
              { label: 'SEGUNDOS', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-2xl bg-[#EFE3D4]/70 border border-[#D3B48C]/30 text-center">
                <span className="text-2xl sm:text-3xl font-bold text-[#4E8281] block leading-none font-cinzel">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-[#778F8C] tracking-wider uppercase mt-1 block">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SCHEDULE */}
        {sections.schedule?.enabled && (
          <section className="p-7 rounded-3xl bg-[#FAF6F0]/95 border border-[#D3B48C] shadow-xl space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D3B48C] font-cinzel">Cronograma</span>
              <h3 className="text-lg font-bold text-[#4E8281] font-cinzel">Itinerario del Gran Día</h3>
            </div>
            <div className="divide-y divide-[#D3B48C]/20 pt-2">
              {sections.schedule.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-start gap-4 text-xs">
                  <span className="font-bold text-[#4E8281] tracking-wider shrink-0 w-20 text-right font-cinzel">{item.time}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#162E2D]">{item.title}</h4>
                    <p className="text-[#778F8C] text-[11px]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. LOCATION & NAVIGATION */}
        <section className="p-7 rounded-3xl bg-[#FAF6F0]/95 border border-[#D3B48C] shadow-xl text-center space-y-4">
          <MapPin className="h-6 w-6 mx-auto text-[#4E8281]" />
          <div>
            <h3 className="text-lg font-bold text-[#4E8281] font-cinzel">{event.venueName}</h3>
            <p className="text-xs text-[#778F8C]">{event.address}, {event.city}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={sections.location.googleMapsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-full text-xs font-bold text-white bg-[#4E8281] hover:bg-[#3E6D6C] shadow-md flex items-center justify-center gap-1.5"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Google Maps</span>
            </a>
            <a
              href={sections.location.wazeUrl || 'https://waze.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-full text-xs font-bold text-[#4E8281] bg-white border border-[#4E8281] shadow-sm flex items-center justify-center gap-1.5"
            >
              <Compass className="h-3.5 w-3.5 text-[#4E8281]" />
              <span>Waze</span>
            </a>
          </div>
        </section>

        {/* 6. DIGITAL QR PASS TICKET */}
        <div className="rounded-3xl bg-[#FAF6F0]/95 text-[#162E2D] p-6 sm:p-8 shadow-2xl space-y-5 text-center relative overflow-hidden border-2 border-[#D3B48C]">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#778F8C]">
              Boleto Oficial de Entrada
            </span>
            <h3
              className="text-xl font-bold text-[#4E8281]"
              style={{ fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
            >
              {event.title}
            </h3>
            <p className="text-xs text-[#778F8C] font-semibold">
              {formatDate(event.date)} • {event.time} hrs
            </p>
          </div>

          {/* QR Container */}
          <div className="p-3 bg-white border border-[#D3B48C]/40 rounded-2xl inline-block shadow-md">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR Code ${guest.code}`} className="h-44 w-44 mx-auto rounded-lg" />
            ) : (
              <div className="h-44 w-44 bg-slate-200" />
            )}
          </div>

          {/* Ticket Metadata */}
          <div className="grid grid-cols-2 gap-3 text-center pt-3 border-t border-[#D3B48C]/30">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#778F8C] block">Titular de la Invitación</span>
              <span className="text-xs font-bold text-[#162E2D] truncate block">{guest.name}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-[#778F8C] block">Lugares Reservados</span>
              <span className="text-xs font-bold text-[#4E8281] block">
                {guest.confirmedCompanions || guest.allowedCompanions} {((guest.confirmedCompanions || guest.allowedCompanions) > 1) ? 'Personas' : 'Persona'}
              </span>
            </div>
          </div>
        </div>

        {/* 7. DRESS CODE */}
        {sections.dressCode?.enabled && (
          <div className="p-6 rounded-3xl bg-[#FAF6F0]/95 border border-[#D3B48C]/40 shadow-xl space-y-3 text-center">
            <Shirt className="h-5 w-5 mx-auto text-[#D3B48C]" />
            <h4
              className="text-sm font-bold text-[#4E8281]"
              style={{ fontFamily: `${design.fontFamilyTitle || 'Cinzel'}, serif` }}
            >
              {sections.dressCode.type}
            </h4>
            <p className="text-xs text-[#778F8C]">{sections.dressCode.description}</p>
          </div>
        )}

        {/* 8. GIFT REGISTRY */}
        {sections.giftRegistry?.enabled && (
          <section className="p-7 rounded-3xl bg-[#FAF6F0]/95 border border-[#D3B48C] shadow-xl text-center space-y-4">
            <Gift className="h-6 w-6 mx-auto text-[#D3B48C]" />
            <h3 className="text-base font-bold text-[#4E8281] font-cinzel">Mesa de Regalos</h3>
            <p className="text-xs text-[#778F8C]">{sections.giftRegistry.description}</p>
            <div className="p-3.5 rounded-2xl bg-[#EFE3D4]/80 border border-[#D3B48C]/40 flex items-center justify-between text-xs">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-[#4E8281] block">Transferencia BBVA</span>
                <span className="font-mono text-xs font-bold text-[#162E2D]">CLABE: 012180001234567890</span>
              </div>
              <button
                onClick={() => handleCopyClabe('012180001234567890')}
                className="px-3 py-1.5 rounded-full bg-[#4E8281] text-white text-[11px] font-bold shadow"
              >
                {copiedClabe ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </section>
        )}

        {/* 9. RSVP CONFIRMATION BUTTON */}
        <section className="p-8 rounded-3xl bg-[#0F2424] text-white border-2 border-[#D3B48C] shadow-2xl text-center space-y-4">
          <h3 className="text-xl font-bold tracking-wider text-[#D3B48C] font-cinzel">Confirmación de Asistencia</h3>
          <p className="text-xs text-slate-300">
            {guest.status === 'CONFIRMED'
              ? `Ya confirmaste ${guest.confirmedCompanions} pases. Puedes modificar tu respuesta si lo necesitas.`
              : `Por favor confirma tus ${guest.allowedCompanions} lugares reservados.`}
          </p>
          <button
            onClick={() => setIsRsvpOpen(true)}
            className="w-full py-4 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-[#D3B48C]" />
            <span>{guest.status === 'CONFIRMED' ? 'Modificar Mi Confirmación' : 'Confirmar Mi Asistencia (RSVP)'}</span>
          </button>
        </section>
      </main>

      {/* RSVP MODAL FOR THIS GUEST */}
      <Modal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        title={rsvpSuccess ? '¡Confirmación Actualizada!' : 'Confirmar Asistencia'}
        subtitle={guest.name}
        maxWidth="sm"
      >
        {rsvpSuccess ? (
          <div className="text-center space-y-4 p-2 animate-in zoom-in-95">
            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-600" />
            <h4
              className="text-base font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              ¡Gracias, {guest.name}!
            </h4>
            <p className="text-xs text-[#778F8C]">
              {guest.status === 'CONFIRMED'
                ? `Tu asistencia ha quedado registrada con ${guest.confirmedCompanions} pases.`
                : 'Lamentamos que no puedas asistir. ¡Gracias por avisarnos!'}
            </p>
            <button
              onClick={() => {
                setIsRsvpOpen(false);
                setRsvpSuccess(false);
              }}
              className="w-full py-2.5 rounded-full bg-[#EFE3D4] text-xs font-bold text-[#162E2D]"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1.5">¿Asistirás al Evento?</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRsvpAttending('YES')}
                  className={`py-2 rounded-full font-bold border flex items-center justify-center gap-1.5 ${
                    rsvpAttending === 'YES'
                      ? 'bg-[#4E8281] text-white border-[#4E8281]'
                      : 'bg-white text-[#778F8C] border-[#D3B48C]/40'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>SÍ ASISTIRÉ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpAttending('NO')}
                  className={`py-2 rounded-full font-bold border flex items-center justify-center gap-1.5 ${
                    rsvpAttending === 'NO'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-[#778F8C] border-[#D3B48C]/40'
                  }`}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>NO PODRÉ</span>
                </button>
              </div>
            </div>

            {rsvpAttending === 'YES' && (
              <>
                <div>
                  <label className="block font-bold text-[#162E2D] mb-1">
                    Pases a Confirmar (Máx: {guest.allowedCompanions})
                  </label>
                  <select
                    value={rsvpCompanionsCount}
                    onChange={(e) => setRsvpCompanionsCount(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
                  >
                    {Array.from({ length: guest.allowedCompanions }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'Pase' : 'Pases'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#162E2D] mb-1">Restricciones Dietéticas</label>
                  <input
                    type="text"
                    value={rsvpDietary}
                    onChange={(e) => setRsvpDietary(e.target.value)}
                    placeholder="Vegetariano, Sin gluten, Ninguna..."
                    className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Mensaje para los Anfitriones</label>
              <textarea
                rows={2}
                value={rsvpNotes}
                onChange={(e) => setRsvpNotes(e.target.value)}
                placeholder="Un mensaje especial..."
                className="w-full rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#D3B48C]/30">
              <button
                type="button"
                onClick={() => setIsRsvpOpen(false)}
                className="px-4 py-2 rounded-full bg-[#EFE3D4] text-xs font-semibold text-[#162E2D]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#4E8281] text-white font-bold text-xs uppercase tracking-wider shadow"
              >
                Guardar Respuesta
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
