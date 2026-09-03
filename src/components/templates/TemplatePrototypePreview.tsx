'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import { TemplateDefinition } from '@/types';
import BackgroundEffects from '@/components/invitation/BackgroundEffects';
import EnvelopeIntro from '@/components/invitation/EnvelopeIntro';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  Mail,
  Music,
  Volume2,
  VolumeX,
  Navigation,
  Compass,
  Shirt,
  QrCode,
  Check,
  Palette,
  Layers,
  Crown,
  Moon,
  Sun,
  Wine,
  Feather,
  Star,
  Flame,
  Award,
  Sparkle,
  Camera,
  CheckCircle2,
  Building,
  Palmtree,
  SunMedium,
  Utensils,
  MessageCircleHeart
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TemplatePrototypePreviewProps {
  template: TemplateDefinition;
}

export default function TemplatePrototypePreview({ template }: TemplatePrototypePreviewProps) {
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [showEditGuides, setShowEditGuides] = useState<boolean>(true);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Audio Ref for cleanup on unmount and navigation
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Minimal Nude RSVP form state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpCompanions, setRsvpCompanions] = useState(2);
  const [rsvpAttending, setRsvpAttending] = useState<'YES' | 'NO'>('YES');
  const [dietaryOptions, setDietaryOptions] = useState<string[]>(['regular']);
  const [dietaryCustom, setDietaryCustom] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Botanical Garden Envelope & Music State
  const [botanicalEnvelopeOpen, setBotanicalEnvelopeOpen] = useState(false);
  const [botanicalEnvelopeFlapOpen, setBotanicalEnvelopeFlapOpen] = useState(false);
  const [botanicalCardExtracted, setBotanicalCardExtracted] = useState(false);
  const [botanicalEnvelopeFaded, setBotanicalEnvelopeFaded] = useState(false);
  const [botanicalIsPlaying, setBotanicalIsPlaying] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedBankClabe, setCopiedBankClabe] = useState(false);

  // Dramatic Intro & Scroll Animation State
  const [heroAnimated, setHeroAnimated] = useState(false);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  // Audio Cleanup on Unmount & Scroll Reset on Mount
  useEffect(() => {
    // Force scroll to top on mount
    window.scrollTo(0, 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // 0.5s initial delay for rendering before starting the 2.2s dramatic slide-up
    const timer = setTimeout(() => {
      setHeroAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [template?.id]);

  const handleStopAudioAndNavigate = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  // Scroll observer helper
  const handleSectionIntersection = (key: string) => {
    setVisibleSections((prev) => ({ ...prev, [key]: true }));
  };

  const design = template?.defaultDesign || {};

  // Safe Default Sections with 100% complete mock data & defensive optional chaining
  const sections = {
    hero: {
      enabled: design?.sections?.hero?.enabled ?? true,
      title: design?.sections?.hero?.title || (template?.id === 'botanical-garden' ? 'Valeria & Sebastián' : 'Elena & Mateo'),
      subtitle: design?.sections?.hero?.subtitle || 'Te invitamos a celebrar juntos',
      dateText: design?.sections?.hero?.dateText || 'Sábado 14 de Noviembre, 2026',
      timeText: design?.sections?.hero?.timeText || '16:00 HRS',
      backgroundImage: design?.sections?.hero?.backgroundImage || design?.coverImageUrl || template?.previewImage || '',
    },
    countdown: {
      enabled: design?.sections?.countdown?.enabled ?? true,
      targetDate: design?.sections?.countdown?.targetDate || '2026-11-14T16:00:00',
    },
    story: {
      enabled: design?.sections?.story?.enabled ?? true,
      title: design?.sections?.story?.title || 'Nuestra Historia',
      content: design?.sections?.story?.content || 'Un amor que florece en todas las estaciones...',
      image: design?.sections?.story?.image || design?.coverImageUrl || template?.previewImage || '',
    },
    schedule: {
      enabled: design?.sections?.schedule?.enabled ?? true,
      title: design?.sections?.schedule?.title || 'Itinerario del Gran Día',
      items: design?.sections?.schedule?.items || [
        { time: '16:00 HRS', title: 'Ceremonia Religiosa', description: 'Parroquia de San Miguel Arcángel' },
        { time: '18:30 HRS', title: 'Recepción & Banquete', description: 'Hacienda de los Eucaliptos' },
        { time: '21:00 HRS', title: 'Brindis & Baile', description: 'Pista Principal' },
      ],
    },
    location: {
      enabled: design?.sections?.location?.enabled ?? true,
      title: design?.sections?.location?.title || 'Ubicación del Evento',
      venueName: design?.sections?.location?.venueName || 'Hacienda de los Eucaliptos',
      address: design?.sections?.location?.address || 'Carretera San Miguel - Dolores Km 8',
      city: design?.sections?.location?.city || 'San Miguel de Allende, Guanajuato',
      googleMapsUrl: design?.sections?.location?.googleMapsUrl || 'https://maps.google.com/?q=San+Miguel+de+Allende+Guanajuato',
      wazeUrl: design?.sections?.location?.wazeUrl || 'https://waze.com/ul?q=San+Miguel+de+Allende+Guanajuato',
    },
    gallery: {
      enabled: design?.sections?.gallery?.enabled ?? true,
      title: design?.sections?.gallery?.title || 'Galería de Recuerdos',
      images: design?.sections?.gallery?.images || design?.galleryImages || [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      ],
    },
    dressCode: {
      enabled: design?.sections?.dressCode?.enabled ?? true,
      title: design?.sections?.dressCode?.title || 'Código de Vestimenta',
      type: design?.sections?.dressCode?.type || 'Boho Chic / Guayabera & Vestido de Fiesta',
      description: design?.sections?.dressCode?.description || 'Hombres: Guayabera o traje formal. Mujeres: Vestido en tonos salvia o florales.',
      colors: design?.sections?.dressCode?.colors || ['#8A9A86', '#4A5D4E', '#D3B48C', '#FDFBF7'],
    },
    giftRegistry: {
      enabled: design?.sections?.giftRegistry?.enabled ?? true,
      title: design?.sections?.giftRegistry?.title || 'Mesa de Regalos',
      description: design?.sections?.giftRegistry?.description || 'El mejor regalo es tu compañía.',
      items: design?.sections?.giftRegistry?.items || [],
    },
    rsvp: {
      enabled: design?.sections?.rsvp?.enabled ?? true,
      title: design?.sections?.rsvp?.title || 'Confirmación de Asistencia (RSVP)',
      deadline: design?.sections?.rsvp?.deadline || '2026-10-01',
      maxCompanionsPerGuest: design?.sections?.rsvp?.maxCompanionsPerGuest || 2,
      allowDietaryRestrictions: true,
      customMessage: design?.sections?.rsvp?.customMessage || 'Agradecemos confirmar tu asistencia antes del 1 de Octubre.',
    },
    qrPass: {
      enabled: design?.sections?.qrPass?.enabled ?? true,
      title: design?.sections?.qrPass?.title || 'Pase Digital Botánico',
      instructions: design?.sections?.qrPass?.instructions || 'Presenta este código al ingresar.',
    },
  };

  // Editable Guide Tag Component
  const EditBadge = ({
    label,
    position = 'top-right',
    theme = 'dark',
  }: {
    label: string;
    position?: 'top-right' | 'top-left' | 'inline' | 'center';
    theme?: 'dark' | 'gold' | 'light';
  }) => {
    if (!showEditGuides) return null;

    if (position === 'inline') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F2424] text-[#D3B48C] border border-[#D3B48C]/60 shadow-md animate-pulse ml-2 align-middle">
          <Edit3 className="h-2.5 w-2.5 text-[#D3B48C]" />
          <span>Editable</span>
        </span>
      );
    }

    const posClasses = {
      'top-right': 'top-3 right-3',
      'top-left': 'top-3 left-3',
      'center': 'top-3 left-1/2 -translate-x-1/2',
      'inline': '',
    }[position];

    return (
      <div className={`absolute z-30 ${posClasses} pointer-events-none animate-in fade-in zoom-in-90 duration-300`}>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-xl backdrop-blur-md border ${
            theme === 'gold'
              ? 'bg-[#D3B48C] text-[#0F2424] border-white/40'
              : 'bg-[#0F2424]/90 text-white border-[#D3B48C]'
          }`}
        >
          <Edit3 className={`h-3 w-3 ${theme === 'gold' ? 'text-[#0F2424]' : 'text-[#D3B48C]'}`} />
          <span>Editable: {label}</span>
        </div>
      </div>
    );
  };

  const toggleDietaryOption = (opt: string) => {
    if (opt === 'regular') {
      setDietaryOptions(['regular']);
      return;
    }
    const filtered = dietaryOptions.filter((x) => x !== 'regular');
    if (filtered.includes(opt)) {
      const next = filtered.filter((x) => x !== opt);
      setDietaryOptions(next.length ? next : ['regular']);
    } else {
      setDietaryOptions([...filtered, opt]);
    }
  };

  const handleMinimalRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#A89F91', '#7A6E60', '#F5F2EB', '#D3B48C'],
      });
    } catch (err) {
      // ignore
    }

    setRsvpSubmitted(true);
  };

  /* ========================================================================= */
  /* 1. MINIMAL NUDE: PERFECCIÓN ESCANDINAVA CON INTRO DRAMÁTICA & RSVP FULL    */
  /* ========================================================================= */
  const renderMinimalNude = () => (
    <div className="max-w-xl mx-auto px-6 py-12 space-y-20 pb-40 text-center text-[#3A332C]">
      
      {/* 1. Portada / Hero con ANIMACIÓN DRAMÁTICA (80px Slide-Up + Fade-In, Delay 0.5s, 2.2s Duration) */}
      <section
        className={`space-y-6 relative transition-dramatic-nude ${
          heroAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[80px]'
        }`}
      >
        <EditBadge label="Nombres, Título & Fecha" position="top-right" />
        
        {/* Subtle Top Monogram / Logo */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#A89F91] font-semibold block">
            {sections?.hero?.subtitle || 'TE INVITAMOS A CELEBRAR JUNTOS'}
          </span>
          <div className="w-10 h-px bg-[#A89F91]/50 mx-auto my-3" />
        </div>

        {/* Nombres de los novios en Serif ultra-delgada */}
        <h1
          className="text-4xl sm:text-6xl font-normal tracking-wide text-[#3A332C] leading-none"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {sections?.hero?.title || 'ELENA & MATEO'}
        </h1>

        {/* Fecha y Hora con espacio visual amplio */}
        <div className="text-xs uppercase font-medium tracking-[0.25em] text-[#7A6E60] space-y-1">
          <p className="text-sm tracking-[0.28em]">{sections?.hero?.dateText}</p>
          <p className="text-[11px] text-[#A89F91]">{sections?.hero?.timeText}</p>
        </div>

        {/* Fotografía editorial vertical destacada */}
        <div className="relative mx-auto max-w-sm h-96 sm:h-[430px] rounded-none border border-[#E5DFD5] overflow-hidden p-2.5 bg-white shadow-xs">
          <EditBadge label="Fotografía Editorial de Portada" position="top-left" />
          <img
            src={design?.coverImageUrl || 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80'}
            alt="Elena & Mateo"
            className="h-full w-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </section>

      {/* 2. Cuenta Regresiva en Vivo (Diseño de números delgados con tipografía Serif) */}
      {sections?.countdown?.enabled !== false && (
        <section
          onMouseEnter={() => handleSectionIntersection('countdown')}
          className="space-y-4 max-w-md mx-auto py-8 border-y border-[#E5DFD5] transition-dramatic-nude"
        >
          <EditBadge label="Cuenta Regresiva Serif" position="top-right" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
            Tiempo para el gran día
          </span>
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { label: 'DÍAS', value: '142' },
              { label: 'HORAS', value: '08' },
              { label: 'MINUTOS', value: '35' },
              { label: 'SEGUNDOS', value: '20' },
            ].map((t, idx) => (
              <div key={idx} className="p-3 bg-white/80 border border-[#E5DFD5] text-center space-y-1">
                <span
                  className="text-3xl font-light text-[#3A332C] block leading-none"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {t.value}
                </span>
                <span className="text-[8px] tracking-[0.2em] font-semibold text-[#A89F91] uppercase block">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mensaje & Historia */}
      <section className="space-y-3 max-w-md mx-auto text-center relative py-4 transition-dramatic-nude">
        <EditBadge label="Mensaje & Historia" position="top-right" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
          Nuestra Historia
        </span>
        <p
          className="text-base sm:text-lg italic text-[#3A332C] leading-relaxed font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          «{sections?.story?.content}»
        </p>
      </section>

      {/* 3. Galería de Fotos (Cuadrícula limpia de fotos en tonos sepia/nude) */}
      {sections?.gallery?.enabled !== false && (
        <section className="space-y-4 relative transition-dramatic-nude">
          <EditBadge label="Galería Cuadrícula Nude" position="top-right" />
          <div className="text-center space-y-1">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
              Momentos
            </span>
            <h3
              className="text-2xl font-light text-[#3A332C]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {sections?.gallery?.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {sections?.gallery?.images?.map((gImg, idx) => (
              <div
                key={idx}
                className="h-40 sm:h-48 overflow-hidden bg-white border border-[#E5DFD5] p-1 shadow-2xs group"
              >
                <img
                  src={gImg}
                  alt={`Recuerdo ${idx + 1}`}
                  className="h-full w-full object-cover grayscale-[10%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Itinerario del Evento (Línea de tiempo vertical minimalista con puntos delgados) */}
      {sections?.schedule?.enabled !== false && (
        <section className="space-y-6 max-w-md mx-auto text-left relative py-6 border-t border-[#E5DFD5] transition-dramatic-nude">
          <EditBadge label="Línea de Tiempo Minimalista" position="top-right" />
          <div className="text-center space-y-1">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
              Cronograma
            </span>
            <h3
              className="text-2xl font-light text-[#3A332C]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {sections?.schedule?.title}
            </h3>
          </div>

          <div className="relative pl-6 space-y-6 border-l border-[#A89F91]/40 ml-4 pt-2">
            {sections?.schedule?.items?.map((item, idx) => (
              <div key={idx} className="relative space-y-0.5">
                {/* Thin Center Dot */}
                <div className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-[#7A6E60] border-2 border-[#F5F2EB]" />
                
                <span
                  className="text-sm font-semibold text-[#7A6E60] block tracking-wider"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {item.time}
                </span>
                <h4 className="text-xs font-semibold text-[#3A332C] uppercase tracking-wider">{item.title}</h4>
                <p className="text-[11px] text-[#7A6E60]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Ubicación Integrada (Dirección, mapa limpio y botones Google Maps / Waze) */}
      {sections?.location?.enabled !== false && (
        <section className="space-y-4 max-w-md mx-auto text-center relative py-6 border-t border-[#E5DFD5] transition-dramatic-nude">
          <EditBadge label="Ubicación & Mapas" position="top-right" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
            Lugar de la Celebración
          </span>
          <h3
            className="text-2xl font-light text-[#3A332C]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {sections?.location?.venueName}
          </h3>
          <p className="text-xs text-[#7A6E60] tracking-wide">
            {sections?.location?.address} • {sections?.location?.city}
          </p>

          {/* Clean Map Preview Box */}
          <div className="relative h-44 rounded-none border border-[#E5DFD5] overflow-hidden bg-white/70 p-1 flex items-center justify-center">
            <div className="text-center space-y-1 p-4">
              <MapPin className="h-6 w-6 mx-auto text-[#7A6E60]" />
              <p className="text-xs font-semibold text-[#3A332C]">{sections?.location?.venueName}</p>
              <p className="text-[10px] text-[#A89F91]">Valle de Bravo, Estado de México</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={sections?.location?.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-white/90 hover:bg-white border border-[#A89F91] text-[#3A332C] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Navigation className="h-3 w-3 text-[#7A6E60]" />
              <span>Google Maps</span>
            </a>
            <a
              href={sections?.location?.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-white/90 hover:bg-white border border-[#A89F91] text-[#3A332C] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="h-3 w-3 text-[#7A6E60]" />
              <span>Waze</span>
            </a>
          </div>
        </section>
      )}

      {/* Código de Vestimenta */}
      {sections?.dressCode?.enabled !== false && (
        <section className="space-y-2 max-w-md mx-auto text-center relative py-6 border-t border-[#E5DFD5] transition-dramatic-nude">
          <EditBadge label="Dress Code" position="top-right" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
            Código de Vestimenta
          </span>
          <h4
            className="text-xl font-light text-[#3A332C]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {sections?.dressCode?.type}
          </h4>
          <p className="text-xs text-[#7A6E60] leading-relaxed">
            {sections?.dressCode?.description}
          </p>
          <div className="flex justify-center gap-2 pt-2">
            {sections?.dressCode?.colors?.map((c, i) => (
              <div key={i} className="h-5 w-5 rounded-full border border-[#A89F91]/50 shadow-2xs" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Formulario de Confirmación RSVP con REQUERIMIENTOS ALIMENTICIOS & MENSAJE */}
      <section className="space-y-5 max-w-md mx-auto text-center relative py-8 border-t border-[#E5DFD5] transition-dramatic-nude">
        <EditBadge label="Formulario RSVP Completo" position="top-right" />
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
            Confirmación
          </span>
          <h3
            className="text-2xl font-light text-[#3A332C]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {sections?.rsvp?.title}
          </h3>
          <p className="text-xs text-[#7A6E60]">{sections?.rsvp?.customMessage}</p>
        </div>

        {!rsvpSubmitted ? (
          <form onSubmit={handleMinimalRsvpSubmit} className="space-y-4 text-left pt-2">
            {/* Nombre Completo */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A6E60] block mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Ej. Sofía Villarreal"
                className="w-full px-3.5 py-2 rounded-none bg-white/80 border border-[#A89F91]/50 text-xs text-[#3A332C] outline-none focus:border-[#7A6E60] transition-colors"
              />
            </div>

            {/* Teléfono WhatsApp */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A6E60] block mb-1">
                Teléfono WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={rsvpPhone}
                onChange={(e) => setRsvpPhone(e.target.value)}
                placeholder="+52 81 8392 0192"
                className="w-full px-3.5 py-2 rounded-none bg-white/80 border border-[#A89F91]/50 text-xs text-[#3A332C] outline-none focus:border-[#7A6E60] transition-colors"
              />
            </div>

            {/* Asistencia */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A6E60] block mb-1">
                ¿Asistirás al evento? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpAttending('YES')}
                  className={`py-2 text-xs uppercase tracking-wider font-semibold border transition-all ${
                    rsvpAttending === 'YES'
                      ? 'bg-[#7A6E60] text-white border-[#7A6E60]'
                      : 'bg-white/80 text-[#3A332C] border-[#A89F91]/50'
                  }`}
                >
                  ✓ Asistiré con gusto
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpAttending('NO')}
                  className={`py-2 text-xs uppercase tracking-wider font-semibold border transition-all ${
                    rsvpAttending === 'NO'
                      ? 'bg-[#A89F91] text-white border-[#A89F91]'
                      : 'bg-white/80 text-[#3A332C] border-[#A89F91]/50'
                  }`}
                >
                  ✕ No podré asistir
                </button>
              </div>
            </div>

            {rsvpAttending === 'YES' && (
              <>
                {/* Cantidad de Pases */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A6E60] block mb-1">
                    Número de Pases Requeridos:
                  </label>
                  <select
                    value={rsvpCompanions}
                    onChange={(e) => setRsvpCompanions(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-none bg-white/80 border border-[#A89F91]/50 text-xs text-[#3A332C] outline-none"
                  >
                    <option value={1}>1 Pase (Individual)</option>
                    <option value={2}>2 Pases (Con acompañante)</option>
                    <option value={3}>3 Pases</option>
                    <option value={4}>4 Pases (Familia)</option>
                  </select>
                </div>

                {/* REQUERIMIENTOS ALIMENTICIOS / DIETAS & ALERGIAS */}
                <div className="space-y-2 p-3.5 bg-white/60 border border-[#E5DFD5]">
                  <div className="flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-[#7A6E60]" />
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A6E60]">
                      Requerimientos Alimenticios / Alergias:
                    </label>
                  </div>
                  <p className="text-[10px] text-[#A89F91]">
                    Selecciona las opciones que apliquen para ti o tus acompañantes:
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { id: 'regular', label: 'Menú Tradicional' },
                      { id: 'vegetariano', label: 'Vegetariano' },
                      { id: 'vegano', label: 'Vegano' },
                      { id: 'celiaco', label: 'Sin Gluten (Celíaco)' },
                      { id: 'mariscos', label: 'Alergia a Mariscos' },
                      { id: 'lactosa', label: 'Sin Lactosa' },
                      { id: 'nueces', label: 'Alergia a Frutos Secos' },
                    ].map((chip) => {
                      const active = dietaryOptions.includes(chip.id);
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => toggleDietaryOption(chip.id)}
                          className={`px-2.5 py-1 text-[10px] font-semibold border transition-all ${
                            active
                              ? 'bg-[#7A6E60] text-white border-[#7A6E60]'
                              : 'bg-white/80 text-[#7A6E60] border-[#A89F91]/40 hover:bg-white'
                          }`}
                        >
                          {active && '✓ '}
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Detalle específico de alergia o dieta */}
                  <div className="pt-1.5">
                    <input
                      type="text"
                      value={dietaryCustom}
                      onChange={(e) => setDietaryCustom(e.target.value)}
                      placeholder="Especificar otra alergia o requerimiento especial..."
                      className="w-full px-3 py-1.5 text-[11px] bg-white border border-[#A89F91]/40 text-[#3A332C] outline-none"
                    />
                  </div>
                </div>

                {/* MENSAJE OPCIONAL PARA LOS NOVIOS / ANFITRIONES */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageCircleHeart className="h-3.5 w-3.5 text-[#7A6E60]" />
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A6E60]">
                      Mensaje o Dedicatoria para los Novios (Opcional):
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Escribe tus buenos deseos para Elena & Mateo..."
                    className="w-full px-3.5 py-2 rounded-none bg-white/80 border border-[#A89F91]/50 text-xs text-[#3A332C] outline-none focus:border-[#7A6E60] transition-colors resize-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#7A6E60] hover:bg-[#685D50] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors mt-2 shadow-xs"
            >
              Enviar Confirmación
            </button>
          </form>
        ) : (
          <div className="p-6 bg-white border border-[#A89F91]/40 text-center space-y-2">
            <Check className="h-7 w-7 text-[#7A6E60] mx-auto" />
            <p
              className="text-xl font-light text-[#3A332C]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              ¡Gracias, {rsvpName}!
            </p>
            <p className="text-xs text-[#7A6E60]">
              Hemos registrado tu confirmación{rsvpAttending === 'YES' ? ` (${rsvpCompanions} pases)` : ''} y requerimientos alimenticios.
            </p>
            {rsvpMessage && (
              <p className="text-[11px] italic text-[#A89F91] pt-2 border-t border-[#E5DFD5]">
                «{rsvpMessage}»
              </p>
            )}
          </div>
        )}
      </section>

    </div>
  );

  // Botanical RSVP state
  const [botanicalName, setBotanicalName] = useState('');
  const [botanicalPhone, setBotanicalPhone] = useState('');
  const [botanicalCompanions, setBotanicalCompanions] = useState(2);
  const [botanicalAttending, setBotanicalAttending] = useState<'YES' | 'NO'>('YES');
  const [botanicalDietary, setBotanicalDietary] = useState<string[]>(['regular']);
  const [botanicalDietaryCustom, setBotanicalDietaryCustom] = useState('');
  const [botanicalMessage, setBotanicalMessage] = useState('');
  const [botanicalSubmitted, setBotanicalSubmitted] = useState(false);

  const toggleBotanicalDietary = (opt: string) => {
    if (opt === 'regular') {
      setBotanicalDietary(['regular']);
      return;
    }
    const filtered = botanicalDietary.filter((x) => x !== 'regular');
    if (filtered.includes(opt)) {
      const next = filtered.filter((x) => x !== opt);
      setBotanicalDietary(next.length ? next : ['regular']);
    } else {
      setBotanicalDietary([...filtered, opt]);
    }
  };

  const handleOpenBotanicalEnvelope = () => {
    // 1. Play audio immediately
    try {
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3');
        audio.loop = true;
        audioRef.current = audio;
      }
      audio.play().then(() => {
        setBotanicalIsPlaying(true);
      }).catch(() => {
        setBotanicalIsPlaying(true);
      });
    } catch (e) {
      setBotanicalIsPlaying(true);
    }

    // 2. Animate 3D Flap opening
    setBotanicalEnvelopeFlapOpen(true);

    // 3. Extract invitation card upward after flap opens
    setTimeout(() => {
      setBotanicalCardExtracted(true);
    }, 400);

    // 4. Fade out envelope overlay and reveal full invitation
    setTimeout(() => {
      setBotanicalEnvelopeFaded(true);
    }, 1100);

    setTimeout(() => {
      setBotanicalEnvelopeOpen(true);
      setHeroAnimated(true);

      // 5. Strictly scroll to top (Hero/Portada)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1600);
  };

  const toggleBotanicalMusic = () => {
    if (audioRef.current) {
      if (botanicalIsPlaying) {
        audioRef.current.pause();
        setBotanicalIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setBotanicalIsPlaying(true)).catch(() => {});
      }
    } else {
      setBotanicalIsPlaying(!botanicalIsPlaying);
    }
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText('012180015678901234');
    setCopiedBankClabe(true);
    setTimeout(() => setCopiedBankClabe(false), 3000);
  };

  const handleBotanicalRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botanicalName.trim()) return;

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#8A9A86', '#4A5D4E', '#D3B48C', '#FDFBF7', '#C0D3CC'],
      });
    } catch (err) {
      // ignore
    }

    setBotanicalSubmitted(true);
  };

  /* ========================================================================= */
  /* 2. BOTANICAL GARDEN: SOBRE DIGITAL 3D REALISTA & 8 MÓDULOS EN ORDEN       */
  /* ========================================================================= */
  const renderBotanicalGarden = () => {
    // VISTA 1: SOBRE DE GALA CENTRADO (ESTÉTICA DE PAPELERÍA DE LUJO)
    if (!botanicalEnvelopeOpen) {
      return (
        <div
          className={`botanical-pattern-bg w-full min-h-[760px] flex flex-col items-center justify-center p-4 text-[#2D3B30] selection:bg-[#8A9A86] selection:text-white transition-all duration-700 ${
            botanicalEnvelopeFaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Contenedor del Sobre 3D Centrado */}
          <div className="perspective-1000 w-full max-w-[370px] mx-auto text-center space-y-5 my-auto flex flex-col items-center justify-center">
            
            <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#8A9A86] block">
                INVITACIÓN DIGITAL DE GALA
              </span>
              <h2
                className="text-2xl sm:text-3xl font-normal italic text-[#2D3B30]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Valeria & Sebastián
              </h2>
            </div>

            {/* Representación física del Sobre de Lujo */}
            <div
              onClick={!botanicalEnvelopeFlapOpen ? handleOpenBotanicalEnvelope : undefined}
              className="relative mx-auto w-[310px] sm:w-[340px] h-52 bg-[#F7F3EB] rounded-2xl luxury-paper-shadow overflow-visible flex items-center justify-center cursor-pointer group transition-transform hover:scale-[1.02] active:scale-[0.99]"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(239,233,223,0.9) 100%)',
              }}
            >
              {/* Marco fino dorado en el cuerpo del sobre */}
              <div className="absolute inset-2.5 rounded-xl border border-[#D3B48C]/40 pointer-events-none" />

              {/* Follaje botánico de fondo en acuarela sutil */}
              <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 20 C110 50, 150 60, 160 30 C150 70, 120 80, 100 20 Z" fill="#8A9A86"/>
                  <path d="M100 180 C90 150, 50 140, 40 170 C50 130, 80 120, 100 180 Z" fill="#4A5D4E"/>
                  <path d="M20 100 C50 90, 60 50, 30 40 C70 50, 80 80, 20 100 Z" fill="#8A9A86"/>
                  <path d="M180 100 C150 110, 140 150, 170 160 C130 150, 120 120, 180 100 Z" fill="#4A5D4E"/>
                </svg>
              </div>

              {/* Solapa 3D del sobre (Flap Triangular con corte de gala) */}
              <div
                className={`absolute top-0 left-0 right-0 h-28 bg-[#EDE5D8] border-b border-[#D3B48C]/50 origin-top transform-style-3d transition-transform duration-700 z-30 rounded-t-2xl flex items-end justify-center pb-2 ${
                  botanicalEnvelopeFlapOpen ? 'envelope-flap-open' : ''
                }`}
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transformOrigin: 'top center',
                  transform: botanicalEnvelopeFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
                  boxShadow: !botanicalEnvelopeFlapOpen ? '0 12px 20px -8px rgba(45, 59, 48, 0.25)' : 'none',
                }}
              >
                {/* Doble línea dorada en la solapa */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: 'polygon(5% 0, 95% 0, 50% 90%)',
                    borderBottom: '1px solid rgba(211, 180, 140, 0.6)',
                  }}
                />

                {/* Sello de Lacre Botánico en relieve 3D */}
                {!botanicalEnvelopeFlapOpen && (
                  <div
                    className="h-12 w-12 rounded-full luxury-wax-seal flex items-center justify-center transform translate-y-6 z-40 transition-transform group-hover:scale-110"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #4E6353 0%, #2D3B30 100%)',
                      border: '2px solid rgba(211, 180, 140, 0.7)',
                    }}
                  >
                    <div className="text-center">
                      <span className="text-xs block leading-none">🌿</span>
                      <span className="text-[7px] font-serif font-bold text-[#EAD8B1] tracking-widest block mt-0.5">
                        V&S
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tarjeta Interna que se extrae con realismo hacia arriba */}
              <div
                className={`absolute w-64 sm:w-72 h-44 bg-[#FCFAF6] rounded-xl border border-[#D3B48C]/60 p-4 transition-all duration-700 flex flex-col items-center justify-center text-center space-y-1.5 z-20 ${
                  botanicalCardExtracted ? '-translate-y-28 scale-105 envelope-card-shadow' : 'translate-y-2 shadow-sm'
                }`}
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FAF6EE 100%)',
                }}
              >
                <div className="h-px w-12 bg-[#8A9A86]/50 mx-auto" />
                <span className="text-[8px] uppercase tracking-[0.35em] text-[#8A9A86] font-bold">
                  NUESTRA BODA
                </span>
                <p className="text-base font-bold italic text-[#2D3B30]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Valeria & Sebastián
                </p>
                <p className="text-[10px] text-[#4A5D4E] font-medium tracking-wider">
                  14 • NOVIEMBRE • 2026
                </p>
                <p className="text-[9px] italic text-[#8A9A86]">San Miguel de Allende, Gto.</p>
                <div className="h-px w-12 bg-[#8A9A86]/50 mx-auto" />
              </div>

              {/* Frente del bolsillo del sobre */}
              <div
                className="absolute inset-0 z-25 pointer-events-none rounded-2xl"
                style={{
                  clipPath: 'polygon(0 100%, 100% 100%, 100% 38%, 50% 74%, 0 38%)',
                  background: 'linear-gradient(180deg, #F0EAE0 0%, #E7DFD2 100%)',
                  borderTop: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7)',
                }}
              />
            </div>

            {/* Botón de Apertura Interactivo */}
            <div className="pt-1">
              <button
                onClick={handleOpenBotanicalEnvelope}
                className="px-8 py-3.5 rounded-full bg-[#8A9A86] hover:bg-[#788874] text-white text-xs uppercase tracking-[0.25em] font-bold shadow-xl flex items-center justify-center gap-2.5 mx-auto transition-transform hover:scale-105 active:scale-95 animate-bounce border border-[#D3B48C]/50"
              >
                <Music className="h-4 w-4 text-[#FDFBF7]" />
                <span>ABRIR INVITACIÓN</span>
              </button>
              <p className="text-[10px] text-[#8A9A86] mt-2 tracking-wider">
                (Toca el sobre o el botón para abrir con música de fondo)
              </p>
            </div>

          </div>
        </div>
      );
    }

    // VISTA 2: INVITACIÓN COMPLETA (8 MÓDULOS EN ORDEN CONTINUO)
    return (
      <div className="botanical-pattern-bg min-h-full max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-12 pb-36 relative text-[#2D3B30] selection:bg-[#8A9A86] selection:text-white">

      {/* BOTÓN FLOTANTE PERMANENTE DE AUDIO */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleBotanicalMusic}
          title={botanicalIsPlaying ? 'Pausar música' : 'Reproducir música'}
          className="h-12 w-12 rounded-full bg-white/95 border border-[#8A9A86] shadow-xl flex items-center justify-center text-[#4A5D4E] hover:bg-[#8A9A86] hover:text-white transition-all transform hover:scale-110 active:scale-95"
        >
          {botanicalIsPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="h-3.5 w-1 bg-current animate-pulse rounded-full" />
              <span className="h-5 w-1 bg-current animate-pulse delay-100 rounded-full" />
              <span className="h-3 w-1 bg-current animate-pulse delay-200 rounded-full" />
            </div>
          ) : (
            <VolumeX className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 8 MÓDULOS OBLIGATORIOS EN ORDEN DESCENDENTE CONTINUO                       */}
      {/* ========================================================================= */}

      {/* MÓDULO 1: HERO / PORTADA BOTÁNICA */}
      <section className="text-center space-y-6 pt-2 relative">
        <EditBadge label="Hero Botánico" position="top-right" />

        {/* Guirnalda Superior de Eucalipto */}
        <div className="flex items-center justify-center gap-3 text-[#8A9A86]">
          <span className="h-px w-10 bg-[#8A9A86]/40" />
          <span className="text-base">🌿</span>
          <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#8A9A86]">
            {sections?.hero?.subtitle || 'TE INVITAMOS A CELEBRAR NUESTRA UNIÓN'}
          </span>
          <span className="text-base">🌿</span>
          <span className="h-px w-10 bg-[#8A9A86]/40" />
        </div>

        {/* Nombres de los Novios en Serif Grande */}
        <h1
          className="text-4xl sm:text-6xl font-normal italic text-[#2D3B30] leading-none"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {sections?.hero?.title || 'Valeria & Sebastián'}
        </h1>

        {/* Frase Romántica */}
        <p
          className="text-base sm:text-lg italic text-[#4A5D4E] font-light max-w-md mx-auto"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          «El amor es la flor que florece en todas las estaciones»
        </p>

        {/* Botón Acción Directa "Agregar a Google Calendar" */}
        <div className="p-3.5 rounded-2xl bg-white/90 border border-[#8A9A86]/40 shadow-sm max-w-sm mx-auto text-center space-y-2">
          <p className="text-xs font-bold text-[#2D3B30] uppercase tracking-wider">
            {sections?.hero?.dateText} • {sections?.hero?.timeText}
          </p>
          <a
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Valeria+y+Sebastián&dates=20261114T160000Z/20261115T040000Z&details=Acompáñanos+a+celebrar+nuestra+unión+matrimonial.&location=San+Miguel+de+Allende,+Guanajuato"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#8A9A86] hover:bg-[#788874] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-transform hover:scale-102"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>AGREGAR A GOOGLE CALENDAR</span>
          </a>
        </div>

        {/* Fotografía de los Novios con Marco Limpio y Detalle Floral */}
        <div className="relative p-3 bg-white/95 rounded-3xl shadow-xl border border-[#8A9A86]/40 max-w-sm mx-auto">
          <EditBadge label="Foto de los Novios" position="top-left" />
          
          <div className="absolute -top-4 -left-4 z-20 pointer-events-none drop-shadow-md">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 75 C10 45, 40 20, 80 20 C50 40, 45 65, 15 75 Z" fill="#8A9A86" opacity="0.9"/>
              <circle cx="35" cy="35" r="8" fill="#D3B48C"/>
              <circle cx="35" cy="35" r="4" fill="#FDFBF7"/>
            </svg>
          </div>

          <div
            onClick={() => setLightboxImage(design?.coverImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80')}
            className="h-80 sm:h-96 w-full overflow-hidden rounded-2xl bg-[#E8EFE9] relative cursor-pointer group"
          >
            <img
              src={design?.coverImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
              alt="Valeria & Sebastián"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-[#2D3B30] shadow">
                🔍 Ver Foto
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULO 2: CUENTA REGRESIVA EN VIVO */}
      {sections?.countdown?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/90 border border-[#8A9A86]/40 shadow-md max-w-md mx-auto text-center space-y-4">
          <EditBadge label="Contador en Vivo" position="top-right" />
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8A9A86]">
            <span>🌿</span>
            <span>Cuenta Regresiva</span>
            <span>🌿</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { label: 'DÍAS', value: '169' },
              { label: 'HORAS', value: '06' },
              { label: 'MINUTOS', value: '45' },
              { label: 'SEGUNDOS', value: '12' },
            ].map((t, idx) => (
              <div key={idx} className="p-3 bg-[#FDFBF7] rounded-2xl border border-[#8A9A86]/30 text-center shadow-2xs">
                <span
                  className="text-2xl sm:text-3xl font-bold text-[#2D3B30] block leading-none"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t.value}
                </span>
                <span className="text-[8px] font-bold tracking-wider text-[#8A9A86] uppercase block mt-1">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MÓDULO 3: ITINERARIO DEL EVENTO */}
      {sections?.schedule?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/90 border border-[#8A9A86]/40 shadow-md max-w-md mx-auto text-left space-y-5">
          <EditBadge label="Itinerario Botánico" position="top-right" />
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A86] block">
              MOMENTOS DEL GRAN DÍA
            </span>
            <h3
              className="text-2xl font-bold text-[#2D3B30]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Itinerario de Celebración
            </h3>
          </div>

          <div className="relative pl-6 space-y-5 border-l-2 border-[#8A9A86]/50 ml-3 pt-2">
            {sections?.schedule?.items?.map((item, idx) => {
              const icons = ['🌿', '🍃', '🌸', '✨'];
              return (
                <div key={idx} className="relative space-y-0.5">
                  <div className="absolute -left-[35px] top-0.5 h-6 w-6 rounded-full bg-white border-2 border-[#8A9A86] flex items-center justify-center text-xs shadow-2xs">
                    {icons[idx % icons.length]}
                  </div>
                  <span
                    className="text-sm font-bold text-[#8A9A86] block"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {item.time}
                  </span>
                  <h4 className="text-xs font-bold text-[#2D3B30]">{item.title}</h4>
                  <p className="text-[11px] text-[#4A5D4E]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MÓDULO 4: UBICACIÓN (DOS SEDES: IGLESIA & RECEPCIÓN) */}
      <section className="space-y-6 max-w-md mx-auto">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#8A9A86] block">
            UBICACIÓN & SEDES
          </span>
          <h2
            className="text-2xl font-bold text-[#2D3B30]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Dónde & Cuándo
          </h2>
        </div>

        {/* SEDE 1: CEREMONIA RELIGIOSA / IGLESIA */}
        <div className="relative p-6 rounded-3xl bg-white/95 border border-[#8A9A86]/40 shadow-md space-y-4 text-center">
          <EditBadge label="Ceremonia Religiosa" position="top-right" />
          <div className="h-12 w-12 rounded-full bg-[#8A9A86]/20 border border-[#8A9A86] flex items-center justify-center mx-auto text-xl">
            ⛪
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A86] block">
              CEREMONIA RELIGIOSA
            </span>
            <h3
              className="text-xl font-bold text-[#2D3B30]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Parroquia de San Miguel Arcángel
            </h3>
            <p className="text-xs font-semibold text-[#8A9A86] mt-0.5">16:00 HRS</p>
            <p className="text-xs text-[#4A5D4E] mt-1">
              Plaza Principal S/N, Centro Histórico, San Miguel de Allende, Gto.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="https://maps.google.com/?q=Parroquia+de+San+Miguel+Arcangel+San+Miguel+de+Allende"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#8A9A86] hover:bg-[#788874] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Navigation className="h-3 w-3" />
              <span>Google Maps</span>
            </a>
            <a
              href="https://waze.com/ul?q=Parroquia+de+San+Miguel+Arcangel"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#8A9A86] text-[#2D3B30] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Compass className="h-3 w-3 text-[#8A9A86]" />
              <span>Waze</span>
            </a>
          </div>
        </div>

        {/* SEDE 2: RECEPCIÓN & BANQUETE */}
        <div className="relative p-6 rounded-3xl bg-white/95 border border-[#8A9A86]/40 shadow-md space-y-4 text-center">
          <EditBadge label="Recepción de Gala" position="top-right" />
          <div className="h-12 w-12 rounded-full bg-[#8A9A86]/20 border border-[#8A9A86] flex items-center justify-center mx-auto text-xl">
            🥂
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A86] block">
              RECEPCIÓN & FIESTA
            </span>
            <h3
              className="text-xl font-bold text-[#2D3B30]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Hacienda de los Eucaliptos
            </h3>
            <p className="text-xs font-semibold text-[#8A9A86] mt-0.5">18:30 HRS</p>
            <p className="text-xs text-[#4A5D4E] mt-1">
              Carretera San Miguel - Dolores Km 8, San Miguel de Allende, Gto.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="https://maps.google.com/?q=San+Miguel+de+Allende+Guanajuato"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#8A9A86] hover:bg-[#788874] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Navigation className="h-3 w-3" />
              <span>Google Maps</span>
            </a>
            <a
              href="https://waze.com/ul?q=San+Miguel+de+Allende+Guanajuato"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#8A9A86] text-[#2D3B30] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Compass className="h-3 w-3 text-[#8A9A86]" />
              <span>Waze</span>
            </a>
          </div>
        </div>
      </section>

      {/* MÓDULO 5: GALERÍA DE FOTOS (RECUERDOS CON LIGHTBOX) */}
      {sections?.gallery?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/90 border border-[#8A9A86]/40 shadow-md space-y-4">
          <EditBadge label="Galería con Visor Lightbox" position="top-right" />
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A86] block">
              NUESTROS MOMENTOS
            </span>
            <h3
              className="text-2xl font-bold text-[#2D3B30]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Galería de Recuerdos
            </h3>
            <p className="text-[11px] text-[#8A9A86]">(Haz clic en cualquier foto para ampliarla)</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {sections?.gallery?.images?.map((gImg, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(gImg)}
                className="h-40 sm:h-48 rounded-2xl overflow-hidden border border-[#8A9A86]/30 shadow-sm group relative cursor-pointer"
              >
                <img
                  src={gImg}
                  alt={`Recuerdo botánico ${idx + 1}`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  🔍 Ampliar
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL LIGHTBOX */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border-2 border-[#8A9A86] shadow-2xl">
            <img src={lightboxImage} alt="Visor Ampliado" className="h-full w-full object-contain" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/70 text-white font-bold text-sm flex items-center justify-center hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MÓDULO 6: CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      <section className="relative p-6 rounded-3xl bg-white/85 border border-[#8A9A86]/30 shadow-sm max-w-md mx-auto text-center space-y-2">
        <EditBadge label="Dress Code" position="top-right" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A86] block">
          CÓDIGO DE VESTIMENTA
        </span>
        <h4
          className="text-xl font-bold text-[#2D3B30]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {sections?.dressCode?.type || 'Boho Chic / Guayabera & Vestido de Fiesta'}
        </h4>
        <p className="text-xs text-[#4A5D4E] leading-relaxed">
          {sections?.dressCode?.description || 'Hombres: Guayabera clara de lino o traje formal. Mujeres: Vestido midi o largo en tonos salvia o florales.'}
        </p>
        <div className="flex justify-center gap-2 pt-2">
          {['#8A9A86', '#4A5D4E', '#D3B48C', '#FDFBF7'].map((c, i) => (
            <div key={i} className="h-6 w-6 rounded-full border border-white shadow-xs" style={{ backgroundColor: c }} />
          ))}
        </div>
      </section>

      {/* MÓDULO 7: MESA DE REGALOS */}
      <section className="relative p-6 rounded-3xl bg-white/95 border border-[#8A9A86]/40 shadow-md max-w-md mx-auto text-center space-y-4">
        <EditBadge label="Mesa de Regalos" position="top-right" />
        <div className="h-10 w-10 rounded-full bg-[#8A9A86]/20 border border-[#8A9A86] flex items-center justify-center mx-auto text-xl">
          🎁
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A86] block">
            MESA DE REGALOS
          </span>
          <h3
            className="text-xl font-bold text-[#2D3B30]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Sugerencias de Regalo
          </h3>
          <p className="text-xs text-[#4A5D4E] mt-1">
            El mejor regalo es tu presencia, pero si deseas tener un detalle con nosotros:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="https://www.liverpool.com.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#8A9A86]/40 hover:border-[#8A9A86] text-center space-y-1 block shadow-2xs"
          >
            <span className="text-xs font-bold text-[#2D3B30] block">Liverpool</span>
            <span className="text-[10px] text-[#8A9A86] font-mono">Evento: #5092812</span>
          </a>
          <a
            href="https://www.amazon.com.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#8A9A86]/40 hover:border-[#8A9A86] text-center space-y-1 block shadow-2xs"
          >
            <span className="text-xs font-bold text-[#2D3B30] block">Amazon</span>
            <span className="text-[10px] text-[#8A9A86] font-mono">Mesa de Boda</span>
          </a>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#8A9A86]/30 text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#8A9A86]">Regalo en Efectivo / Transferencia:</span>
            <button
              onClick={handleCopyClabe}
              className="text-[10px] font-bold text-white bg-[#8A9A86] hover:bg-[#788874] px-2.5 py-1 rounded-full shadow-xs"
            >
              {copiedBankClabe ? '✓ ¡Copiado!' : 'Copiar CLABE'}
            </button>
          </div>
          <p className="text-xs font-mono font-bold text-[#2D3B30]">BBVA: 012180015678901234</p>
          <p className="text-[10px] text-[#4A5D4E]">Titular: Valeria Méndez & Sebastián Ortiz</p>
        </div>
      </section>

      {/* MÓDULO 8: FORMULARIO DE CONFIRMACIÓN RSVP */}
      <section className="relative p-6 rounded-3xl bg-white/95 border border-[#8A9A86]/40 shadow-xl max-w-md mx-auto text-center space-y-5">
        <EditBadge label="Formulario RSVP en el Jardín" position="top-right" />
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A86] block">
            CONFIRMACIÓN DE ASISTENCIA
          </span>
          <h3
            className="text-2xl font-bold text-[#2D3B30]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            ¿Nos Acompañas?
          </h3>
          <p className="text-xs text-[#4A5D4E]">
            Agradecemos confirmar tu asistencia antes del 1 de Octubre para asignar tus lugares.
          </p>
        </div>

        {!botanicalSubmitted ? (
          <form onSubmit={handleBotanicalRsvpSubmit} className="space-y-4 text-left pt-2">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5D4E] block mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={botanicalName}
                onChange={(e) => setBotanicalName(e.target.value)}
                placeholder="Ej. Andrés Morales"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#8A9A86]/40 text-xs text-[#2D3B30] outline-none focus:border-[#4A5D4E] transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5D4E] block mb-1">
                Teléfono WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={botanicalPhone}
                onChange={(e) => setBotanicalPhone(e.target.value)}
                placeholder="+52 442 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#8A9A86]/40 text-xs text-[#2D3B30] outline-none focus:border-[#4A5D4E] transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5D4E] block mb-1">
                ¿Asistirás al evento? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBotanicalAttending('YES')}
                  className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold border transition-all ${
                    botanicalAttending === 'YES'
                      ? 'bg-[#8A9A86] text-white border-[#8A9A86] shadow-sm'
                      : 'bg-[#FDFBF7] text-[#4A5D4E] border-[#8A9A86]/40'
                  }`}
                >
                  🌿 Sí, asistiré
                </button>
                <button
                  type="button"
                  onClick={() => setBotanicalAttending('NO')}
                  className={`py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold border transition-all ${
                    botanicalAttending === 'NO'
                      ? 'bg-[#4A5D4E] text-white border-[#4A5D4E] shadow-sm'
                      : 'bg-[#FDFBF7] text-[#4A5D4E] border-[#8A9A86]/40'
                  }`}
                >
                  ✕ No podré ir
                </button>
              </div>
            </div>

            {botanicalAttending === 'YES' && (
              <>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5D4E] block mb-1">
                    Número de Pases Requeridos:
                  </label>
                  <select
                    value={botanicalCompanions}
                    onChange={(e) => setBotanicalCompanions(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#8A9A86]/40 text-xs text-[#2D3B30] outline-none"
                  >
                    <option value={1}>1 Pase (Personal)</option>
                    <option value={2}>2 Pases (Con acompañante)</option>
                    <option value={3}>3 Pases</option>
                    <option value={4}>4 Pases</option>
                  </select>
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#8A9A86]/30">
                  <div className="flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-[#8A9A86]" />
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5D4E]">
                      Requerimientos Alimenticios en el Banquete:
                    </label>
                  </div>
                  <p className="text-[10px] text-[#8A9A86]">
                    Indica si requieres menú especial o alergias para la cocina del jardín:
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { id: 'regular', label: 'Menú Tradicional' },
                      { id: 'vegetariano', label: 'Vegetariano' },
                      { id: 'vegano', label: 'Vegano' },
                      { id: 'celiaco', label: 'Sin Gluten (Celíaco)' },
                      { id: 'mariscos', label: 'Alergia a Mariscos' },
                      { id: 'lactosa', label: 'Sin Lactosa' },
                      { id: 'nueces', label: 'Alergia a Frutos Secos' },
                    ].map((chip) => {
                      const active = botanicalDietary.includes(chip.id);
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => toggleBotanicalDietary(chip.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                            active
                              ? 'bg-[#8A9A86] text-white border-[#8A9A86] shadow-xs'
                              : 'bg-white text-[#4A5D4E] border-[#8A9A86]/40 hover:bg-[#FDFBF7]'
                          }`}
                        >
                          {active && '✓ '}
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1.5">
                    <input
                      type="text"
                      value={botanicalDietaryCustom}
                      onChange={(e) => setBotanicalDietaryCustom(e.target.value)}
                      placeholder="Especificar otra alergia o dieta especial..."
                      className="w-full px-3 py-2 rounded-lg text-[11px] bg-white border border-[#8A9A86]/40 text-[#2D3B30] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageCircleHeart className="h-3.5 w-3.5 text-[#8A9A86]" />
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#4A5D4E]">
                      Mensaje de Felicitación (Opcional):
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={botanicalMessage}
                    onChange={(e) => setBotanicalMessage(e.target.value)}
                    placeholder="Escribe tus mejores deseos para Valeria & Sebastián..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#8A9A86]/40 text-xs text-[#2D3B30] outline-none focus:border-[#4A5D4E] transition-colors resize-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#8A9A86] hover:bg-[#788874] text-white text-xs uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>Confirmar en el Jardín</span>
              <span>🍃</span>
            </button>
          </form>
        ) : (
          <div className="p-6 bg-[#FDFBF7] rounded-2xl border border-[#8A9A86]/40 text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-[#8A9A86]/20 border border-[#8A9A86] flex items-center justify-center mx-auto text-[#4A5D4E]">
              🌿
            </div>
            <p
              className="text-xl font-bold text-[#2D3B30]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              ¡Gracias, {botanicalName}!
            </p>
            <p className="text-xs text-[#4A5D4E]">
              Hemos registrado tu confirmación{botanicalAttending === 'YES' ? ` (${botanicalCompanions} pases)` : ''} para la celebración en el jardín.
            </p>
            {botanicalMessage && (
              <p className="text-[11px] italic text-[#8A9A86] pt-2 border-t border-[#8A9A86]/20">
                «{botanicalMessage}»
              </p>
            )}
          </div>
        )}
      </section>

    </div>
  );
};

  // 3. TECH-LUXURY
  const renderTechLuxury = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-[#FAF6F0]">
      <div className="text-center space-y-2 pt-2 relative">
        <EditBadge label="Título Tech & Luxury" position="top-right" theme="gold" />
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
          EXCLUSIVE LUXURY CELEBRATION
        </span>
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-widest leading-tight">
          {sections?.hero?.title || 'SANTIAGO & CAMILA'}
        </h1>
        <p className="text-xs text-[#D3B48C] font-mono tracking-widest pt-1">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
      </div>

      <section className="relative p-6 rounded-3xl bg-white/[0.05] border border-[#D3B48C]/40 shadow-2xl backdrop-blur-xl space-y-4">
        <EditBadge label="Hero Glassmorphism" position="top-right" theme="gold" />
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#D3B48C]/30 shadow-inner">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Tech Luxury" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <span className="text-xs font-mono text-[#D3B48C]">{sections?.location?.venueName}</span>
          </div>
        </div>
      </section>

      <section className="relative p-6 rounded-3xl bg-white/[0.05] border border-[#D3B48C]/30 backdrop-blur-xl space-y-3">
        <EditBadge label="Carrusel Horizontal Dorado" position="top-right" theme="gold" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D3B48C] block font-cinzel">
          VIP Visual Gallery
        </span>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {sections?.gallery?.images?.map((gImg, idx) => (
            <div key={idx} className="h-32 w-48 shrink-0 rounded-2xl overflow-hidden border border-[#D3B48C]/50 shadow-lg">
              <img src={gImg} alt="Carousel" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#D3B48C] to-[#B89758] text-[#0A0A0C] font-cinzel font-bold text-xs uppercase tracking-widest shadow-2xl">
        Access VIP Confirmation • RSVP
      </button>
    </div>
  );

  // 4. ROYAL GOLD
  const renderRoyalGold = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-[#1A1814]">
      <section className="relative p-8 sm:p-12 bg-[#FAF6F0] rounded-none border-8 border-double border-[#D3B48C] shadow-2xl text-center space-y-6">
        <EditBadge label="Sello de Lacre Real" position="top-right" theme="gold" />

        <div className="mx-auto h-20 w-20 rounded-full bg-[#8A1C14] border-4 border-[#D3B48C] shadow-2xl flex items-center justify-center text-[#D3B48C] animate-wax-seal">
          <span className="font-serif text-2xl font-bold">A & C</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#B89758] block font-playfair">
            {sections?.hero?.subtitle}
          </span>
          <h1 className="text-3xl sm:text-5xl font-playfair font-black italic text-[#1A1814]">
            {sections?.hero?.title || 'Ana & Carlos'}
          </h1>
          <p className="text-xs text-[#8A1C14] font-playfair font-bold uppercase tracking-widest pt-1">
            SÁBADO • XIV • NOVIEMBRE • MMXXVI
          </p>
        </div>

        <div className="relative h-72 w-full rounded-full overflow-hidden border-4 border-[#D3B48C] shadow-2xl mx-auto max-w-sm">
          <EditBadge label="Retrato Ovalado Real" position="top-left" />
          <img src={design?.coverImageUrl || template?.previewImage} alt="Royal Wedding" className="h-full w-full object-cover" />
        </div>

        <button className="w-full py-4 rounded-none bg-[#8A1C14] hover:bg-[#6D150F] text-white font-playfair font-bold text-sm tracking-widest uppercase shadow-2xl border-2 border-[#D3B48C]">
          S.R.C. • Confirmar Asistencia de Gala
        </button>
      </section>
    </div>
  );

  // 5. GLOW PARTY
  const renderGlowParty = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-white">
      <div className="text-center space-y-2 pt-2 relative">
        <EditBadge label="Tipografía Display Neón" position="top-right" />
        <div className="inline-flex p-3 rounded-full bg-[#E0218A]/20 border border-[#00F0FF] shadow-lg animate-pulse">
          <Flame className="h-6 w-6 text-[#00F0FF]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-syne font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#E0218A] via-[#00F0FF] to-[#9900FF] tracking-wider">
          {sections?.hero?.title || 'REGINA • MIS XV AÑOS'}
        </h1>
        <p className="text-xs text-[#00F0FF] font-mono tracking-widest uppercase">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
      </div>

      <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.3)] transform -rotate-1 space-y-4">
        <EditBadge label="Bloque Asimétrico XV" position="top-right" />
        <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#E0218A]">
          <img src={design?.coverImageUrl || template?.previewImage} alt="XV Party" className="h-full w-full object-cover" />
        </div>
      </section>

      <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#E0218A] to-[#00F0FF] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(224,33,138,0.5)]">
        ⚡ Confirmar Acceso a la Fiesta
      </button>
    </div>
  );

  // 6. CINEMATIC NIGHT
  const renderCinematicNight = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-[#F8FAFC]">
      <div className="text-center space-y-2 pt-2 relative">
        <EditBadge label="Gala Cinematográfica" position="top-right" />
        <div className="inline-block p-2 rounded-full bg-blue-950 border border-blue-400/50">
          <Award className="h-6 w-6 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-widest uppercase">
          {sections?.hero?.title || 'GALA DE GRADUACIÓN 2026'}
        </h1>
        <p className="text-xs text-blue-300 font-mono tracking-widest">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
      </div>

      <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl space-y-4">
        <EditBadge label="Retrato de Honor" position="top-right" />
        <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-slate-600">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Graduation" className="h-full w-full object-cover" />
        </div>
      </section>

      <button className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl">
        Confirmar Asistencia a la Gala
      </button>
    </div>
  );

  // 7. SWEET CELEBRATION
  const renderSweetCelebration = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-[#2C3E50]">
      <div className="text-center space-y-2 pt-2 relative">
        <EditBadge label="Títulos Infantiles / Bautizo" position="top-right" />
        <div className="inline-block p-3 rounded-full bg-white/80 border border-[#7AA7C7] shadow-md text-[#7AA7C7]">
          <Star className="h-6 w-6 text-[#7AA7C7] fill-[#7AA7C7]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic text-[#2C3E50]">
          {sections?.hero?.title || 'El Bautizo de Matías'}
        </h1>
        <p className="text-xs text-[#7AA7C7] uppercase tracking-widest font-bold">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
      </div>

      <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-[0_15px_35px_rgba(122,167,199,0.2)] space-y-4">
        <EditBadge label="Foto Suavizada" position="top-right" />
        <div className="relative h-64 sm:h-80 w-full rounded-[28px] overflow-hidden border border-[#F5C6CB]">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Sweet" className="h-full w-full object-cover" />
        </div>
      </section>

      <button className="w-full py-4 rounded-full bg-[#7AA7C7] hover:bg-[#6893B0] text-white font-bold text-xs uppercase tracking-wider shadow-lg">
        Confirmar Acompañamiento
      </button>
    </div>
  );

  // 8. ROMANCE CLÁSICO
  const renderRomanceClasico = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-[#2A1810]">
      <div className="text-center space-y-2 pt-2 relative">
        <EditBadge label="Caligrafía Manuscrita" position="top-right" />
        <div className="inline-block p-2 text-[#722F37]">
          <Feather className="h-6 w-6 mx-auto" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-script text-[#722F37]">
          {sections?.hero?.title || 'Julieta & Romeo'}
        </h1>
        <p className="text-xs text-[#722F37] uppercase tracking-widest font-semibold font-playfair">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
      </div>

      <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl space-y-4">
        <EditBadge label="Retrato Vintage Ovalado" position="top-right" />
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#C49A45]">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Romance" className="h-full w-full object-cover" />
        </div>
      </section>

      <button className="w-full py-3.5 rounded-full bg-[#722F37] hover:bg-[#5C232A] text-white font-playfair font-bold text-xs uppercase tracking-widest shadow-xl">
        Confirmar Asistencia al Claustro
      </button>
    </div>
  );

  // 9. ELEGANCIA EJECUTIVA
  const renderEleganciaEjecutiva = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-[#0F172A]">
      <div className="text-center space-y-2 pt-2 relative">
        <EditBadge label="Cumbre Corporativa" position="top-right" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B45309] block">
          CORPORATE LEADERSHIP SUMMIT
        </span>
        <h1 className="text-2xl sm:text-4xl font-cinzel font-bold text-[#0F172A] tracking-wider uppercase">
          {sections?.hero?.title || 'CUMBRE EJECUTIVA 2026'}
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
      </div>

      <section className="relative p-6 rounded-none bg-white border-2 border-[#475569] shadow-lg space-y-4">
        <EditBadge label="Estructura Ejecutiva" position="top-right" />
        <div className="relative h-56 w-full rounded-none overflow-hidden border border-slate-300">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Executive" className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
          <div className="p-2 border border-slate-200">
            <span className="text-[10px] text-[#B45309] block">SEDE</span>
            <strong>{sections?.location?.venueName}</strong>
          </div>
          <div className="p-2 border border-slate-200">
            <span className="text-[10px] text-[#B45309] block">DRESS CODE</span>
            <strong>Business Formal</strong>
          </div>
        </div>
      </section>

      <button className="w-full py-3.5 rounded-none bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono font-bold text-xs uppercase tracking-widest shadow-md">
        Registrar Credencial Ejecutiva
      </button>
    </div>
  );

  // 10. TROPICAL SUNSET
  const renderTropicalSunset = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 pb-32 relative text-[#2D1B12]">
      <div className="text-center space-y-2 pt-2 relative">
        <EditBadge label="Boda en la Playa" position="top-right" />
        <div className="inline-block p-2 text-[#C85A32]">
          <Palmtree className="h-7 w-7 mx-auto" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-[#C85A32]">
          {sections?.hero?.title || 'Lucía & Alejandro'}
        </h1>
        <p className="text-xs text-[#E6953B] font-bold uppercase tracking-widest">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
      </div>

      <section className="relative p-4 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl space-y-4">
        <EditBadge label="Cabecera Panorámica" position="top-right" />
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Tropical" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#C85A32]/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-center text-white text-xs font-semibold">
            {sections?.location?.venueName} • {sections?.location?.city}
          </div>
        </div>
      </section>

      <section className="relative p-6 rounded-3xl bg-white/90 border border-[#E6953B]/40 shadow-md space-y-3">
        <EditBadge label="Galería Panorámica Atardecer" position="top-right" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32] block">
          Momentos en el Paraíso
        </span>
        <div className="grid grid-cols-3 gap-2">
          {sections?.gallery?.images?.slice(0, 3).map((gImg, idx) => (
            <div key={idx} className="h-20 rounded-xl overflow-hidden shadow-xs">
              <img src={gImg} alt="Beach" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <button className="w-full py-4 rounded-full bg-[#C85A32] hover:bg-[#B34D28] text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2">
        <span>Confirmar Asistencia en la Playa</span>
        <SunMedium className="h-4 w-4 text-amber-200" />
      </button>
    </div>
  );

  // Dispatcher to pick the exact custom layout based on template.id
  const renderTemplateBody = () => {
    switch (template?.id) {
      case 'minimal-nude':
        return renderMinimalNude();
      case 'botanical-garden':
        return renderBotanicalGarden();
      case 'tech-luxury':
        return renderTechLuxury();
      case 'royal-gold':
        return renderRoyalGold();
      case 'glow-party':
        return renderGlowParty();
      case 'cinematic-night':
        return renderCinematicNight();
      case 'sweet-celebration':
        return renderSweetCelebration();
      case 'romance-clasico':
        return renderRomanceClasico();
      case 'elegancia-ejecutiva':
        return renderEleganciaEjecutiva();
      case 'tropical-sunset':
        return renderTropicalSunset();
      default:
        return renderMinimalNude();
    }
  };

  return (
    <div className="min-h-screen bg-[#162E2D] text-[#FAF6F0] flex flex-col selection:bg-[#4E8281] selection:text-white">
      
      {/* TOP CONTROL BAR (Prototipo Interactivo) */}
      <header className="sticky top-0 z-50 bg-[#0F2424]/95 border-b border-[#D3B48C]/40 backdrop-blur-md px-4 sm:px-6 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Back & Template Info */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link
              href="/templates"
              onClick={handleStopAudioAndNavigate}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D3B48C] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-[#D3B48C]/30"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver al Catálogo</span>
            </Link>

            <div className="hidden sm:block h-5 w-px bg-white/20" />

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wider font-cinzel">
                {template?.name}
              </span>
              {template?.badge && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#D3B48C] text-[#0F2424]">
                  ✦ {template?.badge}
                </span>
              )}
            </div>
          </div>

          {/* Center: Device Viewport Switcher & Edit Guides Toggle */}
          <div className="flex items-center gap-2">
            {/* Viewport switcher */}
            <div className="flex items-center p-1 rounded-full bg-white/10 border border-white/15 text-xs">
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                  deviceView === 'mobile'
                    ? 'bg-[#4E8281] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Vista Móvil (iPhone)"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Móvil</span>
              </button>

              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                  deviceView === 'desktop'
                    ? 'bg-[#4E8281] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Vista Pantalla Completa"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>Completa</span>
              </button>
            </div>

            {/* Toggle Editable Callouts */}
            <button
              onClick={() => setShowEditGuides(!showEditGuides)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                showEditGuides
                  ? 'bg-[#D3B48C] text-[#0F2424] border-[#D3B48C] shadow'
                  : 'bg-white/5 text-slate-300 border-white/20 hover:text-white'
              }`}
            >
              {showEditGuides ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">
                {showEditGuides ? 'Guías: ON' : 'Guías: OFF'}
              </span>
            </button>
          </div>

          {/* Right: Primary Action Button (Usar Plantilla) */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Link
              href={`/events/new?template=${template?.id}`}
              onClick={handleStopAudioAndNavigate}
              className="w-full md:w-auto px-6 py-2 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#4E8281]/40 border border-[#D3B48C]/50 inline-flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Personalizar Esta Plantilla</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#D3B48C]" />
            </Link>
          </div>
        </div>
      </header>

      {/* TOP NOTIFICATION BANNER */}
      <div className="bg-[#4E8281]/30 border-b border-[#D3B48C]/30 px-4 py-2 text-center text-xs text-[#FAF6F0] flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[#D3B48C] shrink-0" />
        <span>
          <strong>Prototipo Interactivo:</strong> Estás explorando el diseño exclusivo <em>«{template?.name}»</em> con estructura de componentes propia. Haz clic en <strong>«Personalizar Esta Plantilla»</strong> para usar tus datos reales.
        </span>
      </div>

      {/* MAIN PROTOTYPE WORKSPACE */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* VIEWPORT WRAPPER: Mobile Frame or Fullscreen Canvas */}
        <div
          className={`transition-all duration-300 mx-auto relative ${
            deviceView === 'mobile'
              ? 'w-full max-w-[440px] rounded-[48px] border-[10px] border-[#0F2424] shadow-2xl overflow-hidden bg-black ring-2 ring-[#D3B48C]/40'
              : 'w-full max-w-4xl rounded-3xl border-2 border-[#D3B48C]/40 shadow-2xl overflow-hidden'
          }`}
        >
          {/* Dynamic Template Content */}
          <div
            ref={scrollContainerRef}
            className="w-full relative selection:bg-[#4E8281] selection:text-white"
            style={{
              backgroundColor: design?.backgroundColor || '#F5F2EB',
              color: design?.textColor || '#3A332C',
              fontFamily: design?.fontFamilyBody || 'Montserrat, sans-serif',
              minHeight: deviceView === 'mobile' ? '780px' : '900px',
              maxHeight: deviceView === 'mobile' ? '820px' : 'none',
              overflowY: (template?.id === 'botanical-garden' && !botanicalEnvelopeOpen) ? 'hidden' : 'auto',
            }}
          >
            {/* Optional Royal Gold Wax Seal Envelope Intro */}
            {design?.effects?.hasEnvelopeIntro && !isEnvelopeOpened && (
              <EnvelopeIntro
                title={sections?.hero?.title}
                subtitle={sections?.hero?.subtitle}
                dateText={`${sections?.hero?.dateText} • ${sections?.hero?.timeText}`}
                onOpen={() => setIsEnvelopeOpened(true)}
              />
            )}

            {/* Background Particle Animation Engine */}
            <BackgroundEffects
              enabled={design?.effects?.backgroundAnimation ?? true}
              animationType={design?.effects?.animationType || 'fade'}
              intensity={design?.effects?.animationIntensity || 'low'}
            />

            {/* Render Specific Layout for this Template */}
            <div className="relative z-10">
              {renderTemplateBody()}
            </div>

          </div>
        </div>
      </main>

      {/* BOTTOM FLOATING ACTION BAR */}
      <footer className="sticky bottom-0 z-50 bg-[#0F2424]/95 border-t border-[#D3B48C]/40 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Palette className="h-4 w-4 text-[#D3B48C]" />
            <span>
              Plantilla Activa: <strong>{template?.name}</strong> • Layout y componentes 100% personalizados.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              onClick={handleStopAudioAndNavigate}
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2"
            >
              Ver Otras Plantillas
            </Link>

            <Link
              href={`/events/new?template=${template?.id}`}
              onClick={handleStopAudioAndNavigate}
              className="px-6 py-2.5 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase shadow-xl border border-[#D3B48C] inline-flex items-center gap-2"
            >
              <span>Personalizar Esta Plantilla</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
