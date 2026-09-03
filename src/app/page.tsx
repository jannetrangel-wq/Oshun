'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
  QrCode,
  Users,
  Smartphone,
  ShieldCheck,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Gift,
  Mail,
  MessageSquare,
  Bell,
  Navigation,
  Compass,
  Check,
  ChevronRight,
  ExternalLink,
  UserCheck,
  TrendingUp,
  Activity,
  Eye
} from 'lucide-react';
import { TEMPLATES_DATA } from '@/lib/templates-data';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'boda' | 'xv' | 'cumpleanos' | 'bautizo'>('all');

  const filteredTemplates =
    activeTab === 'all'
      ? TEMPLATES_DATA
      : TEMPLATES_DATA.filter((t) => t.category === activeTab);

  return (
    <div className="min-h-screen bg-[#F4EDE2] text-[#162E2D] relative overflow-x-hidden selection:bg-[#4E8281] selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-oshun-waves">
        {/* Decorative Blurred Glows */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#C0D3CC]/35 blur-[120px] -z-10" />
        <div className="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-[#D3B48C]/20 blur-[90px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Official OSHUN Full Brand Logo from assets/images */}
          <div className="flex flex-col items-center justify-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <OshunLogo variant="full" size="xl" showSlogan={true} />
          </div>

          {/* Value Prop Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#778F8C] leading-relaxed font-normal">
            Crea invitaciones digitales de alta fidelidad, administra confirmaciones RSVP en tiempo real, comparte por WhatsApp y controla el acceso con códigos QR exclusivos.
          </p>

          {/* Action CTAs - Executive Clean Centered Layout */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Link
              href="/events/new"
              className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-[#4E8281]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <span>Crear Mi Invitación</span>
              <ArrowRight className="h-4 w-4 text-[#D3B48C]" />
            </Link>

            <Link
              href="/i/boda-maria-andres-2026"
              className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full bg-white hover:bg-[#FAF6F0] text-[#4E8281] border-2 border-[#D3B48C]/60 hover:border-[#4E8281] font-bold text-xs tracking-wider uppercase transition-all inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>Ver Invitación Demo</span>
              <Sparkles className="h-4 w-4 text-[#D3B48C]" />
            </Link>
          </div>

          {/* Key Trust Signals */}
          <div className="pt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[#778F8C] font-semibold">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#4E8281]" />
              Confirmaciones en tiempo real
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#4E8281]" />
              Boletos QR personalizados
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#4E8281]" />
              Integración WhatsApp 1-clic
            </span>
          </div>
        </div>
      </section>

      {/* BRAND VALUES & ICONOGRAPHY */}
      <section id="caracteristicas" className="py-20 bg-[#EFE3D4]/50 border-y border-[#D3B48C]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#D3B48C]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Identidad & Propósito
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#4E8281]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Combinación clásica y moderna
            </h2>
            <p className="text-xs sm:text-sm text-[#778F8C] leading-relaxed">
              Elegante, legible y cálida. OSHUN transmite confianza, cercanía y sofisticación en cada detalle.
            </p>
          </div>

          {/* 7 Refined Icons from Guide */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
            {[
              { label: 'Invitaciones', icon: Mail, desc: 'Diseño editorial' },
              { label: 'Invitados', icon: Users, desc: 'CRM & Acompañantes' },
              { label: 'Confirmación', icon: Calendar, desc: 'RSVP en vivo' },
              { label: 'Regalos', icon: Gift, desc: 'Mesa & CLABE' },
              { label: 'Ubicación', icon: MapPin, desc: 'Maps & Waze' },
              { label: 'Mensajes', icon: MessageSquare, desc: 'WhatsApp 1-clic' },
              { label: 'Recordatorios', icon: Bell, desc: 'Alertas automáticas' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/80 border border-[#D3B48C]/30 shadow-sm hover:shadow-md hover:border-[#4E8281] transition-all space-y-2 group"
                >
                  <div className="h-10 w-10 mx-auto rounded-full bg-[#EADBC6]/30 group-hover:bg-[#4E8281] group-hover:text-white flex items-center justify-center text-[#4E8281] transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4
                    className="text-xs font-bold text-[#162E2D]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-[#778F8C]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEMPLATES CATALOG PREVIEW */}
      <section id="plantillas" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#D3B48C]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Colección Exclusiva
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#4E8281]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Plantillas Diseñadas para Impresionar
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-full bg-white/80 border border-[#D3B48C]/30 text-xs font-semibold">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'boda', label: 'Bodas' },
              { id: 'xv', label: 'XV Años' },
              { id: 'cumpleanos', label: 'Cumpleaños' },
              { id: 'bautizo', label: 'Bautizos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#4E8281] text-white shadow-sm font-bold'
                    : 'text-[#778F8C] hover:text-[#162E2D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group rounded-3xl overflow-hidden bg-white border border-[#D3B48C]/35 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden bg-[#EFE3D4]">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {template.isPremium && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-[#D3B48C] text-[#0F2424] shadow-sm flex items-center gap-1">
                    <span>✦</span>
                    <span>Insignia OSHUN</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2424]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                  <Link
                    href={`/templates/${template.id}`}
                    className="w-full py-2.5 rounded-full bg-[#4E8281] text-white font-bold text-xs tracking-wider uppercase text-center shadow-lg inline-flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Ver Prototipo Interactivo</span>
                  </Link>
                </div>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-base font-bold text-[#162E2D]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {template.name}
                  </h3>
                  <p className="text-xs text-[#778F8C] line-clamp-2 mt-1">{template.description}</p>
                </div>

                <div className="pt-3 border-t border-[#D3B48C]/20 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {template.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#EADBC6]/30 text-[#4E8281] font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/templates/${template.id}`}
                    className="text-xs font-bold text-[#4E8281] hover:text-[#3E6D6C] inline-flex items-center gap-1"
                  >
                    <span>Ver Modelo</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="precios" className="py-20 bg-[#EFE3D4]/60 border-t border-[#D3B48C]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-2 max-w-xl mx-auto">
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#D3B48C]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Planes Flexibles
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#4E8281]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Inversión Transparente para Tu Evento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Plan Gratuito */}
            <div className="p-7 rounded-3xl bg-white border border-[#D3B48C]/40 shadow-md space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#778F8C]">Esencial</span>
                <h3 className="text-xl font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                  Gratuito
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#162E2D]">$0</span>
                  <span className="text-xs text-[#778F8C]">MXN</span>
                </div>
                <p className="text-xs text-[#778F8C]">Ideal para reuniones pequeñas o probar la plataforma.</p>
                <ul className="space-y-2.5 text-xs text-[#162E2D]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8281]" /> Hasta 30 invitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8281]" /> Plantillas básicas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8281]" /> Formulario RSVP
                  </li>
                </ul>
              </div>
              <Link
                href="/events/new"
                className="w-full py-2.5 rounded-full border border-[#4E8281] text-[#4E8281] font-bold text-xs tracking-wider uppercase text-center hover:bg-[#4E8281] hover:text-white transition-all"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* Plan PRO (Destacado) */}
            <div className="p-7 rounded-3xl bg-[#0F2424] text-white border-2 border-[#D3B48C] shadow-2xl space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#D3B48C] text-[#0F2424] text-[10px] font-extrabold uppercase tracking-wider shadow">
                Más Elegido
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D3B48C]">Completo</span>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                  Plan Evento PRO
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$499</span>
                  <span className="text-xs text-slate-300">MXN / evento único</span>
                </div>
                <p className="text-xs text-slate-300">La experiencia completa OSHUN para bodas y galas.</p>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#D3B48C]" /> <strong>Invitados Ilimitados</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#D3B48C]" /> <strong>Pases QR y Escáner de Puerta</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#D3B48C]" /> Integración WhatsApp 1-Clic
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#D3B48C]" /> Música de Fondo & Galería
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#D3B48C]" /> Exportación CSV de Banquete
                  </li>
                </ul>
              </div>
              <Link
                href="/events/new"
                className="w-full py-3 rounded-full bg-[#4E8281] hover:bg-[#3E6D6C] text-white font-bold text-xs tracking-wider uppercase text-center shadow-lg transition-all"
              >
                Crear con Plan PRO
              </Link>
            </div>

            {/* Plan Empresa */}
            <div className="p-7 rounded-3xl bg-white border border-[#D3B48C]/40 shadow-md space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#778F8C]">Wedding Planners</span>
                <h3 className="text-xl font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                  Agencias & Planners
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#162E2D]">$1,499</span>
                  <span className="text-xs text-[#778F8C]">MXN / mes</span>
                </div>
                <p className="text-xs text-[#778F8C]">Eventos ilimitados y marca blanca para coordinadores.</p>
                <ul className="space-y-2.5 text-xs text-[#162E2D]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8281]" /> Eventos simultáneos ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8281]" /> Multi-usuario y permisos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#4E8281]" /> Soporte VIP Concierge
                  </li>
                </ul>
              </div>
              <Link
                href="/settings"
                className="w-full py-2.5 rounded-full border border-[#4E8281] text-[#4E8281] font-bold text-xs tracking-wider uppercase text-center hover:bg-[#4E8281] hover:text-white transition-all"
              >
                Contactar Ventas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 text-center relative overflow-hidden bg-oshun-waves">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <OshunLogo variant="isotipo" size="lg" />
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#4E8281]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Cada celebración comienza con una conexión.
          </h2>
          <p className="text-xs sm:text-sm text-[#778F8C]">
            Comienza a diseñar tu invitación digital hoy mismo y sorprende a tus invitados desde el primer instante.
          </p>
          <Link
            href="/events/new"
            className="btn-oshun-primary text-xs px-8 py-3.5 inline-flex items-center gap-2 uppercase tracking-wider font-bold"
          >
            <span>Crear Mi Invitación Ahora</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
