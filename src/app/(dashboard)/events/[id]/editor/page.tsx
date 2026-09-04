'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Palette,
  Eye,
  Smartphone,
  Monitor,
  Save,
  Undo2,
  Sparkles,
  Music,
  Type,
  Layout,
  Sliders,
  ExternalLink,
  CheckCircle2,
  Calendar,
  MapPin,
  Heart,
  Gift,
  Shirt,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Check,
  Crown,
  Layers,
  Sparkle
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { Event, EventDesign, AnimationType, AnimationIntensity, AudioTrackId } from '@/types';
import { TEMPLATES_DATA } from '@/lib/templates-data';
import { PREINSTALLED_AUDIO_TRACKS } from '@/lib/audio-tracks';
import EventNavTabs from '@/components/ui/EventNavTabs';
import BackgroundEffects from '@/components/invitation/BackgroundEffects';
import FloatingAudioPlayer from '@/components/invitation/FloatingAudioPlayer';

export default function VisualEditorPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [design, setDesign] = useState<EventDesign | null>(null);
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<'templates' | 'photos' | 'music' | 'effects' | 'colors' | 'typography' | 'sections'>('templates');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Audio Previewer inside the editor toolbox
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const editorAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentEvent = InvitaStore.getEventById(eventId) || InvitaStore.getEvents()[0];
    if (currentEvent) {
      setEvent(currentEvent);
      // Ensure defaults for effects and audio if not present
      const initialDesign = {
        ...currentEvent.design,
        galleryCapacity: currentEvent.design.galleryCapacity || 6,
        galleryImages: currentEvent.design.galleryImages || [
          currentEvent.design.coverImageUrl,
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        ],
        effects: currentEvent.design.effects || {
          backgroundAnimation: true,
          animationType: 'petals',
          animationIntensity: 'medium',
          soundEnabled: true,
          microInteractions: true,
          hasEnvelopeIntro: false,
        },
        audio: currentEvent.design.audio || {
          trackId: 'romantico',
          trackName: 'Pista 1: Instrumental Romántico',
          musicAutoplay: false,
        },
      };
      setDesign(initialDesign);
    }
  }, [eventId]);

  useEffect(() => {
    const stopAudio = () => {
      if (editorAudioRef.current) {
        editorAudioRef.current.pause();
        editorAudioRef.current.currentTime = 0;
      }
      setPreviewTrackId(null);
    };

    window.addEventListener('popstate', stopAudio);
    window.addEventListener('pagehide', stopAudio);
    window.addEventListener('beforeunload', stopAudio);

    return () => {
      stopAudio();
      window.removeEventListener('popstate', stopAudio);
      window.removeEventListener('pagehide', stopAudio);
      window.removeEventListener('beforeunload', stopAudio);
    };
  }, []);

  const handleSave = () => {
    if (!event || !design) return;
    InvitaStore.updateEventDesign(event.id, design);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleApplyTemplatePreset = (templateId: string) => {
    const tmpl = TEMPLATES_DATA.find((t) => t.id === templateId);
    if (tmpl && design) {
      setDesign({
        ...design,
        templateId: tmpl.id,
        templateName: tmpl.name,
        primaryColor: tmpl.defaultDesign.primaryColor || design.primaryColor,
        secondaryColor: tmpl.defaultDesign.secondaryColor || design.secondaryColor,
        backgroundColor: tmpl.defaultDesign.backgroundColor || design.backgroundColor,
        textColor: tmpl.defaultDesign.textColor || design.textColor,
        accentColor: tmpl.defaultDesign.accentColor || design.accentColor,
        cardBackground: tmpl.defaultDesign.cardBackground || design.cardBackground,
        fontFamilyTitle: tmpl.defaultDesign.fontFamilyTitle || design.fontFamilyTitle,
        fontFamilyBody: tmpl.defaultDesign.fontFamilyBody || design.fontFamilyBody,
        badgeStyle: tmpl.defaultDesign.badgeStyle || design.badgeStyle,
        coverImageUrl: tmpl.defaultDesign.coverImageUrl || design.coverImageUrl,
        galleryCapacity: tmpl.defaultDesign.galleryCapacity || 1,
        galleryImages: tmpl.defaultDesign.galleryImages || design.galleryImages,
        effects: tmpl.defaultDesign.effects || design.effects,
        audio: tmpl.defaultDesign.audio || design.audio,
      });
    }
  };

  // Audio Playback for Editor Toolbox
  const handleTogglePreviewTrack = (trackUrl: string, trackId: string) => {
    if (!editorAudioRef.current) return;

    if (previewTrackId === trackId) {
      editorAudioRef.current.pause();
      setPreviewTrackId(null);
    } else {
      editorAudioRef.current.src = trackUrl;
      editorAudioRef.current.play();
      setPreviewTrackId(trackId);
    }
  };

  // Add / Remove Gallery Image
  const handleAddGalleryImage = (url: string) => {
    if (!design || !url.trim()) return;
    const currentImages = design.galleryImages || [];
    if (currentImages.length >= (design.galleryCapacity || 8)) return;
    setDesign({
      ...design,
      galleryImages: [...currentImages, url.trim()],
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (!design || !design.galleryImages) return;
    const updated = design.galleryImages.filter((_, i) => i !== index);
    setDesign({ ...design, galleryImages: updated });
  };

  if (!event || !design) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[#4E8281] font-semibold text-xs">
        Cargando editor OSHUN...
      </div>
    );
  }

  const OSHUN_SWATCHES = [
    { label: 'Turquesa Profundo', color: '#4E8281' },
    { label: 'Dorado Champagne', color: '#D3B48C' },
    { label: 'Turquesa Agua', color: '#97B8B3' },
    { label: 'Turquesa Niebla', color: '#C0D3CC' },
    { label: 'Verde Azulado', color: '#778F8C' },
    { label: 'Marfil Editorial', color: '#F4EDE2' },
    { label: 'Arena Cálida', color: '#EFE3D4' },
    { label: 'Océano Profundo', color: '#0F2424' },
  ];

  const currentTemplateObj = TEMPLATES_DATA.find((t) => t.id === design.templateId) || TEMPLATES_DATA[0];
  const activeAudioTrack = PREINSTALLED_AUDIO_TRACKS.find((t) => t.id === design.audio?.trackId) || PREINSTALLED_AUDIO_TRACKS[0];
  const resolvedAudioUrl = design.audio?.trackId === 'custom' && design.audio.customAudioUrl ? design.audio.customAudioUrl : activeAudioTrack.audioUrl;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Hidden Audio Player for Previewing in Editor */}
      <audio ref={editorAudioRef} onEnded={() => setPreviewTrackId(null)} />

      {/* Event Sub-Navigation Tabs */}
      <EventNavTabs />

      {/* Editor Top Bar */}
      <div className="rounded-2xl bg-white border border-[#D3B48C]/40 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#4E8281] text-white flex items-center justify-center shadow-md">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
                Editor Visual & Efectos • OSHUN
              </span>
              {savedSuccess && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in zoom-in">
                  <CheckCircle2 className="h-3 w-3" />
                  ¡Guardado con éxito!
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
              {event.title} • <span className="text-[#4E8281]">{currentTemplateObj.name.split('(')[0]}</span>
            </h2>
          </div>
        </div>

        {/* Viewport Switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-full bg-[#FAF6F0] border border-[#D3B48C]/30 text-xs font-semibold">
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                viewport === 'mobile'
                  ? 'bg-[#4E8281] text-white shadow-sm font-bold'
                  : 'text-[#778F8C] hover:text-[#162E2D]'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Móvil</span>
            </button>
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                viewport === 'desktop'
                  ? 'bg-[#4E8281] text-white shadow-sm font-bold'
                  : 'text-[#778F8C] hover:text-[#162E2D]'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Escritorio</span>
            </button>
          </div>

          <Link
            href={`/i/${event.slug}`}
            target="_blank"
            className="p-2 rounded-full bg-white text-[#4E8281] border border-[#4E8281]/40 hover:bg-[#FAF6F0] transition-colors shadow-sm"
            title="Ver en pestaña nueva"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>

          <button
            onClick={handleSave}
            className="btn-oshun-primary text-xs px-5 py-2 inline-flex items-center gap-1.5 shadow-md"
          >
            <Save className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[720px]">
        
        {/* Left Panel: Toolbox & Controls */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#D3B48C]/40 p-5 shadow-sm space-y-5 overflow-y-auto max-h-[780px]">
          
          {/* Main Studio Navigation Tabs */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 p-1 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/30 text-[10px] font-bold text-center">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-1.5 px-1 rounded-xl transition-all ${
                activeTab === 'templates' ? 'bg-[#4E8281] text-white' : 'text-[#778F8C]'
              }`}
            >
              Plantillas
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-1.5 px-1 rounded-xl transition-all ${
                activeTab === 'photos' ? 'bg-[#4E8281] text-white' : 'text-[#778F8C]'
              }`}
            >
              Fotos
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`py-1.5 px-1 rounded-xl transition-all ${
                activeTab === 'music' ? 'bg-[#4E8281] text-white' : 'text-[#778F8C]'
              }`}
            >
              Música
            </button>
            <button
              onClick={() => setActiveTab('effects')}
              className={`py-1.5 px-1 rounded-xl transition-all ${
                activeTab === 'effects' ? 'bg-[#4E8281] text-white' : 'text-[#778F8C]'
              }`}
            >
              Efectos
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`py-1.5 px-1 rounded-xl transition-all ${
                activeTab === 'colors' ? 'bg-[#4E8281] text-white' : 'text-[#778F8C]'
              }`}
            >
              Colores
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`py-1.5 px-1 rounded-xl transition-all ${
                activeTab === 'typography' ? 'bg-[#4E8281] text-white' : 'text-[#778F8C]'
              }`}
            >
              Fuentes
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-1.5 px-1 rounded-xl transition-all ${
                activeTab === 'sections' ? 'bg-[#4E8281] text-white' : 'text-[#778F8C]'
              }`}
            >
              Módulos
            </button>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: 10 PLANTILLAS DINÁMICAS                                    */}
          {/* ================================================================= */}
          {activeTab === 'templates' && (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#D3B48C] uppercase tracking-wider block">
                  Catálogo de 10 Diseños OSHUN
                </span>
                <p className="text-[#778F8C] text-[11px] mb-3">
                  Selecciona una plantilla para aplicar su paleta, tipografía, efectos visuales y capacidad fotográfica.
                </p>
              </div>

              <div className="space-y-2.5">
                {TEMPLATES_DATA.map((tmpl) => {
                  const isSelected = design.templateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleApplyTemplatePreset(tmpl.id)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#4E8281] bg-[#FAF6F0] shadow-md ring-2 ring-[#4E8281]/20'
                          : 'border-[#D3B48C]/30 bg-white hover:border-[#4E8281]/50'
                      }`}
                    >
                      <img
                        src={tmpl.previewImage}
                        alt={tmpl.name}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 border border-[#D3B48C]/40"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-[#D3B48C] uppercase tracking-wider truncate">
                            {tmpl.badge}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-[#4E8281] shrink-0" />}
                        </div>
                        <h4 className="font-bold text-[#162E2D] text-xs truncate" style={{ fontFamily: 'Cinzel, serif' }}>
                          {tmpl.name}
                        </h4>
                        <p className="text-[10px] text-[#778F8C] line-clamp-1">{tmpl.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: GESTIÓN DE FOTOGRAFÍAS (FOTO PRINCIPAL + GALERÍA)          */}
          {/* ================================================================= */}
          {activeTab === 'photos' && (
            <div className="space-y-5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#D3B48C] uppercase tracking-wider block">
                  Gestión Fotográfica
                </span>
                <p className="text-[#778F8C] text-[11px]">
                  Carga la foto principal de portada y administra la galería extendida.
                </p>
              </div>

              {/* 1. Foto Principal (Obligatoria) */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-3">
                <span className="font-bold text-[#162E2D] block">1. Foto Principal / Portada *</span>
                
                <div className="relative h-36 rounded-xl overflow-hidden border border-[#D3B48C]/50 shadow-inner">
                  <img
                    src={design.coverImageUrl}
                    alt="Foto Principal"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#778F8C] block">URL de la Imagen Principal:</label>
                  <input
                    type="text"
                    value={design.coverImageUrl}
                    onChange={(e) => setDesign({ ...design, coverImageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D3B48C]/40 text-xs text-[#162E2D] outline-none focus:ring-2 focus:ring-[#4E8281]"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] text-[#778F8C] block w-full">Imágenes de Ejemplo:</span>
                  {[
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
                  ].map((sampleUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDesign({ ...design, coverImageUrl: sampleUrl })}
                      className="px-2 py-1 rounded-lg bg-white border border-[#D3B48C]/30 text-[9px] font-semibold text-[#4E8281] hover:bg-[#EADBC6]/30"
                    >
                      Ejemplo {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Galería Extendida (3 a 8 fotos según plantilla) */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#162E2D]">2. Galería Extendida</span>
                  <span className="text-[10px] font-bold text-[#4E8281] bg-[#C0D3CC]/40 px-2 py-0.5 rounded-full">
                    {design.galleryImages?.length || 0} / {design.galleryCapacity || 6} fotos
                  </span>
                </div>

                {(design.galleryCapacity || 1) <= 1 ? (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    ℹ️ La plantilla actual (<em>{currentTemplateObj.name.split('(')[0]}</em>) está diseñada para 1 foto principal de alto impacto. Si deseas galería múltiple, cambia a <em>Botanical Garden</em>, <em>Tech-Luxury</em> o <em>Tropical Sunset</em>.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {design.galleryImages?.map((imgUrl, idx) => (
                        <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-[#D3B48C]/40 group">
                          <img src={imgUrl} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
                          <button
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Eliminar foto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {(design.galleryImages?.length || 0) < (design.galleryCapacity || 6) && (
                      <div className="pt-2 border-t border-[#D3B48C]/30 space-y-2">
                        <label className="text-[10px] font-bold text-[#778F8C] block">Agregar Foto a la Galería (URL):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="new-gallery-url"
                            placeholder="https://..."
                            className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#D3B48C]/40 text-xs text-[#162E2D] outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddGalleryImage((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('new-gallery-url') as HTMLInputElement;
                              if (input && input.value) {
                                handleAddGalleryImage(input.value);
                                input.value = '';
                              }
                            }}
                            className="btn-oshun-primary text-xs px-3 py-1.5"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: MÚSICA & BANCO DE PISTAS HÍBRIDO                           */}
          {/* ================================================================= */}
          {activeTab === 'music' && (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#D3B48C] uppercase tracking-wider block">
                  Sistema de Audio Híbrido
                </span>
                <p className="text-[#778F8C] text-[11px]">
                  Elige entre las 5 pistas maestras preinstaladas o ingresa tu propio archivo de audio.
                </p>
              </div>

              {/* Master Switch for Audio */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#162E2D] block">Música de Fondo en Invitación</span>
                  <span className="text-[10px] text-[#778F8C]">Muestra el botón flotante Play/Pausa en la esquina</span>
                </div>
                <input
                  type="checkbox"
                  checked={design.effects?.soundEnabled ?? true}
                  onChange={(e) =>
                    setDesign({
                      ...design,
                      effects: {
                        ...(design.effects || {
                          backgroundAnimation: true,
                          animationType: 'petals',
                          animationIntensity: 'medium',
                          microInteractions: true,
                        }),
                        soundEnabled: e.target.checked,
                      },
                    })
                  }
                  className="h-5 w-5 rounded text-[#4E8281] focus:ring-[#4E8281] cursor-pointer"
                />
              </div>

              {/* 5 Preinstalled Audio Tracks */}
              <div className="space-y-2">
                <label className="font-bold text-[#162E2D] block">Banco de Pistas Predeterminadas (5 Opciones):</label>
                
                {PREINSTALLED_AUDIO_TRACKS.map((track) => {
                  const isSelected = design.audio?.trackId === track.id;
                  const isAudioPlaying = previewTrackId === track.id;

                  return (
                    <div
                      key={track.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#4E8281] bg-[#FAF6F0] shadow-sm'
                          : 'border-[#D3B48C]/30 bg-white hover:border-[#4E8281]/40'
                      }`}
                    >
                      <div
                        onClick={() =>
                          setDesign({
                            ...design,
                            audio: {
                              trackId: track.id,
                              trackName: track.name,
                              musicAutoplay: design.audio?.musicAutoplay ?? false,
                            },
                          })
                        }
                        className="flex-1 cursor-pointer min-w-0"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#162E2D] truncate">{track.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#4E8281] shrink-0" />}
                        </div>
                        <p className="text-[10px] text-[#778F8C] truncate">{track.genre} • {track.recommendedFor}</p>
                      </div>

                      {/* Preview Listen Button */}
                      <button
                        type="button"
                        onClick={() => handleTogglePreviewTrack(track.audioUrl, track.id)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                          isAudioPlaying
                            ? 'bg-[#0F2424] text-[#D3B48C]'
                            : 'bg-[#FAF6F0] hover:bg-[#EADBC6] text-[#4E8281]'
                        }`}
                        title={isAudioPlaying ? 'Pausar muestra' : 'Escuchar muestra'}
                      >
                        {isAudioPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Custom Track URL */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#162E2D]">Carga de Audio Propio (MP3/WAV/AAC)</span>
                  <button
                    onClick={() =>
                      setDesign({
                        ...design,
                        audio: {
                          trackId: 'custom',
                          trackName: 'Pista Personalizada',
                          customAudioUrl: design.audio?.customAudioUrl || '',
                          musicAutoplay: design.audio?.musicAutoplay ?? false,
                        },
                      })
                    }
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      design.audio?.trackId === 'custom' ? 'bg-[#4E8281] text-white' : 'bg-white border text-[#4E8281]'
                    }`}
                  >
                    Usar Propia
                  </button>
                </div>

                <input
                  type="text"
                  value={design.audio?.customAudioUrl || ''}
                  onChange={(e) =>
                    setDesign({
                      ...design,
                      audio: {
                        trackId: 'custom',
                        trackName: 'Pista Personalizada',
                        customAudioUrl: e.target.value,
                        musicAutoplay: design.audio?.musicAutoplay ?? false,
                      },
                    })
                  }
                  placeholder="https://servidor.com/mi-cancion.mp3"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D3B48C]/40 text-xs text-[#162E2D] outline-none"
                />
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: PANEL DE EFECTOS & PERSONALIZACIÓN                         */}
          {/* ================================================================= */}
          {activeTab === 'effects' && (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#D3B48C] uppercase tracking-wider block">
                  Efectos y Personalización
                </span>
                <p className="text-[#778F8C] text-[11px]">
                  Controla todas las animaciones de fondo, micro-interacciones y la intensidad visual.
                </p>
              </div>

              {/* 1. Switch Animaciones de Fondo */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#162E2D] block">[ Switch ] Animaciones de Fondo</span>
                  <span className="text-[10px] text-[#778F8C]">
                    Motor de partículas (pétalos, bokeh, nubes, confeti)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={design.effects?.backgroundAnimation ?? true}
                  onChange={(e) =>
                    setDesign({
                      ...design,
                      effects: {
                        ...(design.effects || {
                          animationType: 'petals',
                          animationIntensity: 'medium',
                          soundEnabled: true,
                          microInteractions: true,
                        }),
                        backgroundAnimation: e.target.checked,
                      },
                    })
                  }
                  className="h-5 w-5 rounded text-[#4E8281] focus:ring-[#4E8281] cursor-pointer"
                />
              </div>

              {/* 2. Switch Micro-interacciones al Clic */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#162E2D] block">[ Switch ] Micro-interacciones al Clic</span>
                  <span className="text-[10px] text-[#778F8C]">
                    Apertura de sobre, sellos, confeti y destellos al confirmar
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={design.effects?.microInteractions ?? true}
                  onChange={(e) =>
                    setDesign({
                      ...design,
                      effects: {
                        ...(design.effects || {
                          backgroundAnimation: true,
                          animationType: 'petals',
                          animationIntensity: 'medium',
                          soundEnabled: true,
                        }),
                        microInteractions: e.target.checked,
                      },
                    })
                  }
                  className="h-5 w-5 rounded text-[#4E8281] focus:ring-[#4E8281] cursor-pointer"
                />
              </div>

              {/* 3. Selector de Intensidad Visual */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-2">
                <label className="font-bold text-[#162E2D] block">Selector de Intensidad Visual:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((lvl) => {
                    const isSelected = (design.effects?.animationIntensity || 'medium') === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          setDesign({
                            ...design,
                            effects: {
                              ...(design.effects || {
                                backgroundAnimation: true,
                                animationType: 'petals',
                                soundEnabled: true,
                                microInteractions: true,
                              }),
                              animationIntensity: lvl,
                            },
                          })
                        }
                        className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-[#4E8281] text-white shadow-xs'
                            : 'bg-white text-[#162E2D] border border-[#D3B48C]/40 hover:bg-[#EFE3D4]'
                        }`}
                      >
                        {lvl === 'low' ? 'Baja' : lvl === 'medium' ? 'Media' : 'Alta'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Selector de Tipo de Animación Directo */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 space-y-2">
                <label className="font-bold text-[#162E2D] block">Efecto de Partículas Asignado:</label>
                <select
                  value={design.effects?.animationType || 'petals'}
                  onChange={(e) =>
                    setDesign({
                      ...design,
                      effects: {
                        ...(design.effects || {
                          backgroundAnimation: true,
                          animationIntensity: 'medium',
                          soundEnabled: true,
                          microInteractions: true,
                        }),
                        animationType: e.target.value as AnimationType,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D3B48C]/40 text-xs font-semibold text-[#162E2D] outline-none"
                >
                  <option value="fade">Minimal Fade (Sin partículas)</option>
                  <option value="petals">Hojas y Pétalos Botánicos</option>
                  <option value="bokeh">Partículas Doradas Bokeh</option>
                  <option value="envelope">Sobre de Lacre & Anillos (Royal Gold)</option>
                  <option value="glow-lights">Luces Neón de Fiesta (Glow Party)</option>
                  <option value="confetti-caps">Birretes & Confeti 3D (Cinematic Night)</option>
                  <option value="clouds-stars">Nubes & Estrellas (Sweet Celebration)</option>
                  <option value="doves-floral">Palomas & Floración (Romance Clásico)</option>
                  <option value="geometry">Geometría Abstracta (Elegancia Ejecutiva)</option>
                  <option value="tropical-breeze">Brisa de Palmeras & Sol (Tropical Sunset)</option>
                </select>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: COLORES & PALETAS                                          */}
          {/* ================================================================= */}
          {activeTab === 'colors' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#162E2D] mb-1.5">
                  Paleta Oficial OSHUN
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {OSHUN_SWATCHES.map((swatch, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDesign({ ...design, primaryColor: swatch.color })}
                      className="p-1.5 rounded-xl border border-[#D3B48C]/30 bg-[#FAF6F0] hover:border-[#4E8281] text-center space-y-1 transition-all"
                    >
                      <div className="h-6 w-full rounded-md shadow-inner" style={{ backgroundColor: swatch.color }} />
                      <span className="text-[9px] font-semibold text-[#778F8C] truncate block">{swatch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#162E2D] mb-1">Color Principal (Acento / Botones)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.primaryColor}
                    onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                    className="h-8 w-12 rounded-lg cursor-pointer border border-[#D3B48C]/40 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={design.primaryColor}
                    onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                    className="flex-1 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-3 py-1.5 font-mono text-xs uppercase text-[#162E2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#162E2D] mb-1">Color de Fondo General</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.backgroundColor}
                    onChange={(e) => setDesign({ ...design, backgroundColor: e.target.value })}
                    className="h-8 w-12 rounded-lg cursor-pointer border border-[#D3B48C]/40 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={design.backgroundColor}
                    onChange={(e) => setDesign({ ...design, backgroundColor: e.target.value })}
                    className="flex-1 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-3 py-1.5 font-mono text-xs uppercase text-[#162E2D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: TIPOGRAFÍAS                                                */}
          {/* ================================================================= */}
          {activeTab === 'typography' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#162E2D] mb-1.5">Tipografía para Títulos</label>
                <div className="space-y-2">
                  {[
                    { id: 'Cinzel', label: 'Cinzel (Oficial OSHUN)', sample: 'MARÍA & ANDRÉS', style: 'Cinzel, serif' },
                    { id: 'Playfair Display', label: 'Playfair Display (Editorial)', sample: 'María & Andrés', style: 'Playfair Display, serif' },
                    { id: 'Montserrat', label: 'Montserrat (Moderna)', sample: 'María & Andrés', style: 'Montserrat, sans-serif' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setDesign({ ...design, fontFamilyTitle: font.id })}
                      className={`w-full p-3 rounded-2xl border text-left transition-all ${
                        design.fontFamilyTitle === font.id
                          ? 'border-[#4E8281] bg-[#4E8281]/10 shadow-sm'
                          : 'border-[#D3B48C]/30 bg-[#FAF6F0] hover:border-[#4E8281]'
                      }`}
                    >
                      <span className="text-[10px] text-[#778F8C] block">{font.label}</span>
                      <span className="text-base font-bold text-[#162E2D] block mt-0.5" style={{ fontFamily: font.style }}>
                        {font.sample}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: MÓDULOS ACTIVOS                                            */}
          {/* ================================================================= */}
          {activeTab === 'sections' && (
            <div className="space-y-2.5 text-xs">
              <span className="block font-bold text-[#162E2D] mb-1">Activar o Desactivar Secciones</span>
              {[
                { key: 'countdown', label: 'Cuenta Regresiva' },
                { key: 'story', label: 'Nuestra Historia' },
                { key: 'schedule', label: 'Itinerario del Evento' },
                { key: 'location', label: 'Ubicación & Mapas' },
                { key: 'gallery', label: 'Galería de Fotos' },
                { key: 'dressCode', label: 'Código de Vestimenta' },
                { key: 'giftRegistry', label: 'Mesa de Regalos & CLABE' },
                { key: 'rsvp', label: 'Formulario RSVP' },
              ].map((sec) => (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/30"
                >
                  <span className="font-semibold text-[#162E2D]">{sec.label}</span>
                  <input
                    type="checkbox"
                    checked={(design.sections as any)[sec.key]?.enabled ?? true}
                    onChange={(e) =>
                      setDesign({
                        ...design,
                        sections: {
                          ...design.sections,
                          [sec.key]: {
                            ...(design.sections as any)[sec.key],
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="h-4 w-4 rounded text-[#4E8281] focus:ring-[#4E8281]"
                  />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Center Panel: Live Canvas Viewport with Real-time Animation Preview */}
        <div className="lg:col-span-8 rounded-3xl bg-[#EFE3D4]/50 border border-[#D3B48C]/40 p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center overflow-hidden relative">
          
          <div
            className={`transition-all duration-300 rounded-3xl overflow-y-auto shadow-2xl border-4 border-[#D3B48C]/50 relative ${
              viewport === 'mobile'
                ? 'w-[375px] h-[720px] max-w-full'
                : 'w-full h-[720px]'
            }`}
            style={{
              backgroundColor: design.backgroundColor,
              color: design.textColor,
              fontFamily: design.fontFamilyBody,
            }}
          >
            {/* Real-time Background Animation Engine inside previewer */}
            <BackgroundEffects
              enabled={design.effects?.backgroundAnimation ?? true}
              animationType={design.effects?.animationType || 'petals'}
              intensity={design.effects?.animationIntensity || 'medium'}
            />

            {/* Live Rendered Canvas Preview */}
            <div className="relative z-10 p-6 space-y-6 text-center">
              <OshunLogo variant="isotipo" size="md" />

              {/* Template Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#D3B48C]/40 text-[9px] font-bold uppercase tracking-wider text-[#4E8281] shadow-xs">
                <Sparkle className="h-2.5 w-2.5 text-[#D3B48C]" />
                <span>{currentTemplateObj.name.split('(')[0]}</span>
              </div>

              {/* Hero */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#778F8C]">
                  {design.sections.hero.subtitle || 'Te invitamos a celebrar juntos'}
                </p>
                <h1
                  className="text-2xl font-bold tracking-widest"
                  style={{
                    color: design.primaryColor,
                    fontFamily: `${design.fontFamilyTitle}, serif`,
                  }}
                >
                  {design.sections.hero.title || event.title}
                </h1>
                <p className="text-xs font-bold tracking-wider">
                  {event.date} • {event.time} HRS
                </p>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-[#D3B48C]/40 h-44 bg-[#FAF6F0]">
                <img
                  src={design.coverImageUrl}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Extended Gallery Preview if multi-photo */}
              {(design.galleryCapacity || 1) > 1 && (design.galleryImages?.length || 0) > 1 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C] block">
                    Galería de Fotos ({design.galleryImages?.length} imágenes)
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {design.galleryImages?.slice(0, 3).map((gImg, i) => (
                      <div key={i} className="h-16 rounded-xl overflow-hidden border border-[#D3B48C]/30 shadow-xs">
                        <img src={gImg} alt="Galería" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4-Box Metadata Row */}
              <div className="grid grid-cols-4 gap-1.5 py-3 px-2 rounded-2xl bg-white/90 border border-[#D3B48C]/30 text-[9px] shadow-sm">
                <div>
                  <Sparkles className="h-3 w-3 mx-auto text-[#D3B48C]" />
                  <span className="font-bold block mt-0.5">Ceremonia</span>
                  <span className="text-[#778F8C] block">17:00</span>
                </div>
                <div>
                  <Heart className="h-3 w-3 mx-auto text-[#D3B48C]" />
                  <span className="font-bold block mt-0.5">Recepción</span>
                  <span className="text-[#778F8C] block">18:30</span>
                </div>
                <div>
                  <MapPin className="h-3 w-3 mx-auto text-[#4E8281]" />
                  <span className="font-bold block mt-0.5">Lugar</span>
                  <span className="text-[#4E8281] block underline">Mapa</span>
                </div>
                <div>
                  <CheckCircle2 className="h-3 w-3 mx-auto text-[#4E8281]" />
                  <span className="font-bold block mt-0.5">RSVP</span>
                  <span className="text-[#778F8C] block">Confirmar</span>
                </div>
              </div>

              {/* Sample Action Button */}
              <button
                className="w-full py-3.5 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                style={{ backgroundColor: design.primaryColor }}
              >
                <Heart className="h-3.5 w-3.5 text-[#D3B48C]" />
                <span>Confirmar Asistencia</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
