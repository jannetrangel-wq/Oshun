'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  QrCode,
  Users,
  Smartphone,
  ShieldCheck,
  Heart,
  Calendar,
  Layers,
  MapPin,
  Gift,
  Mail,
  ChevronRight,
  ExternalLink,
  Laptop,
  Check,
  Crown,
  Eye,
  ArrowUpRight
} from 'lucide-react';

export default function DemoShowcasePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const ECOSYSTEM_STEPS = [
    {
      id: 'invitacion',
      tag: 'Pilar 1 • Experiencia del Invitado',
      title: 'Invitación Digital Editorial & Interactiva',
      desc: 'Tus invitados reciben una experiencia web inmersiva de alta fidelidad: música de fondo, animaciones fluidas, itinerario interactivo con Google Maps y Waze, mesa de regalos y confirmación RSVP al instante.',
      badge: '✦ Visualización Móvil & Web',
      previewType: 'mobile',
      highlights: [
        'Música ambiental personalizada y cuenta regresiva dinámica',
        'Botones directos de navegación Maps y Waze al recinto',
        'Formulario de confirmación con restricciones alimentarias',
        'Diseño responsive sin marcas de agua ni publicidad invasiva'
      ],
      mediaBg: 'bg-[#97B8B3]',
      ctaText: 'Ver Invitación Demo en Vivo',
      ctaUrl: '/i/boda-maria-andres-2026',
    },
    {
      id: 'pases-qr',
      tag: 'Pilar 2 • Control de Acceso',
      title: 'Pases Digitales & Boletos con Código QR',
      desc: 'Cada invitado confirmado recibe un boleto digital exclusivo con código QR encriptado, asignación de mesa y número de acompañantes autorizados para un acceso impecable.',
      badge: '✦ Boletos Inteligentes',
      previewType: 'ticket',
      highlights: [
        'Código QR único generado automáticamente al confirmar',
        'Indicación de mesa asignada y número de pases válidos',
        'Descarga directa y compatibilidad total con WhatsApp',
        'Protección total contra duplicados y accesos no autorizados'
      ],
      mediaBg: 'bg-[#FAF6F0]',
      ctaText: 'Probar Simulador de Pases en Panel',
      ctaUrl: '/demo/playground?tab=checkin',
    },
    {
      id: 'mesas-2d',
      tag: 'Pilar 3 • Organización Espacial',
      title: 'Salón 2D & Acomodo Inteligente de Mesas',
      desc: 'Diseña el plano de tu evento con vista aérea 2D: ubica la mesa de novios o de quinceañera, distribuye a tus familiares y amigos por zonas y monitorea el aforo de cada mesa en tiempo real.',
      badge: '✦ Plano Virtual Interactivo',
      previewType: 'seating',
      highlights: [
        'Mesas redondas, rectangulares y mesa de honor adaptativa',
        'Arrastra y acomoda mesas en el plano virtual 2D',
        'Métricas de sillas libres vs ocupadas en tiempo real',
        'División inteligente de familias y grupos de amigos'
      ],
      mediaBg: 'bg-[#FAF6F0]',
      ctaText: 'Probar Acomodo de Mesas en Vivo',
      ctaUrl: '/demo/playground?tab=seating',
    },
    {
      id: 'checkin-crm',
      tag: 'Pilar 4 • El Día del Evento',
      title: 'Recepción en Puerta & Monitoreo en Tiempo Real',
      desc: 'El personal de puerta escanea los códigos QR con la cámara de cualquier celular en menos de 1 segundo. Olvídate de listas en papel y filas interminables.',
      badge: '✦ Escáner de Puerta en 1-Clic',
      previewType: 'scanner',
      highlights: [
        'Validación instantánea en menos de 1 segundo por pase',
        'Registro de acompañantes reales que ingresan al recinto',
        'Estadísticas de asistencia y banquete en vivo',
        'Multi-dispositivo simultáneo para varias puertas de acceso'
      ],
      mediaBg: 'bg-[#0F2424]',
      ctaText: 'Probar Escáner en Modo Playground',
      ctaUrl: '/demo/playground?tab=checkin',
    },
  ];

  // Auto cycle through steps if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ECOSYSTEM_STEPS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStep = ECOSYSTEM_STEPS[activeStep];

  return (
    <div className="min-h-screen bg-[#F4EDE2] text-[#162E2D] relative overflow-x-hidden selection:bg-[#4E8281] selection:text-white">
      <Navbar />

      {/* Hero Presentation Header */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 overflow-hidden bg-oshun-waves">
        {/* Glows */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#C0D3CC]/35 blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D3B48C]/60 text-xs font-bold text-[#4E8281] shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span className="font-cinzel tracking-wider uppercase">Demostración Interactiva OSHUN</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#162E2D] tracking-wide"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Descubre la Experiencia OSHUN en Acción
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#778F8C] leading-relaxed">
            De la invitación digital más elegante al control de acceso con boletos QR y acomodo de mesas en tu gran día. Explora todas las herramientas antes de crear tu evento.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Link
              href="/demo/playground"
              className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-[#4E8281]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <span>🚀 Probar Mi Panel (Playground)</span>
              <ArrowRight className="h-4 w-4 text-[#D3B48C]" />
            </Link>

            <Link
              href="/i/boda-maria-andres-2026"
              target="_blank"
              className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4E8281] border-2 border-[#D3B48C]/60 hover:border-[#4E8281] font-bold text-xs tracking-wider uppercase transition-all inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>Ver Invitación Demo</span>
              <ExternalLink className="h-4 w-4 text-[#D3B48C]" />
            </Link>
          </div>

          <p className="text-[11px] text-[#778F8C] font-semibold">
            ✨ Acceso libre sin registro • Prueba la interfaz completa en tiempo real
          </p>
        </div>
      </section>

      {/* INTERACTIVE VIDEO / CAROUSEL TOUR PLAYER */}
      <section className="py-12 bg-white/70 border-y border-[#D3B48C]/30 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D3B48C] font-cinzel block">
                Tour Guiado del Ecosistema
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#162E2D]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Cómo Funciona OSHUN de Principio a Fin
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#D3B48C]/50 text-xs font-bold text-[#4E8281] flex items-center gap-1.5 hover:bg-[#EADBC6]/30 transition-colors"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pausar Tour' : 'Reproducir Tour'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Step Navigation Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {ECOSYSTEM_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-[#0F2424] text-white border-[#D3B48C] shadow-lg ring-2 ring-[#D3B48C]/40'
                      : 'bg-white hover:bg-[#FAF6F0] text-[#162E2D] border-[#D3B48C]/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#D3B48C]' : 'text-[#778F8C]'}`}>
                      Pilar 0{idx + 1}
                    </span>
                    {isActive && <div className="h-2 w-2 rounded-full bg-[#D3B48C] animate-pulse" />}
                  </div>
                  <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-[#162E2D]'}`} style={{ fontFamily: 'Cinzel, serif' }}>
                    {step.title.split('&')[0]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Player Display Container */}
          <div className="rounded-3xl bg-[#FAF6F0] border-2 border-[#D3B48C]/50 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Description and Highlights */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4E8281] bg-[#C0D3CC]/40 px-3 py-1 rounded-full inline-block">
                  {currentStep.tag}
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#162E2D] leading-tight"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {currentStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#778F8C] leading-relaxed">
                  {currentStep.desc}
                </p>
              </div>

              {/* Bullet Features */}
              <div className="space-y-2.5 pt-2 border-t border-[#D3B48C]/30">
                {currentStep.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#162E2D]">
                    <div className="h-5 w-5 rounded-full bg-[#4E8281] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>

              {/* Direct CTA */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={currentStep.ctaUrl}
                  className="btn-oshun-primary text-xs px-6 py-3 inline-flex items-center gap-2 shadow-lg"
                >
                  <span>{currentStep.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/demo/playground"
                  className="px-5 py-3 rounded-full bg-white hover:bg-[#EADBC6]/30 text-[#4E8281] border border-[#D3B48C] font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Abrir Sandbox</span>
                  <Laptop className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Simulated Frame */}
            <div className="lg:col-span-6 flex items-center justify-center">
              
              {/* 1. Mobile Invitation Simulator */}
              {currentStep.previewType === 'mobile' && (
                <div className="w-full max-w-sm rounded-[32px] bg-[#0F2424] p-3 shadow-2xl border-4 border-[#D3B48C]/60 text-white relative">
                  <div className="rounded-[24px] bg-[#97B8B3] p-5 text-center space-y-4 text-[#0F2424] overflow-hidden relative">
                    <div className="h-1.5 w-16 bg-[#0F2424]/30 rounded-full mx-auto" />
                    <OshunLogo variant="isotipo" size="sm" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold block">Boda de Gala</span>
                    <h4 className="text-xl font-bold tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
                      MARÍA & ANDRÉS
                    </h4>
                    <p className="text-[10px] italic">20 de Julio de 2026 • Los Cabos, BCS</p>
                    
                    <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#D3B48C]/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#4E8281]">
                        <span>✓ RSVP Confirmado</span>
                        <span>Mesa 01</span>
                      </div>
                      <p className="text-[10px] text-[#778F8C]">2 Asistentes • Menú Gourmet</p>
                    </div>

                    <Link
                      href="/i/boda-maria-andres-2026"
                      target="_blank"
                      className="w-full py-2.5 rounded-full bg-[#0F2424] text-white text-[11px] font-bold uppercase tracking-wider block shadow hover:bg-[#162E2D]"
                    >
                      Probar Invitación Completa
                    </Link>
                  </div>
                </div>
              )}

              {/* 2. QR Ticket Simulator */}
              {currentStep.previewType === 'ticket' && (
                <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-2 border-[#D3B48C] text-center space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D3B48C]/30 pb-3">
                    <span className="text-[10px] font-bold text-[#D3B48C] uppercase tracking-wider">Pase VIP Digital</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                  <h4 className="text-base font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                    Lic. Roberto Garza Sada
                  </h4>
                  <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#D3B48C]/40 inline-block">
                    <QrCode className="h-32 w-32 text-[#0F2424] mx-auto" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#FAF6F0] text-left">
                      <span className="text-[9px] text-[#778F8C] block uppercase">Mesa</span>
                      <span className="font-bold text-[#162E2D]">Mesa 01 (Honor)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF6F0] text-left">
                      <span className="text-[9px] text-[#778F8C] block uppercase">Pases</span>
                      <span className="font-bold text-[#162E2D]">2 Personas</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Seating Simulator */}
              {currentStep.previewType === 'seating' && (
                <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl border-2 border-[#D3B48C] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D3B48C]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                        Plano de Salón 2D
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#4E8281] bg-[#C0D3CC]/40 px-2.5 py-0.5 rounded-full">
                      85% Aforo
                    </span>
                  </div>

                  <div className="h-44 bg-[#FAF6F0] rounded-2xl border border-dashed border-[#D3B48C] relative p-3 flex items-center justify-around">
                    {/* Mesa Honor */}
                    <div className="p-2.5 rounded-2xl bg-[#0F2424] text-white text-center shadow border border-[#D3B48C] text-[10px] space-y-0.5">
                      <Crown className="h-4 w-4 text-[#D3B48C] mx-auto" />
                      <span className="font-bold block">Mesa Novios</span>
                      <span className="text-[#D3B48C] text-[9px]">2 / 2 Cupos</span>
                    </div>

                    {/* Mesa Redonda 1 */}
                    <div className="h-16 w-16 rounded-full bg-white border-2 border-[#4E8281] text-center shadow flex flex-col items-center justify-center text-[9px]">
                      <span className="font-bold text-[#162E2D]">Mesa 01</span>
                      <span className="text-[#4E8281] font-semibold">10 / 10</span>
                    </div>

                    {/* Mesa Redonda 2 */}
                    <div className="h-16 w-16 rounded-full bg-white border-2 border-[#D3B48C] text-center shadow flex flex-col items-center justify-center text-[9px]">
                      <span className="font-bold text-[#162E2D]">Mesa 02</span>
                      <span className="text-[#D3B48C] font-semibold">8 / 10</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#778F8C]">
                    <span>📍 24 Mesas creadas</span>
                    <span className="font-bold text-[#4E8281]">184 Invitados sentados</span>
                  </div>
                </div>
              )}

              {/* 4. Scanner Simulator */}
              {currentStep.previewType === 'scanner' && (
                <div className="w-full max-w-sm rounded-3xl bg-[#0F2424] p-6 shadow-2xl border-2 border-[#D3B48C] text-white text-center space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#D3B48C]">
                    <span className="font-bold uppercase tracking-wider">Escáner en Puerta</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 space-y-2 text-left">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>¡Acceso Autorizado!</span>
                    </div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                      Lic. Roberto Garza Sada
                    </p>
                    <p className="text-[11px] text-emerald-200">
                      Mesa: 01 (Honor) • Ingresan: 2 personas
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white/10 text-left">
                      <span className="text-[9px] text-gray-300 block uppercase">Ingresaron</span>
                      <span className="font-bold text-emerald-400 text-sm">167 / 184</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/10 text-left">
                      <span className="text-[9px] text-gray-300 block uppercase">Velocidad</span>
                      <span className="font-bold text-[#D3B48C] text-sm">&lt; 1 segundo</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* 4 PILARES DEL SERVICIO OSHUN */}
      <section className="py-20 bg-[#F4EDE2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#D3B48C]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Ventajas Exclusivas
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#4E8281]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Los 4 Pilares del Ecosistema OSHUN
            </h2>
            <p className="text-xs sm:text-sm text-[#778F8C] leading-relaxed">
              Diseñado minuciosamente para anfitriones y wedding planners que exigen distinción, orden y tranquilidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Diseño Editorial & Sin Anuncios',
                desc: 'Invitaciones con paleta de lujo, música y tipografía clásica. Cero banners publicitarios ni marcas intrusivas.',
                icon: Crown,
                color: 'text-[#D3B48C]',
              },
              {
                title: 'Cero Estrés de Confirmación',
                desc: 'Dashboard CRM en tiempo real que clasifica confirmados, dietas especiales y acompañantes al instante.',
                icon: Users,
                color: 'text-[#4E8281]',
              },
              {
                title: 'Control de Acceso con QR',
                desc: 'Lectura ultrarrápida desde el celular para evitar invitados no autorizados, colados o duplicaciones de pases.',
                icon: ShieldCheck,
                color: 'text-emerald-700',
              },
              {
                title: 'Concierge WhatsApp 1-Clic',
                desc: 'Envía pases personalizados y recordatorios a los teléfonos de tus invitados sin guardar números en tu agenda.',
                icon: Smartphone,
                color: 'text-[#4E8281]',
              },
            ].map((pilar, idx) => {
              const Icon = pilar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-[#D3B48C]/40 shadow-sm hover:shadow-xl hover:border-[#4E8281] transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 flex items-center justify-center shadow-xs">
                      <Icon className={`h-6 w-6 ${pilar.color}`} />
                    </div>
                    <h3
                      className="text-base font-bold text-[#162E2D]"
                      style={{ fontFamily: 'Cinzel, serif' }}
                    >
                      {pilar.title}
                    </h3>
                    <p className="text-xs text-[#778F8C] leading-relaxed">
                      {pilar.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#4E8281] uppercase tracking-wider pt-2 border-t border-[#D3B48C]/20 block">
                    ✦ OSHUN Signature
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CONVERSION CTA SECTION */}
      <section className="py-16 bg-[#0F2424] text-white relative overflow-hidden border-t-2 border-[#D3B48C]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#D3B48C]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#4E8281]/30 blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <OshunLogo variant="isotipo" size="md" />
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FAF6F0]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Experimenta el Poder de OSHUN Ahora Mismo
          </h2>
          <p className="text-xs sm:text-sm text-[#C0D3CC] max-w-xl mx-auto leading-relaxed">
            Ingresa a nuestro sandbox interactivo para probar el cambio de estados en la lista de invitados, acomodo de mesas y escáner de boletos.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo/playground"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase shadow-2xl transition-all inline-flex items-center justify-center gap-2 border border-[#D3B48C]/40"
            >
              <span>🚀 Entrar a Probar Mi Panel</span>
              <ArrowRight className="h-4 w-4 text-[#D3B48C]" />
            </Link>

            <Link
              href="/events/new"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-white hover:bg-[#FAF6F0] text-[#0F2424] font-bold text-xs tracking-wider uppercase transition-all inline-flex items-center justify-center gap-2 shadow-xl"
            >
              <span>Crear Mi Propio Evento</span>
              <Sparkles className="h-4 w-4 text-[#D3B48C]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
