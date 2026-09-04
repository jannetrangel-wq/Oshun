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
  const [copiedClabeId, setCopiedClabeId] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleCopyAnyClabe = (clabeNumber: string = '012180015678901234', templateKey: string = 'default') => {
    try {
      navigator.clipboard.writeText(clabeNumber);
    } catch {
      // fallback
    }
    setCopiedClabeId(templateKey);
    setCopiedClabe(true);
    setCopiedBankClabe(true);
    setTimeout(() => {
      setCopiedClabeId(null);
      setCopiedClabe(false);
      setCopiedBankClabe(false);
    }, 3000);
  };

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

  // Generic Templates (3-10) Interactive RSVP State
  const [genericRsvpName, setGenericRsvpName] = useState('');
  const [genericRsvpPhone, setGenericRsvpPhone] = useState('');
  const [genericRsvpCompanions, setGenericRsvpCompanions] = useState(2);
  const [genericRsvpSubmitted, setGenericRsvpSubmitted] = useState<{ [key: string]: boolean }>({});

  const handleGenericRsvpSubmit = (e: React.FormEvent, key: string) => {
    e.preventDefault();
    if (!genericRsvpName.trim()) return;
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
    setGenericRsvpSubmitted((prev) => ({ ...prev, [key]: true }));
  };

  // Dramatic Intro & Scroll Animation State
  const [heroAnimated, setHeroAnimated] = useState(false);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  // Comprehensive Scroll Reset to Top (0, 0)
  const resetAllScrolls = () => {
    try {
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      const mobileContainers = document.querySelectorAll('.mobile-preview-container, [data-scroll-container], main');
      mobileContainers.forEach((container) => {
        (container as HTMLElement).scrollTop = 0;
      });
    } catch {
      // safe fallback
    }
  };

  // Audio Cleanup on Unmount, Route Navigation, & Scroll Reset on Mount
  useEffect(() => {
    // Force scroll to top on mount immediately and on subsequent frames
    resetAllScrolls();
    const frameId = requestAnimationFrame(resetAllScrolls);
    const timer = setTimeout(resetAllScrolls, 50);

    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current = null;
      }
      setBotanicalIsPlaying(false);
      setIsMusicPlaying(false);
    };

    window.addEventListener('popstate', stopAudio);
    window.addEventListener('pagehide', stopAudio);
    window.addEventListener('beforeunload', stopAudio);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      stopAudio();
      window.removeEventListener('popstate', stopAudio);
      window.removeEventListener('pagehide', stopAudio);
      window.removeEventListener('beforeunload', stopAudio);
    };
  }, []);

  useEffect(() => {
    // Force scroll to top when changing templates
    resetAllScrolls();
    const frameId = requestAnimationFrame(resetAllScrolls);
    const timer1 = setTimeout(resetAllScrolls, 50);

    // Stop any playing audio when switching templates
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setBotanicalIsPlaying(false);
    setIsMusicPlaying(false);

    // 0.5s initial delay for rendering before starting the 2.2s dramatic slide-up
    const timer = setTimeout(() => {
      setHeroAnimated(true);
    }, 500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer1);
      clearTimeout(timer);
    };
  }, [template?.id]);

  const handleStopAudioAndNavigate = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setBotanicalIsPlaying(false);
    setIsMusicPlaying(false);
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

      {/* 7. Mesa de Regalos & CLABE Bancaria */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="space-y-4 max-w-md mx-auto text-center relative py-6 border-t border-[#E5DFD5] transition-dramatic-nude">
          <EditBadge label="Mesa de Regalos & CLABE" position="top-right" />
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#A89F91] font-semibold block">
              Mesa de Regalos
            </span>
            <h4
              className="text-xl font-light text-[#3A332C]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {sections?.giftRegistry?.title || 'Mesa de Regalos & CLABE'}
            </h4>
            <p className="text-xs text-[#7A6E60] leading-relaxed">
              {sections?.giftRegistry?.description || 'Tu compañía y buenos deseos son nuestro mejor obsequio.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href="https://mesaderegalos.liverpool.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/90 hover:bg-white border border-[#A89F91]/50 text-center space-y-0.5 block shadow-2xs transition-colors"
            >
              <span className="text-xs font-semibold text-[#3A332C] block">Liverpool</span>
              <span className="text-[10px] text-[#A89F91] font-mono">Evento: #5092812</span>
            </a>
            <a
              href="https://www.elpalaciodehierro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/90 hover:bg-white border border-[#A89F91]/50 text-center space-y-0.5 block shadow-2xs transition-colors"
            >
              <span className="text-xs font-semibold text-[#3A332C] block">El Palacio de Hierro</span>
              <span className="text-[10px] text-[#A89F91] font-mono">Mesa Nupcial</span>
            </a>
          </div>

          {/* CLABE Box */}
          <div className="p-3.5 bg-white/80 border border-[#A89F91]/40 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A6E60]">Transferencia Bancaria (CLABE):</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('012180015678901234', 'minimal-nude')}
                className="text-[10px] font-bold text-white bg-[#7A6E60] hover:bg-[#685D50] px-2.5 py-0.5 shadow-2xs transition-colors"
              >
                {copiedClabeId === 'minimal-nude' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-semibold text-[#3A332C]">BBVA: 012180015678901234</p>
            <p className="text-[10px] text-[#A89F91]">Titular: Elena Vázquez & Mateo Morales</p>
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
          className={`botanical-pattern-bg w-full min-h-full flex-1 flex flex-col items-center justify-center p-4 text-[#2D3B30] selection:bg-[#8A9A86] selection:text-white transition-all duration-700 relative ${
            botanicalEnvelopeFaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ width: '100%', minHeight: '100%' }}
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

  // =========================================================================
  // 3. TECH-LUXURY (Moderna / Exclusiva) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderTechLuxury = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-[#FAF6F0] selection:bg-[#D3B48C] selection:text-[#0A0A0C]">
      
      {/* 1. HERO / PORTADA PRINCIPAL */}
      <section className="text-center space-y-4 pt-2 relative">
        <EditBadge label="Hero Tech & Luxury" position="top-right" theme="gold" />
        <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#D3B48C] block font-cinzel">
          EXCLUSIVE LUXURY CELEBRATION
        </span>
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-widest leading-tight">
          {sections?.hero?.title || 'SANTIAGO & CAMILA'}
        </h1>
        <p className="text-xs text-[#D3B48C] font-mono tracking-widest">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>

        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-[#D3B48C]/50 shadow-2xl mt-4">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Tech Luxury" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="text-xs font-mono text-[#D3B48C] bg-[#0A0A0C]/80 px-4 py-1 rounded-full border border-[#D3B48C]/40">
              ✦ {sections?.location?.venueName} ✦
            </span>
          </div>
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA / TIMER TECH */}
      <section className="relative p-6 rounded-3xl bg-white/[0.04] border border-[#D3B48C]/40 backdrop-blur-xl shadow-2xl text-center space-y-4">
        <EditBadge label="Countdown Tech" position="top-right" theme="gold" />
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
          COUNTDOWN TO CELEBRATION
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DAYS', value: '169' },
            { label: 'HOURS', value: '06' },
            { label: 'MINS', value: '45' },
            { label: 'SECS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-black/40 border border-[#D3B48C]/30 text-center">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D3B48C] block">{t.value}</span>
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Santiago+y+Camila&dates=20261128T190000Z/20261129T050000Z&details=Exclusive+Luxury+Wedding+Celebration&location=The+St.+Regis+Sky+Ballroom+CDMX"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-[#D3B48C]/15 hover:bg-[#D3B48C]/25 text-[#D3B48C] border border-[#D3B48C]/50 font-cinzel text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. NUESTRA HISTORIA / STORYTELLING */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/[0.04] border border-[#D3B48C]/40 backdrop-blur-xl shadow-2xl text-center space-y-3">
          <EditBadge label="Nuestra Historia VIP" position="top-right" theme="gold" />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
            OUR STORY & VISION
          </span>
          <h3 className="text-xl font-cinzel font-bold text-white">
            {sections?.story?.title || 'Exclusividad & Visión'}
          </h3>
          <p className="text-xs text-slate-300 font-mono leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'Una velada contemporánea donde la tecnología y la alta costura se encuentran para celebrar nuestra historia de amor.'}»
          </p>
        </section>
      )}

      {/* 4. ITINERARIO INTERACTIVO */}
      <section className="relative p-6 rounded-3xl bg-white/[0.04] border border-[#D3B48C]/40 backdrop-blur-xl shadow-2xl space-y-4">
        <EditBadge label="Timeline VIP" position="top-right" theme="gold" />
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
            EVENT TIMELINE
          </span>
          <h3 className="text-xl font-cinzel font-bold text-white">Cronograma VIP</h3>
        </div>
        <div className="space-y-4 pt-2 border-l border-[#D3B48C]/40 pl-6 ml-3">
          {[
            { time: '19:00 HRS', title: 'Black Tie Reception & Cocktail', desc: 'Glass Pavilion Terrace' },
            { time: '20:30 HRS', title: 'Signature Dinner & Grand Toast', desc: 'Imperial Sky Ballroom' },
            { time: '22:30 HRS', title: 'After Party & Sound Experience', desc: 'The Private Lounge' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#D3B48C] shadow-lg shadow-[#D3B48C]/50 ring-4 ring-[#0A0A0C]" />
              <span className="text-xs font-mono font-bold text-[#D3B48C] block">{item.time}</span>
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 font-mono">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. UBICACIÓN Y SEDE */}
      <section className="relative p-6 rounded-3xl bg-white/[0.04] border border-[#D3B48C]/40 backdrop-blur-xl shadow-2xl space-y-4 text-center">
        <EditBadge label="Ubicación VIP" position="top-right" theme="gold" />
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
          VENUE & ACCESS
        </span>
        <h3 className="text-xl font-cinzel font-bold text-white">{sections?.location?.venueName || 'The St. Regis Sky Ballroom'}</h3>
        <p className="text-xs text-slate-300 font-mono">{sections?.location?.address || 'Paseo de la Reforma 439, CDMX'}</p>
        
        <div className="h-40 rounded-2xl bg-black/60 border border-[#D3B48C]/30 p-4 flex flex-col items-center justify-center space-y-1">
          <MapPin className="h-7 w-7 text-[#D3B48C] animate-bounce" />
          <p className="text-xs font-mono text-white">The St. Regis • Piso 51</p>
          <span className="text-[10px] text-slate-400">Valet Parking & Acceso VIP disponible</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D3B48C]/50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D3B48C]/50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA DE MOMENTOS */}
      <section className="relative p-6 rounded-3xl bg-white/[0.04] border border-[#D3B48C]/40 backdrop-blur-xl shadow-2xl space-y-4">
        <EditBadge label="Galería Visual" position="top-right" theme="gold" />
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
            EXCLUSIVE MOMENTS
          </span>
          <h3 className="text-xl font-cinzel font-bold text-white">Galería VIP</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 3).map((gImg, idx) => (
            <div key={idx} className="h-28 rounded-2xl overflow-hidden border border-[#D3B48C]/40 shadow-lg">
              <img src={gImg} alt="Gallery" className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/[0.04] border border-[#D3B48C]/40 backdrop-blur-xl shadow-2xl text-center space-y-3">
          <EditBadge label="Dress Code VIP" position="top-right" theme="gold" />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
            DRESS CODE PROTOCOL
          </span>
          <h4 className="text-lg font-cinzel font-bold text-white">
            {sections?.dressCode?.type || 'Black Tie / Gala Vanguardista'}
          </h4>
          <p className="text-xs text-slate-300 font-mono max-w-md mx-auto">
            {sections?.dressCode?.description || 'Hombres: Smoking negro clásico. Mujeres: Vestido de gala largo en negro, dorado o plata.'}
          </p>
          <div className="flex justify-center gap-2.5 pt-1">
            {['#0A0A0C', '#D3B48C', '#EADBC6', '#FAF6F0'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-full border border-[#D3B48C]/60 shadow-lg" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA DE REGALOS & CLABE VIP */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/[0.04] border border-[#D3B48C]/40 backdrop-blur-xl shadow-2xl text-center space-y-4">
          <EditBadge label="Mesa de Regalos VIP" position="top-right" theme="gold" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
              GIFT REGISTRY & TRANSFER
            </span>
            <h4 className="text-xl font-cinzel font-bold text-white">
              {sections?.giftRegistry?.title || 'Mesa de Regalos & CLABE VIP'}
            </h4>
            <p className="text-xs text-slate-300 font-mono">
              {sections?.giftRegistry?.description || 'Agradecemos de corazón celebrar con nosotros.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://www.elpalaciodehierro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-black/50 border border-[#D3B48C]/40 hover:border-[#D3B48C] text-center space-y-1 block transition-all"
            >
              <span className="text-xs font-cinzel font-bold text-[#D3B48C] block">El Palacio de Hierro</span>
              <span className="text-[10px] text-slate-400 font-mono">Evento: #889210</span>
            </a>
            <a
              href="https://amazon.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-black/50 border border-[#D3B48C]/40 hover:border-[#D3B48C] text-center space-y-1 block transition-all"
            >
              <span className="text-xs font-cinzel font-bold text-[#D3B48C] block">Amazon</span>
              <span className="text-[10px] text-slate-400 font-mono">Luxury Wishlist</span>
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-[#D3B48C]/40 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#D3B48C]">Transferencia Banorte VIP:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('072180009876543210', 'tech-luxury')}
                className="text-[10px] font-mono font-bold text-[#0A0A0C] bg-[#D3B48C] hover:bg-[#E5CAA5] px-3 py-1 rounded-full shadow transition-colors"
              >
                {copiedClabeId === 'tech-luxury' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-white">CLABE: 072180009876543210</p>
            <p className="text-[10px] text-slate-400 font-mono">Titular: Santiago & Camila</p>
          </div>
        </section>
      )}

      {/* 9. CONFIRMACIÓN DE ASISTENCIA (RSVP) */}
      <section className="relative p-6 rounded-3xl bg-white/[0.06] border border-[#D3B48C]/60 backdrop-blur-2xl shadow-2xl space-y-4">
        <EditBadge label="RSVP VIP" position="top-right" theme="gold" />
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#D3B48C] block font-cinzel">
            CONFIRMATION PROTOCOL
          </span>
          <h3 className="text-2xl font-cinzel font-bold text-white">Confirmación de Asistencia</h3>
        </div>

        {!genericRsvpSubmitted['tech-luxury'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'tech-luxury')} className="space-y-4 pt-2">
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#D3B48C] block mb-1">
                Nombre Completo del Titular:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Ej. Lic. Fernando Herrera"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#D3B48C]/40 text-xs text-white outline-none focus:border-[#D3B48C] font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#D3B48C] block mb-1">
                Pases VIP Solicitados:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#D3B48C]/40 text-xs text-white outline-none font-mono"
              >
                <option value={1} className="bg-[#0A0A0C]">1 Pase VIP</option>
                <option value={2} className="bg-[#0A0A0C]">2 Pases VIP</option>
                <option value={3} className="bg-[#0A0A0C]">3 Pases VIP</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#D3B48C] to-[#B89758] hover:from-[#E5CAA5] hover:to-[#C9A96E] text-[#0A0A0C] font-cinzel font-bold text-xs uppercase tracking-widest shadow-2xl transition-all transform hover:scale-102 active:scale-98"
            >
              Access VIP Confirmation • Confirmar
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-black/60 border border-[#D3B48C] text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-[#D3B48C] mx-auto" />
            <h4 className="text-lg font-cinzel font-bold text-white">¡Pase VIP Confirmado!</h4>
            <p className="text-xs font-mono text-[#D3B48C]">
              Hemos registrado el acceso para {genericRsvpName} ({genericRsvpCompanions} pases).
            </p>
          </div>
        )}
      </section>

    </div>
  );

  // =========================================================================
  // 4. ROYAL GOLD (Clásica / Gran Gala) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderRoyalGold = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-[#1A1814] selection:bg-[#8A1C14] selection:text-white">
      
      {/* 1. HERO / SELLO DE LACRE REAL */}
      <section className="relative p-8 bg-[#FAF6F0] border-4 border-double border-[#D3B48C] shadow-2xl text-center space-y-5">
        <EditBadge label="Hero de Gala" position="top-right" theme="gold" />
        <div className="mx-auto h-20 w-20 rounded-full bg-[#8A1C14] border-4 border-[#D3B48C] shadow-2xl flex items-center justify-center text-[#D3B48C]">
          <span className="font-serif text-2xl font-bold">A & C</span>
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-[#B89758] block font-playfair">
            {sections?.hero?.subtitle || 'TIENEN EL HONOR DE INVITARLE A SU MATRIMONIO'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-playfair font-black italic text-[#1A1814]">
            {sections?.hero?.title || 'Ana & Carlos'}
          </h1>
          <p className="text-xs text-[#8A1C14] font-playfair font-bold uppercase tracking-widest pt-1">
            {sections?.hero?.dateText || 'SÁBADO • XIV • NOVIEMBRE • MMXXVI'}
          </p>
        </div>
        <div className="relative h-72 w-full rounded-full overflow-hidden border-4 border-[#D3B48C] shadow-2xl mx-auto max-w-sm">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Royal Wedding" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA DE GALA */}
      <section className="relative p-6 bg-white border-2 border-[#D3B48C] shadow-xl text-center space-y-4">
        <EditBadge label="Contador de Gala" position="top-right" theme="gold" />
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
          Cuenta Regresiva de Nupcias
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DÍAS', value: '169' },
            { label: 'HORAS', value: '06' },
            { label: 'MINUTOS', value: '45' },
            { label: 'SEGUNDOS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 bg-[#FAF6F0] border border-[#D3B48C]/50 text-center">
              <span className="text-2xl sm:text-3xl font-playfair font-bold text-[#8A1C14] block leading-none">{t.value}</span>
              <span className="text-[8px] font-bold text-[#B89758] uppercase block mt-1">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Ana+y+Carlos&dates=20261114T180000Z/20261115T040000Z&details=Solemne+Matrimonio+de+Gran+Gala&location=Hacienda+San+Jose+de+Gracia+Puebla"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-[#8A1C14] hover:bg-[#6D150F] text-[#FAF6F0] font-playfair text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-[#D3B48C]"
        >
          <Calendar className="h-3.5 w-3.5 text-[#D3B48C]" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. NUESTRA HISTORIA / SOLEMNIDAD */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 bg-[#FAF6F0] border-2 border-[#D3B48C] shadow-xl text-center space-y-3">
          <EditBadge label="Nuestra Historia de Gala" position="top-right" theme="gold" />
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
            NUESTRA UNIÓN SOLEMNE
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#1A1814]">
            {sections?.story?.title || 'Nuestra Unión Solemne'}
          </h3>
          <p className="text-xs text-[#7A6E60] font-playfair italic leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'Con la bendición de Dios y de nuestras familias, consagramos nuestras vidas en santa unión matrimonial.'}»
          </p>
        </section>
      )}

      {/* 4. ITINERARIO SOLEMNE */}
      <section className="relative p-6 bg-white border-2 border-[#D3B48C] shadow-xl space-y-4">
        <EditBadge label="Orden Nupcial" position="top-right" theme="gold" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
            ORDEN DE LA CELEBRACIÓN
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#1A1814]">Itinerario Nupcial</h3>
        </div>
        <div className="space-y-4 pt-2 border-l-2 border-[#D3B48C] pl-6 ml-3">
          {[
            { time: '18:00 HRS', title: 'Solemne Ceremonia Religiosa', desc: 'Capilla Mayor del Santuario' },
            { time: '19:30 HRS', title: 'Brindis & Recepción de Gala', desc: 'Jardín de los Arcos Virreinales' },
            { time: '21:00 HRS', title: 'Banquete Real & Baile', desc: 'Gran Salón de los Espejos' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#8A1C14] border border-[#D3B48C]" />
              <span className="text-xs font-playfair font-bold text-[#8A1C14] block">{item.time}</span>
              <h4 className="text-sm font-bold text-[#1A1814]">{item.title}</h4>
              <p className="text-xs text-[#7A6E60] font-playfair">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEDE Y UBICACIÓN */}
      <section className="relative p-6 bg-white border-2 border-[#D3B48C] shadow-xl space-y-4 text-center">
        <EditBadge label="Sede Nupcial" position="top-right" theme="gold" />
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
          LUGAR DE LA CELEBRACIÓN
        </span>
        <h3 className="text-2xl font-playfair font-bold text-[#1A1814]">{sections?.location?.venueName || 'Hacienda San José de Gracia'}</h3>
        <p className="text-xs text-[#7A6E60]">{sections?.location?.address || 'Camino Virreinal Km 12, Puebla'}</p>

        <div className="h-40 bg-[#FAF6F0] border border-[#D3B48C] flex flex-col items-center justify-center p-4 space-y-1">
          <Crown className="h-6 w-6 text-[#B89758]" />
          <p className="text-xs font-playfair font-bold text-[#1A1814]">Hacienda San José de Gracia</p>
          <span className="text-[10px] text-[#7A6E60]">Acceso Principal por la Portada Mayor</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-[#FAF6F0] hover:bg-white border border-[#D3B48C] text-[#1A1814] text-xs font-playfair font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Navigation className="h-3.5 w-3.5 text-[#8A1C14]" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-[#FAF6F0] hover:bg-white border border-[#D3B48C] text-[#1A1814] text-xs font-playfair font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Compass className="h-3.5 w-3.5 text-[#8A1C14]" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA DE RECUERDOS */}
      <section className="relative p-6 bg-white border-2 border-[#D3B48C] shadow-xl space-y-4">
        <EditBadge label="Galería de Gala" position="top-right" theme="gold" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
            MEMORIAS REALES
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#1A1814]">Galería de Recuerdos</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 2).map((gImg, idx) => (
            <div key={idx} className="h-36 rounded-none border-2 border-[#D3B48C] overflow-hidden p-1 bg-[#FAF6F0]">
              <img src={gImg} alt="Royal Gallery" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 bg-[#FAF6F0] border-2 border-[#D3B48C] shadow-xl text-center space-y-3">
          <EditBadge label="Dress Code Gala" position="top-right" theme="gold" />
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
            CÓDIGO DE VESTIMENTA
          </span>
          <h4 className="text-xl font-playfair font-bold text-[#8A1C14]">
            {sections?.dressCode?.type || 'Rigurosa Etiqueta / Gran Gala'}
          </h4>
          <p className="text-xs text-[#7A6E60] font-playfair max-w-md mx-auto">
            {sections?.dressCode?.description || 'Caballeros: Esmoquin o Frac oscuro. Damas: Vestido largo de gala.'}
          </p>
          <div className="flex justify-center gap-2.5 pt-1">
            {['#8A1C14', '#B89758', '#FAF6F0'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-[#D3B48C] shadow-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA DE REGALOS & CLABE DE GALA */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 bg-white border-2 border-[#D3B48C] shadow-xl text-center space-y-4">
          <EditBadge label="Mesa de Gala" position="top-right" theme="gold" />
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
              MESA DE REGALOS & PRESENTES
            </span>
            <h4 className="text-2xl font-playfair font-bold text-[#1A1814]">
              {sections?.giftRegistry?.title || 'Mesa de Regalos & CLABE de Gala'}
            </h4>
            <p className="text-xs text-[#7A6E60] font-playfair">
              {sections?.giftRegistry?.description || 'El mayor honor es compartir este enlace con ustedes.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://www.elpalaciodehierro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#FAF6F0] border border-[#D3B48C] hover:bg-white text-center space-y-1 block transition-colors"
            >
              <span className="text-xs font-playfair font-bold text-[#8A1C14] block">El Palacio de Hierro</span>
              <span className="text-[10px] text-[#B89758] font-playfair">Evento: #410293</span>
            </a>
            <div className="p-3.5 bg-[#FAF6F0] border border-[#D3B48C] text-center space-y-1 block">
              <span className="text-xs font-playfair font-bold text-[#8A1C14] block">Lluvia de Sobres</span>
              <span className="text-[10px] text-[#B89758] font-playfair">Buzón en Recepción</span>
            </div>
          </div>

          <div className="p-4 bg-[#FAF6F0] border border-[#D3B48C] text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#8A1C14] font-playfair">Transferencia Santander Real:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('014180005432109876', 'royal-gold')}
                className="text-[10px] font-playfair font-bold text-white bg-[#8A1C14] hover:bg-[#6D150F] px-3 py-1 rounded-none shadow transition-colors"
              >
                {copiedClabeId === 'royal-gold' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-[#1A1814]">CLABE: 014180005432109876</p>
            <p className="text-[10px] text-[#7A6E60] font-playfair">Titular: Ana Victoria & Carlos Eduardo</p>
          </div>
        </section>
      )}

      {/* 9. CONFIRMACIÓN S.R.C. (RSVP) */}
      <section className="relative p-6 bg-[#FAF6F0] border-4 border-double border-[#D3B48C] shadow-2xl space-y-4">
        <EditBadge label="Confirmación S.R.C." position="top-right" theme="gold" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B89758] block font-playfair">
            S.R.C. • SE RUEGA CONTESTACIÓN
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#1A1814]">Confirmación de Asistencia</h3>
        </div>

        {!genericRsvpSubmitted['royal-gold'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'royal-gold')} className="space-y-4 pt-2">
            <div>
              <label className="text-xs uppercase font-playfair font-bold tracking-wider text-[#8A1C14] block mb-1">
                Nombre de los Distinguidos Invitados:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Familia / Nombre completo"
                className="w-full px-4 py-3 bg-white border border-[#D3B48C] text-xs text-[#1A1814] outline-none font-playfair"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-playfair font-bold tracking-wider text-[#8A1C14] block mb-1">
                Número de Lugares Reservados:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-[#D3B48C] text-xs text-[#1A1814] outline-none font-playfair"
              >
                <option value={1}>1 Asiento de Gala</option>
                <option value={2}>2 Asientos de Gala</option>
                <option value={3}>3 Asientos de Gala</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#8A1C14] hover:bg-[#6D150F] text-white font-playfair font-bold text-sm tracking-widest uppercase shadow-2xl border-2 border-[#D3B48C] transition-colors"
            >
              S.R.C. • Enviar Confirmación de Gala
            </button>
          </form>
        ) : (
          <div className="p-6 bg-white border-2 border-[#D3B48C] text-center space-y-2">
            <Crown className="h-8 w-8 text-[#8A1C14] mx-auto" />
            <h4 className="text-lg font-playfair font-bold text-[#1A1814]">¡Confirmación Recibida!</h4>
            <p className="text-xs text-[#7A6E60] font-playfair">
              Agradecemos la confirmación de {genericRsvpName}. Será un honor contar con su distinguida presencia.
            </p>
          </div>
        )}
      </section>

    </div>
  );

  // =========================================================================
  // 5. GLOW PARTY (XV Años / Fiesta Juvenil) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderGlowParty = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-white selection:bg-[#E0218A] selection:text-white">
      
      {/* 1. HERO NEÓN */}
      <section className="text-center space-y-4 pt-2 relative">
        <EditBadge label="Hero Neón" position="top-right" />
        <div className="inline-flex p-3 rounded-full bg-[#E0218A]/20 border border-[#00F0FF] shadow-lg animate-pulse">
          <Flame className="h-6 w-6 text-[#00F0FF]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#E0218A] via-[#00F0FF] to-[#9900FF] tracking-wider">
          {sections?.hero?.title || 'REGINA • MIS XV AÑOS'}
        </h1>
        <p className="text-xs text-[#00F0FF] font-mono tracking-widest uppercase">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
        <div className="relative h-72 sm:h-80 w-full rounded-3xl overflow-hidden border-2 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.4)] mt-4">
          <img src={design?.coverImageUrl || template?.previewImage} alt="XV Party" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA NEÓN */}
      <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#E0218A] shadow-[0_0_25px_rgba(224,33,138,0.3)] text-center space-y-4">
        <EditBadge label="Timer Neón" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#00F0FF] block">
          ⚡ COUNTDOWN TO THE PARTY ⚡
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DÍAS', value: '169' },
            { label: 'HORAS', value: '06' },
            { label: 'MINUTOS', value: '45' },
            { label: 'SEGS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-black/50 border border-[#00F0FF]/40 text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#00F0FF] block leading-none">{t.value}</span>
              <span className="text-[8px] font-bold text-[#E0218A] uppercase block mt-1">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mis+XV+Años+Regina&dates=20261205T200000Z/20261206T040000Z&details=Fiesta+Glow+Night+XV+Años&location=Salon+Crystal+Lights+Monterrey"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E0218A] to-[#00F0FF] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. NUESTRA HISTORIA / SEMBLANZA XV */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#E0218A] shadow-[0_0_25px_rgba(224,33,138,0.3)] text-center space-y-3">
          <EditBadge label="Semblanza XV" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#00F0FF] block">
            MY STORY & SPECIAL NIGHT
          </span>
          <h3 className="text-2xl font-bold text-white">
            {sections?.story?.title || 'Una Noche Inolvidable'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'Llegó el momento de celebrar mis 15 años en una fiesta llena de música, luces y grandes momentos con mis personas favoritas.'}»
          </p>
        </section>
      )}

      {/* 4. ITINERARIO DE FIESTA */}
      <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.3)] space-y-4">
        <EditBadge label="Show & Fiesta" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E0218A] block">
            LINEUP DE LA NOCHE
          </span>
          <h3 className="text-2xl font-bold text-white">Programa de la Fiesta</h3>
        </div>
        <div className="space-y-4 pt-2 border-l-2 border-[#E0218A] pl-6 ml-3">
          {[
            { time: '20:00 HRS', title: 'Red Carpet & Bienvenida Neón', desc: 'Lobby Principal & Fotos' },
            { time: '21:30 HRS', title: 'Vals Soñado & Gran Brindis', desc: 'Pista Central Iluminada' },
            { time: '22:30 HRS', title: 'DJ Live Set & Glow Party', desc: 'Club Room Experience' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
              <span className="text-xs font-mono font-bold text-[#00F0FF] block">{item.time}</span>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LUGAR DE LA FIESTA */}
      <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#E0218A] shadow-[0_0_25px_rgba(224,33,138,0.3)] space-y-4 text-center">
        <EditBadge label="Lugar de Fiesta" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#00F0FF] block">
          LOCATION
        </span>
        <h3 className="text-2xl font-bold text-white">{sections?.location?.venueName || 'Salón Crystal Lights'}</h3>
        <p className="text-xs text-slate-300">{sections?.location?.address || 'Av. Las Palmas #450, Monterrey'}</p>

        <div className="h-40 rounded-2xl bg-black/50 border border-[#00F0FF]/40 flex flex-col items-center justify-center p-4 space-y-1">
          <MapPin className="h-7 w-7 text-[#E0218A] animate-bounce" />
          <p className="text-xs font-bold text-white">Salón Crystal Lights</p>
          <span className="text-[10px] text-slate-300">Estacionamiento privado con seguridad</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-[#00F0FF] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Navigation className="h-3.5 w-3.5 text-[#00F0FF]" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-[#00F0FF] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Compass className="h-3.5 w-3.5 text-[#00F0FF]" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA SESIÓN XV */}
      <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.3)] space-y-4">
        <EditBadge label="Galería XV" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E0218A] block">
            MOMENTOS
          </span>
          <h3 className="text-2xl font-bold text-white">Sesión de Fotos XV</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 2).map((gImg, idx) => (
            <div key={idx} className="h-36 rounded-2xl border border-[#E0218A] overflow-hidden">
              <img src={gImg} alt="XV Gallery" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#E0218A] shadow-[0_0_25px_rgba(224,33,138,0.3)] text-center space-y-3">
          <EditBadge label="Dress Code Neón" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#00F0FF] block">
            DRESS CODE
          </span>
          <h4 className="text-xl font-bold text-white">
            {sections?.dressCode?.type || 'Glow Chic / Vestido & Traje Moderno'}
          </h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {sections?.dressCode?.description || '¡Ven listo para brillar! Acentos metálicos o neón bienvenidos.'}
          </p>
          <div className="flex justify-center gap-2.5 pt-1">
            {['#E0218A', '#00F0FF', '#9900FF', '#FFFFFF'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,240,255,0.5)]" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA DE REGALOS & LLUVIA DE SOBRES */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-[#1C0C36]/90 border-2 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.3)] text-center space-y-4">
          <EditBadge label="Mesa de Regalos XV" position="top-right" />
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E0218A] block">
              REGALOS & DETALLES
            </span>
            <h4 className="text-2xl font-bold text-white">
              {sections?.giftRegistry?.title || 'Mesa de Regalos & Sobres Neón'}
            </h4>
            <p className="text-xs text-slate-300">
              {sections?.giftRegistry?.description || '¡Tu presencia hace brillar mi noche! Si deseas hacerme un detalle:'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://mesaderegalos.liverpool.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-black/60 border border-[#E0218A] text-center space-y-1 block hover:border-[#00F0FF] transition-colors"
            >
              <span className="text-xs font-bold text-[#00F0FF] block">Liverpool XV</span>
              <span className="text-[10px] text-slate-300 font-mono">Evento: #772910</span>
            </a>
            <div className="p-3.5 rounded-2xl bg-black/60 border border-[#E0218A] text-center space-y-1 block">
              <span className="text-xs font-bold text-[#00F0FF] block">Lluvia de Sobres</span>
              <span className="text-[10px] text-slate-300 font-mono">Cofre Neón en Recepción</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/70 border border-[#00F0FF]/40 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#00F0FF]">Transferencia Citibanamex:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('002180076543210987', 'glow-party')}
                className="text-[10px] font-bold text-white bg-[#E0218A] hover:bg-[#C01B74] px-3 py-1 rounded-full shadow transition-colors"
              >
                {copiedClabeId === 'glow-party' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-white">CLABE: 002180076543210987</p>
            <p className="text-[10px] text-slate-400">Titular: Regina González (Mis XV)</p>
          </div>
        </section>
      )}

      {/* 9. RSVP ACCESO VIP */}
      <section className="relative p-6 rounded-3xl bg-[#1C0C36]/95 border-2 border-[#E0218A] shadow-[0_0_30px_rgba(224,33,138,0.4)] space-y-4">
        <EditBadge label="RSVP Neón" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#00F0FF] block">
            CONFIRMA TU ASISTENCIA
          </span>
          <h3 className="text-2xl font-bold text-white">¡No te quedes fuera!</h3>
        </div>

        {!genericRsvpSubmitted['glow-party'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'glow-party')} className="space-y-4 pt-2">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#00F0FF] block mb-1">
                Nombre de Invitado / Familia:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Escribe tu nombre..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#E0218A] text-xs text-white outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#00F0FF] block mb-1">
                Pases Confirmados:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#E0218A] text-xs text-white outline-none"
              >
                <option value={1} className="bg-[#1C0C36]">1 Pase</option>
                <option value={2} className="bg-[#1C0C36]">2 Pases</option>
                <option value={3} className="bg-[#1C0C36]">3 Pases</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#E0218A] to-[#00F0FF] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(224,33,138,0.5)] transition-transform hover:scale-102"
            >
              ⚡ Confirmar Acceso a la Fiesta
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-black/60 border border-[#00F0FF] text-center space-y-2">
            <Flame className="h-8 w-8 text-[#00F0FF] mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">¡Listo para Brillar!</h4>
            <p className="text-xs text-[#E0218A]">
              Pases registrados para {genericRsvpName} ({genericRsvpCompanions} personas).
            </p>
          </div>
        )}
      </section>

    </div>
  );

  // =========================================================================
  // 6. CINEMATIC NIGHT (Graduaciones / Galas de Honor) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderCinematicNight = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-[#F8FAFC] selection:bg-[#3B82F6] selection:text-white">
      
      {/* 1. HERO CINEMATOGRÁFICO */}
      <section className="text-center space-y-4 pt-2 relative">
        <EditBadge label="Gala de Honor" position="top-right" />
        <div className="inline-block p-2 rounded-full bg-blue-950 border border-blue-400/50">
          <Award className="h-6 w-6 text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-widest uppercase">
          {sections?.hero?.title || 'GENERACIÓN DE EXCELENCIA 2026'}
        </h1>
        <p className="text-xs text-blue-300 font-mono tracking-widest">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
        <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-600 shadow-2xl mt-4">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Graduation" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA DE GRADUACIÓN */}
      <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl text-center space-y-4">
        <EditBadge label="Timer Graduación" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
          CUENTA REGRESIVA PARA LA GALA
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DÍAS', value: '169' },
            { label: 'HORAS', value: '06' },
            { label: 'MINUTOS', value: '45' },
            { label: 'SEGS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-blue-400 block leading-none">{t.value}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase block mt-1">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gala+de+Graduacion+2026&dates=20260710T193000Z/20260711T030000Z&details=Gala+de+Graduacion+y+Noche+de+Honor&location=Centro+Internacional+de+Convenciones+Guadalajara"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <Calendar className="h-3.5 w-3.5 text-blue-200" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. SEMBLANZA DE GENERACIÓN (NUESTRA HISTORIA) */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl text-center space-y-3">
          <EditBadge label="Semblanza de Generación" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
            NUESTRO CAMINO AL ÉXITO
          </span>
          <h3 className="text-2xl font-cinzel font-bold text-white">
            {sections?.story?.title || 'Semblanza de Generación'}
          </h3>
          <p className="text-xs text-slate-300 font-mono leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'Años de entrega, desvelos y aprendizajes compartidos que hoy rinden su máximo fruto en una noche inolvidable de honor y compañerismo.'}»
          </p>
        </section>
      )}

      {/* 4. PROTOCOLO DE LA GALA */}
      <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl space-y-4">
        <EditBadge label="Protocolo" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
            PROGRAMA DE HONOR
          </span>
          <h3 className="text-2xl font-cinzel font-bold text-white">Protocolo de la Gala</h3>
        </div>
        <div className="space-y-4 pt-2 border-l-2 border-blue-500 pl-6 ml-3">
          {[
            { time: '19:30 HRS', title: 'Recepción & Alfombra Azul', desc: 'Foyer Principal & Fotografía de Generación' },
            { time: '20:30 HRS', title: 'Entrega de Reconocimientos', desc: 'Auditorio Magna de Graduados' },
            { time: '21:30 HRS', title: 'Cena de Gala & Brindis de Honor', desc: 'Gran Salón de Embajadores' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-500 shadow-md shadow-blue-500/50" />
              <span className="text-xs font-mono font-bold text-blue-400 block">{item.time}</span>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEDE DE LA GALA */}
      <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl space-y-4 text-center">
        <EditBadge label="Sede de Gala" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
          SEDE OFICIAL
        </span>
        <h3 className="text-2xl font-cinzel font-bold text-white">{sections?.location?.venueName || 'Centro Internacional de Convenciones'}</h3>
        <p className="text-xs text-slate-400">{sections?.location?.address || 'Av. Fundadores #100, Guadalajara'}</p>

        <div className="h-40 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center p-4 space-y-1">
          <Building className="h-7 w-7 text-blue-400" />
          <p className="text-xs font-bold text-white">Centro de Convenciones</p>
          <span className="text-[10px] text-slate-400">Acceso exclusivo con acreditación digital</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Navigation className="h-3.5 w-3.5 text-blue-400" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Compass className="h-3.5 w-3.5 text-blue-400" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA DE MOMENTOS */}
      <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl space-y-4">
        <EditBadge label="Memorias" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
            MOMENTOS DE HONOR
          </span>
          <h3 className="text-2xl font-cinzel font-bold text-white">Galería de la Generación</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 2).map((gImg, idx) => (
            <div key={idx} className="h-36 rounded-xl border border-slate-700 overflow-hidden">
              <img src={gImg} alt="Grad Gallery" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl text-center space-y-3">
          <EditBadge label="Dress Code Gala" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
            CÓDIGO DE VESTIMENTA
          </span>
          <h4 className="text-xl font-cinzel font-bold text-white">
            {sections?.dressCode?.type || 'Black Tie / Rigurosa Etiqueta'}
          </h4>
          <p className="text-xs text-slate-300 font-mono max-w-md mx-auto">
            {sections?.dressCode?.description || 'Graduados: Traje de Gala / Esmoquin. Acompañantes: Vestido de noche formal.'}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {['#030712', '#1E3A8A', '#3B82F6', '#94A3B8', '#F8FAFC'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-full border border-blue-400/50 shadow-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA DE HONOR & CLABE DE GENERACIÓN */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-slate-700 shadow-2xl text-center space-y-4">
          <EditBadge label="Mesa de Honor" position="top-right" />
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
              MESA DE HONOR & BRINDIS
            </span>
            <h4 className="text-2xl font-cinzel font-bold text-white">
              {sections?.giftRegistry?.title || 'Mesa de Honor & Aportaciones'}
            </h4>
            <p className="text-xs text-slate-400">
              {sections?.giftRegistry?.description || 'Agradecemos tus muestras de afecto y apoyo para los graduados.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://mesaderegalos.liverpool.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-slate-900 border border-slate-700 hover:border-blue-400 text-center space-y-1 block transition-colors rounded-xl"
            >
              <span className="text-xs font-bold text-blue-400 block">Liverpool Mesa</span>
              <span className="text-[10px] text-slate-400 font-mono">Evento: #GALA2026</span>
            </a>
            <a
              href="https://www.amazon.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-slate-900 border border-slate-700 hover:border-blue-400 text-center space-y-1 block transition-colors rounded-xl"
            >
              <span className="text-xs font-bold text-blue-400 block">Amazon Wishlist</span>
              <span className="text-[10px] text-slate-400 font-mono">Graduación 2026</span>
            </a>
          </div>

          <div className="p-4 bg-slate-900 border border-blue-500/40 rounded-xl text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-blue-400 font-mono">Transferencia BBVA Comité:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('012180098712345678', 'cinematic-night')}
                className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg shadow transition-colors"
              >
                {copiedClabeId === 'cinematic-night' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-white">CLABE: 012180098712345678</p>
            <p className="text-[10px] text-slate-400">Comité de Graduación Generación 2026</p>
          </div>
        </section>
      )}

      {/* 9. CONFIRMACIÓN DE BOLETOS (RSVP) */}
      <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#030712] border border-blue-500/50 shadow-2xl space-y-4">
        <EditBadge label="Registro RSVP" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-blue-400 block font-cinzel">
            CONFIRMACIÓN DE BOLETOS
          </span>
          <h3 className="text-2xl font-cinzel font-bold text-white">Registro para la Gala</h3>
        </div>

        {!genericRsvpSubmitted['cinematic-night'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'cinematic-night')} className="space-y-4 pt-2">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-blue-400 block mb-1">
                Nombre de Graduado o Acompañante:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Nombre completo..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-blue-400 block mb-1">
                Boletos de Gala Asignados:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
              >
                <option value={1}>1 Boleto</option>
                <option value={2}>2 Boletos</option>
                <option value={4}>4 Boletos (Familiar)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-transform hover:scale-102"
            >
              Confirmar Boletos para la Gala
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-xl bg-slate-900 border border-blue-400 text-center space-y-2">
            <Award className="h-8 w-8 text-blue-400 mx-auto" />
            <h4 className="text-lg font-cinzel font-bold text-white">¡Boletos Confirmados!</h4>
            <p className="text-xs text-blue-300">
              Hemos registrado la asistencia de {genericRsvpName} ({genericRsvpCompanions} boletos).
            </p>
          </div>
        )}
      </section>

    </div>
  );

  // =========================================================================
  // 7. SWEET CELEBRATION (Infantil / Bautizo) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderSweetCelebration = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-[#2C3E50] selection:bg-[#7AA7C7] selection:text-white">
      
      {/* 1. HERO DULCE */}
      <section className="text-center space-y-4 pt-2 relative">
        <EditBadge label="Hero Infantil" position="top-right" />
        <div className="inline-block p-3 rounded-full bg-white/90 border border-[#7AA7C7] shadow-md text-[#7AA7C7]">
          <Star className="h-6 w-6 text-[#7AA7C7] fill-[#7AA7C7]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic text-[#2C3E50]">
          {sections?.hero?.title || 'El Bautizo de Matías'}
        </h1>
        <p className="text-xs text-[#7AA7C7] uppercase tracking-widest font-bold">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
        <div className="relative h-72 sm:h-80 w-full rounded-[36px] overflow-hidden border-2 border-[#F5C6CB] shadow-xl mt-4">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Sweet" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA ANGELICAL */}
      <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-[0_15px_35px_rgba(122,167,199,0.15)] text-center space-y-4">
        <EditBadge label="Timer Pastel" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
          ✨ DÍAS PARA LA BENDICIÓN ✨
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DÍAS', value: '169' },
            { label: 'HORAS', value: '06' },
            { label: 'MINUTOS', value: '45' },
            { label: 'SEGUNDOS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-[#EAF4FC] border border-[#7AA7C7]/30 text-center">
              <span className="text-2xl sm:text-3xl font-playfair font-bold text-[#7AA7C7] block leading-none">{t.value}</span>
              <span className="text-[8px] font-bold text-[#2C3E50] uppercase block mt-1">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Bautizo+de+Matias&dates=20261010T120000Z/20261010T180000Z&details=Celebracion+del+Bautizo+de+Matias&location=Jardin+Las+Nubes+Queretaro"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-full bg-[#7AA7C7] hover:bg-[#6893B0] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. BENDICIÓN ANGELICAL (NUESTRA HISTORIA / SEMBLANZA) */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-md text-center space-y-3">
          <EditBadge label="Semblanza Infantil" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
            BENDICIÓN & GRATITUD
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2C3E50]">
            {sections?.story?.title || 'Bendición Angelical'}
          </h3>
          <p className="text-xs text-slate-600 font-playfair italic leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'Con inmensa alegría y gratitud en el corazón, recibimos la bendición de Dios para nuestro pequeño ángel.'}»
          </p>
        </section>
      )}

      {/* 4. PROGRAMA DEL BAUTIZO */}
      <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-md space-y-4">
        <EditBadge label="Programa" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
            MOMENTOS DEL DÍA
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2C3E50]">Programa del Bautizo</h3>
        </div>
        <div className="space-y-4 pt-2 border-l-2 border-[#7AA7C7] pl-6 ml-3">
          {[
            { time: '12:00 HRS', title: 'Santa Misa de Bautizo', desc: 'Templo Expiatorio' },
            { time: '14:00 HRS', title: 'Comida & Brindis Familiar', desc: 'Jardín Las Nubes' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#7AA7C7]" />
              <span className="text-xs font-bold text-[#7AA7C7] block">{item.time}</span>
              <h4 className="text-sm font-bold text-[#2C3E50]">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LUGAR DE LA RECEPCIÓN */}
      <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-md space-y-4 text-center">
        <EditBadge label="Lugar del Bautizo" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
          LUGAR DE LA RECEPCIÓN
        </span>
        <h3 className="text-2xl font-playfair font-bold text-[#2C3E50]">{sections?.location?.venueName || 'Jardín Las Nubes'}</h3>
        <p className="text-xs text-slate-500">{sections?.location?.address || 'Calle del Paraíso #88, Querétaro'}</p>

        <div className="h-40 rounded-2xl bg-[#EAF4FC] border border-[#7AA7C7]/40 flex flex-col items-center justify-center p-4 space-y-1">
          <MapPin className="h-7 w-7 text-[#7AA7C7]" />
          <p className="text-xs font-bold text-[#2C3E50]">Jardín Las Nubes</p>
          <span className="text-[10px] text-slate-500">Área infantil y jardines familiares</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-full bg-[#EAF4FC] hover:bg-white border border-[#7AA7C7] text-[#2C3E50] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Navigation className="h-3.5 w-3.5 text-[#7AA7C7]" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-full bg-[#EAF4FC] hover:bg-white border border-[#7AA7C7] text-[#2C3E50] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Compass className="h-3.5 w-3.5 text-[#7AA7C7]" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA DE RECUERDOS */}
      <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-md space-y-4">
        <EditBadge label="Recuerdos" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
            RECUERDOS DE MATÍAS
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2C3E50]">Galería de Fotos</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 2).map((gImg, idx) => (
            <div key={idx} className="h-36 rounded-2xl border border-[#F5C6CB] overflow-hidden">
              <img src={gImg} alt="Sweet Gallery" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-md text-center space-y-3">
          <EditBadge label="Dress Code Dulce" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
            CÓDIGO DE VESTIMENTA
          </span>
          <h4 className="text-xl font-playfair font-bold text-[#2C3E50]">
            {sections?.dressCode?.type || 'Blanco & Tonos Pastel'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {sections?.dressCode?.description || 'Sugerimos vestir ropa formal o casual en tonos claros, blancos o pasteles.'}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {['#7AA7C7', '#F5C6CB', '#EAF4FC', '#FFFFFF'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-full border border-[#7AA7C7]/40 shadow-xs" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA DE REGALOS & CLABE DE BAUTIZO */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 rounded-[36px] bg-white/95 border border-[#7AA7C7]/40 shadow-md text-center space-y-4">
          <EditBadge label="Mesa de Bautizo" position="top-right" />
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
              MESA DE REGALOS & SOBRES
            </span>
            <h4 className="text-2xl font-playfair font-bold text-[#2C3E50]">
              {sections?.giftRegistry?.title || 'Mesa de Regalos & Obsequios'}
            </h4>
            <p className="text-xs text-slate-500">
              {sections?.giftRegistry?.description || 'Tu presencia y cariño son el mejor regalo para nuestro bebé.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://mesaderegalos.liverpool.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#EAF4FC] border border-[#7AA7C7]/40 hover:bg-white text-center space-y-1 block transition-colors rounded-2xl"
            >
              <span className="text-xs font-bold text-[#2C3E50] block">Liverpool Bebés</span>
              <span className="text-[10px] text-[#7AA7C7] font-mono">Evento: #BAUTIZO2026</span>
            </a>
            <a
              href="https://www.amazon.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#EAF4FC] border border-[#7AA7C7]/40 hover:bg-white text-center space-y-1 block transition-colors rounded-2xl"
            >
              <span className="text-xs font-bold text-[#2C3E50] block">Amazon Baby</span>
              <span className="text-[10px] text-[#7AA7C7] font-mono">Wishlist Matías</span>
            </a>
          </div>

          <div className="p-4 bg-[#EAF4FC] border border-[#7AA7C7]/50 rounded-2xl text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#7AA7C7]">Transferencia Banorte:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('072180011223344556', 'sweet-celebration')}
                className="text-[10px] font-bold text-white bg-[#7AA7C7] hover:bg-[#6893B0] px-3 py-1 rounded-full shadow-xs transition-colors"
              >
                {copiedClabeId === 'sweet-celebration' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-[#2C3E50]">CLABE: 072180011223344556</p>
            <p className="text-[10px] text-slate-500">Titular: Familia Gómez Navarro</p>
          </div>
        </section>
      )}

      {/* 9. CONFIRMACIÓN FAMILIAR (RSVP) */}
      <section className="relative p-6 rounded-[36px] bg-white/95 border-2 border-[#7AA7C7] shadow-xl space-y-4">
        <EditBadge label="RSVP Familiar" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#7AA7C7] block">
            CONFIRMACIÓN FAMILIAR
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2C3E50]">Confirma tu Acompañamiento</h3>
        </div>

        {!genericRsvpSubmitted['sweet-celebration'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'sweet-celebration')} className="space-y-4 pt-2">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#7AA7C7] block mb-1">
                Familia / Nombre:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Ej. Familia Gómez..."
                className="w-full px-4 py-3 rounded-xl bg-[#EAF4FC] border border-[#7AA7C7]/40 text-xs text-[#2C3E50] outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#7AA7C7] block mb-1">
                Número de Personas:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#EAF4FC] border border-[#7AA7C7]/40 text-xs text-[#2C3E50] outline-none"
              >
                <option value={1}>1 Persona</option>
                <option value={2}>2 Personas</option>
                <option value={3}>3 Personas (Familia)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#7AA7C7] hover:bg-[#6893B0] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-102"
            >
              Confirmar Acompañamiento
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-[#EAF4FC] border border-[#7AA7C7] text-center space-y-2">
            <Star className="h-8 w-8 text-[#7AA7C7] fill-[#7AA7C7] mx-auto" />
            <h4 className="text-lg font-playfair font-bold text-[#2C3E50]">¡Gracias por Confirmar!</h4>
            <p className="text-xs text-[#7AA7C7]">
              Hemos registrado la asistencia de {genericRsvpName} ({genericRsvpCompanions} personas).
            </p>
          </div>
        )}
      </section>

    </div>
  );

  // =========================================================================
  // 8. ROMANCE CLÁSICO (Romeo & Julieta) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderRomanceClasico = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-[#2A1810] selection:bg-[#722F37] selection:text-white">
      
      {/* 1. HERO VINTAGE */}
      <section className="text-center space-y-4 pt-2 relative">
        <EditBadge label="Caligrafía Manuscrita" position="top-right" />
        <div className="inline-block p-2 text-[#722F37]">
          <Feather className="h-6 w-6 mx-auto" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-playfair italic text-[#722F37]">
          {sections?.hero?.title || 'Julieta & Romeo'}
        </h1>
        <p className="text-xs text-[#722F37] uppercase tracking-widest font-semibold font-playfair">
          {sections?.hero?.dateText} • {sections?.hero?.timeText}
        </p>
        <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border-2 border-[#C49A45] shadow-xl mt-4">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Romance" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA ROMÁNTICA */}
      <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl text-center space-y-4">
        <EditBadge label="Timer Romántico" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
          CUENTA REGRESIVA PARA EL SÍ
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DÍAS', value: '169' },
            { label: 'HORAS', value: '06' },
            { label: 'MINUTOS', value: '45' },
            { label: 'SEGUNDOS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white border border-[#C49A45]/50 text-center">
              <span className="text-2xl sm:text-3xl font-playfair font-bold text-[#722F37] block leading-none">{t.value}</span>
              <span className="text-[8px] font-bold text-[#C49A45] uppercase block mt-1">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Julieta+y+Romeo&dates=20261024T173000Z/20261025T040000Z&details=Nuestro+Amor+Eterno&location=Castillo+San+Jeronimo+Zacatecas"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-full bg-[#722F37] hover:bg-[#5C232A] text-white font-playfair text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <Calendar className="h-3.5 w-3.5 text-[#C49A45]" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. EL ENCUENTRO DE DOS ALMAS (NUESTRA HISTORIA) */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl text-center space-y-3">
          <EditBadge label="Historia Romántica" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
            EL ENCUENTRO DE DOS ALMAS
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2A1810]">
            {sections?.story?.title || 'El Encuentro de Dos Almas'}
          </h3>
          <p className="text-xs text-[#722F37] font-playfair italic leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'En un rincón del destino nuestras miradas coincidieron para jamás apartarse. Hoy escribimos el más bello poema de amor.'}»
          </p>
        </section>
      )}

      {/* 4. ITINERARIO EN EL CLAUSTRO */}
      <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl space-y-4">
        <EditBadge label="Itinerario" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
            MOMENTOS SOLEMNES
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2A1810]">Itinerario en el Claustro</h3>
        </div>
        <div className="space-y-4 pt-2 border-l-2 border-[#722F37] pl-6 ml-3">
          {[
            { time: '17:30 HRS', title: 'Ceremonia en el Claustro', desc: 'Capilla del Amor Eterno' },
            { time: '19:00 HRS', title: 'Brindis & Música Barroca', desc: 'Patio de los Jazmines' },
            { time: '20:30 HRS', title: 'Banquete Romántico', desc: 'Gran Salón Renacentista' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#722F37]" />
              <span className="text-xs font-playfair font-bold text-[#722F37] block">{item.time}</span>
              <h4 className="text-sm font-bold text-[#2A1810]">{item.title}</h4>
              <p className="text-xs text-[#722F37]/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEDE DEL CLAUSTRO */}
      <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl space-y-4 text-center">
        <EditBadge label="Sede" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
          SEDE ROMÁNTICA
        </span>
        <h3 className="text-2xl font-playfair font-bold text-[#2A1810]">{sections?.location?.venueName || 'Castillo San Jerónimo'}</h3>
        <p className="text-xs text-[#722F37]">{sections?.location?.address || 'Antigua Calzada Real #15, Zacatecas'}</p>

        <div className="h-40 rounded-xl bg-white border border-[#C49A45] flex flex-col items-center justify-center p-4 space-y-1">
          <Wine className="h-7 w-7 text-[#722F37]" />
          <p className="text-xs font-playfair font-bold text-[#2A1810]">Castillo San Jerónimo</p>
          <span className="text-[10px] text-[#722F37]">Claustro y jardines renacentistas</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-full bg-white hover:bg-[#FDF8ED] border border-[#722F37] text-[#2A1810] text-xs font-playfair font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Navigation className="h-3.5 w-3.5 text-[#722F37]" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-full bg-white hover:bg-[#FDF8ED] border border-[#722F37] text-[#2A1810] text-xs font-playfair font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Compass className="h-3.5 w-3.5 text-[#722F37]" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA VINTAGE */}
      <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl space-y-4">
        <EditBadge label="Galería" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
            MEMORIAS ETERNAS
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2A1810]">Galería Vintage</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 2).map((gImg, idx) => (
            <div key={idx} className="h-36 rounded-xl border border-[#C49A45] overflow-hidden">
              <img src={gImg} alt="Romance Gallery" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl text-center space-y-3">
          <EditBadge label="Dress Code Romántico" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
            CÓDIGO DE VESTIMENTA
          </span>
          <h4 className="text-xl font-playfair font-bold text-[#722F37]">
            {sections?.dressCode?.type || 'Etiqueta Rigurosa / Vino & Dorado'}
          </h4>
          <p className="text-xs text-[#722F37]/90 font-playfair max-w-md mx-auto">
            {sections?.dressCode?.description || 'Caballeros: Traje oscuro formal o frac. Damas: Vestido largo de noche.'}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {['#722F37', '#C49A45', '#F7EFE2', '#2A1810'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-full border border-[#C49A45] shadow-xs" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA DE REGALOS & CLABE NUPCIAL */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl text-center space-y-4">
          <EditBadge label="Mesa de Regalos" position="top-right" />
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
              MESA DE REGALOS & PRESENTES
            </span>
            <h4 className="text-2xl font-playfair font-bold text-[#2A1810]">
              {sections?.giftRegistry?.title || 'Mesa de Regalos & CLABE Nupcial'}
            </h4>
            <p className="text-xs text-[#722F37]/80 font-playfair">
              {sections?.giftRegistry?.description || 'Su bendición y presencia son nuestro mejor obsequio en esta vida.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://mesaderegalos.liverpool.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-white border border-[#C49A45] hover:bg-[#FAF6F0] text-center space-y-1 block transition-colors rounded-xl"
            >
              <span className="text-xs font-playfair font-bold text-[#722F37] block">Liverpool Nupcial</span>
              <span className="text-[10px] text-[#C49A45] font-playfair">Evento: #ROMANCE2026</span>
            </a>
            <a
              href="https://www.elpalaciodehierro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-white border border-[#C49A45] hover:bg-[#FAF6F0] text-center space-y-1 block transition-colors rounded-xl"
            >
              <span className="text-xs font-playfair font-bold text-[#722F37] block">Palacio de Hierro</span>
              <span className="text-[10px] text-[#C49A45] font-playfair">Boda Capuleto</span>
            </a>
          </div>

          <div className="p-4 bg-white border border-[#722F37]/40 rounded-xl text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#722F37] font-playfair">Transferencia BBVA Nupcial:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('012180066778899001', 'romance-clasico')}
                className="text-[10px] font-playfair font-bold text-white bg-[#722F37] hover:bg-[#5C232A] px-3 py-1 rounded-full shadow transition-colors"
              >
                {copiedClabeId === 'romance-clasico' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-[#2A1810]">CLABE: 012180066778899001</p>
            <p className="text-[10px] text-[#722F37] font-playfair">Titular: Julieta Capuleto & Romeo Montesco</p>
          </div>
        </section>
      )}

      {/* 9. CONFIRMACIÓN AL CLAUSTRO (RSVP) */}
      <section className="relative p-6 rounded-2xl bg-[#FDF8ED] border-2 border-[#722F37] shadow-xl space-y-4">
        <EditBadge label="RSVP Claustro" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#722F37] block font-playfair">
            CONFIRMACIÓN DE ASISTENCIA
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2A1810]">Acompañanos en el Claustro</h3>
        </div>

        {!genericRsvpSubmitted['romance-clasico'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'romance-clasico')} className="space-y-4 pt-2">
            <div>
              <label className="text-xs uppercase font-playfair font-bold tracking-wider text-[#722F37] block mb-1">
                Nombre de los Invitados:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Nombre completo..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#722F37]/50 text-xs text-[#2A1810] outline-none font-playfair"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-playfair font-bold tracking-wider text-[#722F37] block mb-1">
                Pases Requeridos:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#722F37]/50 text-xs text-[#2A1810] outline-none font-playfair"
              >
                <option value={1}>1 Pase</option>
                <option value={2}>2 Pases</option>
                <option value={3}>3 Pases</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#722F37] hover:bg-[#5C232A] text-white font-playfair font-bold text-xs uppercase tracking-widest shadow-xl transition-transform hover:scale-102"
            >
              Confirmar Asistencia al Claustro
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-xl bg-white border border-[#722F37] text-center space-y-2">
            <Heart className="h-8 w-8 text-[#722F37] mx-auto fill-[#722F37]" />
            <h4 className="text-lg font-playfair font-bold text-[#2A1810]">¡Asistencia Registrada!</h4>
            <p className="text-xs text-[#722F37] font-playfair">
              Gracias {genericRsvpName}. Será un deleite compartir este romance eterno contigo.
            </p>
          </div>
        )}
      </section>

    </div>
  );

  // =========================================================================
  // 9. ELEGANCIA EJECUTIVA (Empresarial & Corporativo) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderEleganciaEjecutiva = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-[#0F172A] selection:bg-[#B45309] selection:text-white">
      
      {/* 1. HERO CORPORATIVO */}
      <section className="text-center space-y-4 pt-2 relative">
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
        <div className="relative h-64 sm:h-72 w-full rounded-none overflow-hidden border border-slate-400 shadow-xl mt-4">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Executive" className="h-full w-full object-cover" />
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA EJECUTIVA */}
      <section className="relative p-6 rounded-none bg-white border border-slate-300 shadow-lg text-center space-y-4">
        <EditBadge label="Timer Oficial" position="top-right" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
          OFFICIAL SUMMIT COUNTDOWN
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DÍAS', value: '169' },
            { label: 'HORAS', value: '06' },
            { label: 'MINUTOS', value: '45' },
            { label: 'SEGUNDOS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-mono font-bold text-[#0F172A] block leading-none">{t.value}</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase block mt-1">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cumbre+Ejecutiva+2026&dates=20260917T183000Z/20260917T233000Z&details=Leadership+Summit+and+Anniversary+Gala&location=Torre+Mayor+Executive+Club+CDMX"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <Calendar className="h-3.5 w-3.5 text-[#B45309]" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. CELEBRANDO EL LIDERAZGO (HISTORIA INSTITUCIONAL) */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 rounded-none bg-white border border-slate-300 shadow-lg text-center space-y-3">
          <EditBadge label="Mensaje Institucional" position="top-right" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
            VISIÓN & LIDERAZGO
          </span>
          <h3 className="text-xl font-cinzel font-bold text-[#0F172A]">
            {sections?.story?.title || 'Celebrando el Liderazgo'}
          </h3>
          <p className="text-xs text-slate-600 font-mono leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'Un legado construido con excelencia, visión estratégica y la colaboración invaluable de nuestros líderes y aliados.'}»
          </p>
        </section>
      )}

      {/* 4. PROGRAMA EJECUTIVO */}
      <section className="relative p-6 rounded-none bg-white border border-slate-300 shadow-lg space-y-4">
        <EditBadge label="Programa" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
            AGENDA DE TRABAJO
          </span>
          <h3 className="text-xl font-cinzel font-bold text-[#0F172A]">Programa Ejecutivo</h3>
        </div>
        <div className="space-y-4 pt-2 border-l-2 border-[#B45309] pl-6 ml-3">
          {[
            { time: '18:30 HRS', title: 'Executive Welcome & Cocktail', desc: 'Atrium Terrace' },
            { time: '19:45 HRS', title: 'Keynote & Aniversario Speech', desc: 'Main Auditorium' },
            { time: '21:00 HRS', title: 'Cena de Gala & Networking VIP', desc: 'Executive Lounge' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-none bg-[#B45309]" />
              <span className="text-xs font-mono font-bold text-[#B45309] block">{item.time}</span>
              <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
              <p className="text-xs text-slate-500 font-mono">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEDE CORPORATIVA */}
      <section className="relative p-6 rounded-none bg-white border border-slate-300 shadow-lg space-y-4 text-center">
        <EditBadge label="Sede Corporativa" position="top-right" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
          SEDE DEL EVENTO
        </span>
        <h3 className="text-xl font-cinzel font-bold text-[#0F172A]">{sections?.location?.venueName || 'Torre Mayor Executive Club'}</h3>
        <p className="text-xs text-slate-500 font-mono">{sections?.location?.address || 'Av. Paseo de la Reforma 505, Piso 51, CDMX'}</p>

        <div className="h-40 bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-4 space-y-1">
          <Building className="h-7 w-7 text-[#0F172A]" />
          <p className="text-xs font-bold text-[#0F172A]">Torre Mayor • Piso 51</p>
          <span className="text-[10px] text-slate-500">Acreditación requerida en lobby</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Navigation className="h-3.5 w-3.5 text-[#B45309]" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Compass className="h-3.5 w-3.5 text-[#B45309]" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA / MEMORIA INSTITUCIONAL */}
      <section className="relative p-6 rounded-none bg-white border border-slate-300 shadow-lg space-y-4">
        <EditBadge label="Memoria Institucional" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
            INSTITUCIONAL
          </span>
          <h3 className="text-xl font-cinzel font-bold text-[#0F172A]">Memoria Gráfica</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 2).map((gImg, idx) => (
            <div key={idx} className="h-36 rounded-none border border-slate-300 overflow-hidden">
              <img src={gImg} alt="Corporate Gallery" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 rounded-none bg-white border border-slate-300 shadow-lg text-center space-y-3">
          <EditBadge label="Dress Code Ejecutivo" position="top-right" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
            CÓDIGO DE VESTIMENTA
          </span>
          <h4 className="text-xl font-cinzel font-bold text-[#0F172A]">
            {sections?.dressCode?.type || 'Business Formal / Traje Ejecutivo'}
          </h4>
          <p className="text-xs text-slate-600 font-mono max-w-md mx-auto">
            {sections?.dressCode?.description || 'Caballeros: Traje sastre oscuro con corbata. Damas: Traje sastre o vestido ejecutivo.'}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {['#0F172A', '#475569', '#B45309', '#E2E8F0'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-none border border-slate-400 shadow-xs" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA INSTITUCIONAL & CLABE CORPORATIVA */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 rounded-none bg-white border border-slate-300 shadow-lg text-center space-y-4">
          <EditBadge label="Mesa Institucional" position="top-right" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
              FONDO INSTITUCIONAL & RESPONSABILIDAD SOCIAL
            </span>
            <h4 className="text-xl font-cinzel font-bold text-[#0F172A]">
              {sections?.giftRegistry?.title || 'Fondo de Innovación & Obsequios'}
            </h4>
            <p className="text-xs text-slate-500 font-mono">
              {sections?.giftRegistry?.description || 'En lugar de presentes personales, promovemos donaciones a iniciativas de becas.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://mesaderegalos.liverpool.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-slate-50 border border-slate-300 hover:bg-slate-100 text-center space-y-1 block transition-colors rounded-none"
            >
              <span className="text-xs font-mono font-bold text-[#0F172A] block">Liverpool Corporativo</span>
              <span className="text-[10px] text-[#B45309] font-mono">Cuenta: #CORP2026</span>
            </a>
            <div className="p-3.5 bg-slate-50 border border-slate-300 text-center space-y-1 block rounded-none">
              <span className="text-xs font-mono font-bold text-[#0F172A] block">Fondo de Becas</span>
              <span className="text-[10px] text-[#B45309] font-mono">Donación Deducible</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-300 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#B45309] font-mono">Transferencia HSBC Premier:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('021180033445566778', 'elegancia-ejecutiva')}
                className="text-[10px] font-mono font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1 rounded-none shadow transition-colors"
              >
                {copiedClabeId === 'elegancia-ejecutiva' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-[#0F172A]">CLABE: 021180033445566778</p>
            <p className="text-[10px] text-slate-500 font-mono">Titular: Consorcio Empresarial Global S.A. de C.V.</p>
          </div>
        </section>
      )}

      {/* 9. REGISTRO DE CREDENCIAL (RSVP) */}
      <section className="relative p-6 rounded-none bg-white border-2 border-[#0F172A] shadow-xl space-y-4">
        <EditBadge label="Registro VIP" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] block">
            REGISTRO INSTITUCIONAL
          </span>
          <h3 className="text-xl font-cinzel font-bold text-[#0F172A]">Acreditación Ejecutiva</h3>
        </div>

        {!genericRsvpSubmitted['elegancia-ejecutiva'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'elegancia-ejecutiva')} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-mono font-bold text-[#0F172A] block mb-1">
                Nombre y Cargo:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Ej. Ing. Roberto Domínguez - Director General"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-xs text-[#0F172A] outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#0F172A] block mb-1">
                Acompañantes Acreditados:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-xs text-[#0F172A] outline-none font-mono"
              >
                <option value={1}>1 Acreditación Personal</option>
                <option value={2}>2 Acreditaciones</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono font-bold text-xs uppercase tracking-widest shadow-md transition-colors"
            >
              Registrar Credencial Ejecutiva
            </button>
          </form>
        ) : (
          <div className="p-6 bg-slate-50 border border-[#0F172A] text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-[#B45309] mx-auto" />
            <h4 className="text-lg font-cinzel font-bold text-[#0F172A]">Acreditación Confirmada</h4>
            <p className="text-xs text-slate-600 font-mono">
              Se ha emitido el pase de seguridad para {genericRsvpName}.
            </p>
          </div>
        )}
      </section>

    </div>
  );

  // =========================================================================
  // 10. TROPICAL SUNSET (Bodas / Playa / Jardín) - 8 MÓDULOS COMPLETOS
  // =========================================================================
  const renderTropicalSunset = () => (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-12 pb-36 relative text-[#2D1B12] selection:bg-[#C85A32] selection:text-white">
      
      {/* 1. HERO FRENTE AL MAR */}
      <section className="text-center space-y-4 pt-2 relative">
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
        <div className="relative h-72 sm:h-80 w-full rounded-3xl overflow-hidden shadow-xl mt-4 border-2 border-[#C85A32]/40">
          <img src={design?.coverImageUrl || template?.previewImage} alt="Tropical" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#C85A32]/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-center text-white text-xs font-semibold">
            {sections?.location?.venueName || 'Hotel Boutique Punta Palmilla'} • Los Cabos
          </div>
        </div>
      </section>

      {/* 2. CUENTA REGRESIVA PLAYERA */}
      <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl text-center space-y-4">
        <EditBadge label="Timer Ocaso" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
          ☀️ CUENTA REGRESIVA EN LA PLAYA ☀️
        </span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'DÍAS', value: '169' },
            { label: 'HORAS', value: '06' },
            { label: 'MINUTOS', value: '45' },
            { label: 'SEGUNDOS', value: '12' },
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-[#FDEEE2] border border-[#C85A32]/30 text-center">
              <span className="text-2xl sm:text-3xl font-playfair font-bold text-[#C85A32] block leading-none">{t.value}</span>
              <span className="text-[8px] font-bold text-[#E6953B] uppercase block mt-1">{t.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Lucia+y+Alejandro&dates=20261107T170000Z/20261108T030000Z&details=Nuestra+Boda+Frente+al+Mar&location=Hotel+Boutique+Punta+Palmilla+Los+Cabos"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-full bg-[#C85A32] hover:bg-[#B34D28] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>AGREGAR A GOOGLE CALENDAR</span>
        </a>
      </section>

      {/* 3. NUESTRO ATARDECER INOLVIDABLE (NUESTRA HISTORIA) */}
      {sections?.story?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl text-center space-y-3">
          <EditBadge label="Historia Playera" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
            NUESTRO ATARDECER INOLVIDABLE
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2D1B12]">
            {sections?.story?.title || 'Nuestro Amor Frente al Mar'}
          </h3>
          <p className="text-xs text-slate-600 font-playfair italic leading-relaxed max-w-md mx-auto">
            «{sections?.story?.content || 'Frente a las olas del Pacífico y bajo los colores dorados del ocaso, celebramos el inicio de nuestra mayor aventura juntos.'}»
          </p>
        </section>
      )}

      {/* 4. ITINERARIO PLAYERO */}
      <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl space-y-4">
        <EditBadge label="Itinerario" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
            MOMENTOS BAJO EL SOL
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2D1B12]">Itinerario Playero</h3>
        </div>
        <div className="space-y-4 pt-2 border-l-2 border-[#C85A32] pl-6 ml-3">
          {[
            { time: '17:00 HRS', title: 'Ceremonia al Atardecer', desc: 'Playa Punta Esmeralda' },
            { time: '18:30 HRS', title: 'Cóctel Tropical & Música Chill', desc: 'Deck Panorámico de la Playa' },
            { time: '20:00 HRS', title: 'Cena Bajo las Palmeras', desc: 'Terraza Ocaso' },
            { time: '22:00 HRS', title: 'Fiesta & Fogata Frente al Mar', desc: 'Pista Arena VIP' },
          ].map((item, idx) => (
            <div key={idx} className="relative space-y-0.5">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#C85A32]" />
              <span className="text-xs font-bold text-[#C85A32] block">{item.time}</span>
              <h4 className="text-sm font-bold text-[#2D1B12]">{item.title}</h4>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEDE EN LA PLAYA */}
      <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl space-y-4 text-center">
        <EditBadge label="Sede Playera" position="top-right" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
          LUGAR DEL EVENTO
        </span>
        <h3 className="text-2xl font-playfair font-bold text-[#2D1B12]">{sections?.location?.venueName || 'Hotel Boutique Punta Palmilla'}</h3>
        <p className="text-xs text-slate-600">{sections?.location?.address || 'Km 27.5 Carretera Costera, Los Cabos'}</p>

        <div className="h-40 rounded-2xl bg-[#FDEEE2] border border-[#C85A32]/30 flex flex-col items-center justify-center p-4 space-y-1">
          <Palmtree className="h-7 w-7 text-[#C85A32]" />
          <p className="text-xs font-bold text-[#2D1B12]">Hotel Boutique Punta Palmilla</p>
          <span className="text-[10px] text-slate-600">Recepción en el Deck de Playa</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-full bg-white hover:bg-[#FDEEE2] border border-[#C85A32] text-[#2D1B12] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Navigation className="h-3.5 w-3.5 text-[#C85A32]" />
            <span>Google Maps</span>
          </a>
          <a
            href="https://waze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-full bg-white hover:bg-[#FDEEE2] border border-[#C85A32] text-[#2D1B12] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Compass className="h-3.5 w-3.5 text-[#C85A32]" />
            <span>Waze</span>
          </a>
        </div>
      </section>

      {/* 6. GALERÍA PANORÁMICA */}
      <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl space-y-4">
        <EditBadge label="Galería Ocaso" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
            MOMENTOS EN EL PARAÍSO
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2D1B12]">Galería Panorámica</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          {(sections?.gallery?.images?.length ? sections.gallery.images : [
            'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
          ]).slice(0, 3).map((gImg, idx) => (
            <div key={idx} className="h-28 rounded-2xl border border-[#C85A32]/40 overflow-hidden shadow-xs">
              <img src={gImg} alt="Beach Gallery" className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {sections?.dressCode?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl text-center space-y-3">
          <EditBadge label="Dress Code Playa" position="top-right" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
            CÓDIGO DE VESTIMENTA
          </span>
          <h4 className="text-xl font-playfair font-bold text-[#C85A32]">
            {sections?.dressCode?.type || 'Playa Elegante / Guayabera & Vestido Vaporoso'}
          </h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {sections?.dressCode?.description || 'Caballeros: Guayabera de lino y pantalón claro. Damas: Vestido vaporoso o midi en tonos cálidos.'}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {['#C85A32', '#E6953B', '#FDEEE2', '#FFFFFF'].map((c, i) => (
              <div key={i} className="h-6 w-6 rounded-full border border-[#C85A32]/40 shadow-xs" style={{ backgroundColor: c }} />
            ))}
          </div>
        </section>
      )}

      {/* 8. MESA DE REGALOS & CLABE LUNA DE MIEL */}
      {sections?.giftRegistry?.enabled !== false && (
        <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32]/40 shadow-xl text-center space-y-4">
          <EditBadge label="Mesa Playera" position="top-right" />
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
              MESA DE REGALOS & LUNA DE MIEL
            </span>
            <h4 className="text-2xl font-playfair font-bold text-[#2D1B12]">
              {sections?.giftRegistry?.title || 'Mesa de Regalos & Luna de Miel'}
            </h4>
            <p className="text-xs text-slate-600">
              {sections?.giftRegistry?.description || 'Tu compañía en este atardecer es el mejor regalo para nuestra historia.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://mesaderegalos.liverpool.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#FDEEE2] border border-[#C85A32]/30 hover:bg-white text-center space-y-1 block transition-colors rounded-2xl"
            >
              <span className="text-xs font-bold text-[#2D1B12] block">Liverpool Playa</span>
              <span className="text-[10px] text-[#C85A32] font-mono">Evento: #PLAYA2026</span>
            </a>
            <a
              href="https://www.amazon.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#FDEEE2] border border-[#C85A32]/30 hover:bg-white text-center space-y-1 block transition-colors rounded-2xl"
            >
              <span className="text-xs font-bold text-[#2D1B12] block">Amazon Bodas</span>
              <span className="text-[10px] text-[#C85A32] font-mono">Wishlist Lucía & Ale</span>
            </a>
          </div>

          <div className="p-4 bg-[#FDEEE2] border border-[#C85A32]/40 rounded-2xl text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#C85A32]">Transferencia BBVA Luna de Miel:</span>
              <button
                type="button"
                onClick={() => handleCopyAnyClabe('012180044556677889', 'tropical-sunset')}
                className="text-[10px] font-bold text-white bg-[#C85A32] hover:bg-[#B34D28] px-3 py-1 rounded-full shadow transition-colors"
              >
                {copiedClabeId === 'tropical-sunset' ? '✓ ¡CLABE Copiada!' : 'Copiar CLABE'}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-[#2D1B12]">CLABE: 012180044556677889</p>
            <p className="text-[10px] text-slate-600">Titular: Lucía Morales & Alejandro Peña</p>
          </div>
        </section>
      )}

      {/* 9. CONFIRMACIÓN EN LA PLAYA (RSVP) */}
      <section className="relative p-6 rounded-3xl bg-white/95 border-2 border-[#C85A32] shadow-2xl space-y-4">
        <EditBadge label="RSVP Playa" position="top-right" />
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32] block">
            CONFIRMACIÓN DE ASISTENCIA
          </span>
          <h3 className="text-2xl font-playfair font-bold text-[#2D1B12]">Confirmación en el Paraíso</h3>
        </div>

        {!genericRsvpSubmitted['tropical-sunset'] ? (
          <form onSubmit={(e) => handleGenericRsvpSubmit(e, 'tropical-sunset')} className="space-y-4 pt-2">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#C85A32] block mb-1">
                Nombre de los Invitados:
              </label>
              <input
                type="text"
                required
                value={genericRsvpName}
                onChange={(e) => setGenericRsvpName(e.target.value)}
                placeholder="Nombre completo..."
                className="w-full px-4 py-3 rounded-xl bg-[#FDEEE2] border border-[#C85A32]/40 text-xs text-[#2D1B12] outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-[#C85A32] block mb-1">
                Pases Solicitados:
              </label>
              <select
                value={genericRsvpCompanions}
                onChange={(e) => setGenericRsvpCompanions(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#FDEEE2] border border-[#C85A32]/40 text-xs text-[#2D1B12] outline-none"
              >
                <option value={1}>1 Pase</option>
                <option value={2}>2 Pases</option>
                <option value={3}>3 Pases</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#C85A32] hover:bg-[#B34D28] text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <span>Confirmar Asistencia en la Playa</span>
              <SunMedium className="h-4 w-4 text-amber-200" />
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-[#FDEEE2] border border-[#C85A32] text-center space-y-2">
            <SunMedium className="h-8 w-8 text-[#C85A32] mx-auto animate-spin" style={{ animationDuration: '6s' }} />
            <h4 className="text-lg font-playfair font-bold text-[#2D1B12]">¡Nos Vemos en la Playa!</h4>
            <p className="text-xs text-[#C85A32]">
              Hemos confirmado el lugar para {genericRsvpName} ({genericRsvpCompanions} pases).
            </p>
          </div>
        )}
      </section>

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
          className={`transition-all duration-300 mx-auto relative flex flex-col ${
            deviceView === 'mobile'
              ? 'w-full max-w-[440px] rounded-[48px] border-[10px] border-[#0F2424] shadow-2xl overflow-hidden bg-[#F5F2EB] ring-2 ring-[#D3B48C]/40'
              : 'w-full max-w-4xl rounded-3xl border-2 border-[#D3B48C]/40 shadow-2xl overflow-hidden'
          }`}
          style={{
            minHeight: deviceView === 'mobile' ? '760px' : 'auto',
            height: deviceView === 'mobile' ? '820px' : 'auto',
            maxHeight: deviceView === 'mobile' ? '820px' : 'none',
          }}
        >
          {/* Dynamic Template Content */}
          <div
            ref={scrollContainerRef}
            data-scroll-container="true"
            className="w-full relative selection:bg-[#4E8281] selection:text-white mobile-preview-container flex flex-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflowY: (template?.id === 'botanical-garden' && !botanicalEnvelopeOpen) ? 'hidden' : 'auto',
              width: '100%',
              minHeight: '100%',
              height: '100%',
              flex: '1 1 auto',
              backgroundColor: design?.backgroundColor || '#F5F2EB',
              color: design?.textColor || '#3A332C',
              fontFamily: design?.fontFamilyBody || 'Montserrat, sans-serif',
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
            <div className="relative z-10 w-full flex-1 flex flex-col">
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
