'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Palette,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Gift,
  Shirt,
  Share2,
  ExternalLink,
  QrCode,
  MessageSquare,
  KeyRound,
  Copy,
  Check,
  Lock,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { TEMPLATES_DATA } from '@/lib/templates-data';
import { InvitaStore } from '@/lib/store';
import { EventCategory, Guest, EventDesign, PlanTier, PLAN_CONFIG, User } from '@/types';
import { parseGuestsCsv } from '@/lib/export';

function NewEventWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template') || 'oshun-brisa-marina';

  const [currentStep, setCurrentStep] = useState(1);

  // Plan Contratado
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('ELEGANCE');

  // Paso 1: Información básica
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('boda');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('17:00');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Los Cabos, Baja California Sur');
  const [description, setDescription] = useState('');

  // Paso 2: Detalles adicionales
  const [dressCodeType, setDressCodeType] = useState('Formal Guayabera / Cóctel Elegante');
  const [dressCodeDesc, setDressCodeDesc] = useState('Hombres: Guayabera o traje formal ligero. Mujeres: Vestido largo o midi en tonos suaves.');
  const [giftStoreName, setGiftStoreName] = useState('Liverpool Bodas');
  const [giftStoreUrl, setGiftStoreUrl] = useState('');
  const [bankClabe, setBankClabe] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [hashtag, setHashtag] = useState('');

  // Paso 3: Plantilla seleccionada
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateParam);

  // Paso 4: Invitados iniciales
  const [initialGuests, setInitialGuests] = useState<Array<{ name: string; phone: string; group: string; allowed: number }>>([
    { name: 'Lic. Roberto Garza Sada', phone: '+525511223344', group: 'VIP', allowed: 2 },
    { name: 'Dra. Carmen Villaseñor', phone: '+525599887766', group: 'Familia', allowed: 4 },
  ]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('Familia');
  const [newGuestAllowed, setNewGuestAllowed] = useState(2);

  // Paso 5: Evento creado y Credenciales automáticas
  const [createdEventSlug, setCreatedEventSlug] = useState('');
  const [createdEventId, setCreatedEventId] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
    plan: PlanTier;
    user: User;
  } | null>(null);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const EVENT_CATEGORIES: { id: EventCategory; label: string }[] = [
    { id: 'boda', label: '💍 Boda' },
    { id: 'xv', label: '👑 XV Años' },
    { id: 'cumpleanos', label: '🎂 Cumpleaños' },
    { id: 'bautizo', label: '🕊️ Bautizo' },
    { id: 'baby_shower', label: '🍼 Baby Shower' },
    { id: 'despedida', label: '🥂 Despedida de Soltera' },
    { id: 'graduacion', label: '🎓 Graduación' },
    { id: 'aniversario', label: '✨ Aniversario' },
    { id: 'primera_comunion', label: '⛪ Primera Comunión' },
    { id: 'empresarial', label: '💼 Evento Empresarial' },
    { id: 'fiesta_infantil', label: '🎈 Fiesta Infantil' },
    { id: 'reunion_familiar', label: '🏡 Reunión Familiar' },
    { id: 'privado', label: '🔒 Evento Privado' },
    { id: 'otro', label: '🎉 Otro' },
  ];

  const handleAddGuest = () => {
    if (!newGuestName.trim()) return;
    setInitialGuests([
      ...initialGuests,
      {
        name: newGuestName.trim(),
        phone: newGuestPhone.trim() || '+525500000000',
        group: newGuestGroup,
        allowed: newGuestAllowed,
      },
    ]);
    setNewGuestName('');
    setNewGuestPhone('');
  };

  const handleRemoveGuest = (index: number) => {
    setInitialGuests(initialGuests.filter((_, i) => i !== index));
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseGuestsCsv(text);
        const formatted = parsed.map((p) => ({
          name: p.name || 'Invitado',
          phone: p.phone || '',
          group: p.group || 'General',
          allowed: p.allowedCompanions || 1,
        }));
        setInitialGuests([...initialGuests, ...formatted]);
      }
    };
    reader.readAsText(file);
  };

  const handlePublish = () => {
    const selectedTemplate = TEMPLATES_DATA.find((t) => t.id === selectedTemplateId) || TEMPLATES_DATA[0];

    const slug = (title || 'mi-evento')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Math.floor(100 + Math.random() * 900)}`;

    const newEventDesign: EventDesign = {
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      primaryColor: selectedTemplate.defaultDesign.primaryColor || '#4E8281',
      secondaryColor: selectedTemplate.defaultDesign.secondaryColor || '#F4EDE2',
      backgroundColor: selectedTemplate.defaultDesign.backgroundColor || '#F4EDE2',
      textColor: selectedTemplate.defaultDesign.textColor || '#162E2D',
      accentColor: selectedTemplate.defaultDesign.accentColor || '#D3B48C',
      cardBackground: selectedTemplate.defaultDesign.cardBackground || 'rgba(255, 255, 255, 0.88)',
      fontFamilyTitle: selectedTemplate.defaultDesign.fontFamilyTitle || 'Cinzel',
      fontFamilyBody: selectedTemplate.defaultDesign.fontFamilyBody || 'Montserrat',
      coverImageUrl: selectedTemplate.defaultDesign.coverImageUrl || selectedTemplate.previewImage,
      musicAutoplay: false,
      badgeStyle: selectedTemplate.defaultDesign.badgeStyle || 'gold',
      sections: {
        hero: {
          enabled: true,
          title: title || 'Nuestra Celebración',
          subtitle: 'TE INVITAMOS A CELEBRAR JUNTOS',
          dateText: `${date}`,
          timeText: `${time} hrs`,
        },
        countdown: {
          enabled: true,
          targetDate: `${date}T${time}:00`,
        },
        story: {
          enabled: true,
          title: 'Bienvenidos a Nuestro Evento',
          content: description || 'Cada celebración comienza con una conexión. Nos llena de alegría compartir esta fecha tan especial contigo.',
        },
        schedule: {
          enabled: true,
          title: 'Itinerario',
          items: [
            { time: `${time} hrs`, title: 'Recepción & Bienvenida', description: venueName || 'Lugar del evento' },
            { time: '19:00 hrs', title: 'Cena & Brindis', description: 'Salón Principal' },
            { time: '21:00 hrs', title: 'Fiesta & Música', description: 'Pista de Baile' },
          ],
        },
        location: {
          enabled: true,
          title: 'Lugar del Evento',
          venueName: venueName || 'Hacienda Principal',
          address: address || 'Dirección del evento',
          city: city || 'Los Cabos, B.C.S.',
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(venueName + ' ' + address)}`,
          wazeUrl: `https://waze.com/ul?q=${encodeURIComponent(venueName + ' ' + address)}`,
        },
        gallery: {
          enabled: true,
          title: 'Galería',
          images: [selectedTemplate.previewImage],
        },
        dressCode: {
          enabled: true,
          title: 'Código de Vestimenta',
          type: dressCodeType,
          description: dressCodeDesc,
          colors: ['#4E8281', '#97B8B3', '#D3B48C', '#EFE3D4'],
        },
        giftRegistry: {
          enabled: true,
          title: 'Mesa de Regalos',
          description: 'Agradecemos de corazón tu muestra de cariño y presencia.',
          items: [
            ...(giftStoreUrl ? [{ title: giftStoreName, type: 'store' as const, url: giftStoreUrl }] : []),
            ...(bankClabe ? [{ title: 'Transferencia Bancaria', type: 'bank' as const, clabe: bankClabe, accountHolder: bankHolder }] : []),
          ],
        },
        rsvp: {
          enabled: true,
          title: 'Confirmación de Asistencia (RSVP)',
          deadline: date,
          maxCompanionsPerGuest: 2,
          allowDietaryRestrictions: true,
          customMessage: 'Por favor confirma tu asistencia a la brevedad para garantizar tu lugar.',
        },
        qrPass: {
          enabled: true,
          title: 'Pase Digital de Entrada',
          instructions: 'Muestra este código QR en la entrada al llegar al evento.',
        },
      },
    };

    const created = InvitaStore.createEvent({
      tenantId: 'tenant-01',
      userId: 'user-01',
      title: title || 'Nuevo Evento',
      slug,
      category,
      date,
      time,
      venueName: venueName || 'Hacienda San José del Cabo',
      address: address || 'Carretera Transpeninsular Km 18.5',
      city: city || 'Los Cabos, B.C.S.',
      description,
      status: 'PUBLISHED',
      design: newEventDesign,
    });

    // Guardar invitados iniciales
    if (initialGuests.length > 0) {
      const formattedGuests: Guest[] = initialGuests.map((g, idx) => ({
        id: `guest-${Date.now()}-${idx}`,
        eventId: created.id,
        code: `OSH${String(idx + 1).padStart(3, '0')}`,
        name: g.name,
        phone: g.phone,
        email: `${g.name.toLowerCase().replace(/[^a-z]/g, '')}@ejemplo.com`,
        group: g.group,
        status: 'PENDING',
        allowedCompanions: g.allowed,
        confirmedCompanions: 0,
        companionNames: [],
        dietaryRestrictions: 'Ninguna',
        tableNumber: `Mesa ${Math.floor(idx / 8) + 1}`,
        checkedIn: false,
      }));
      InvitaStore.saveGuestsForEvent(created.id, formattedGuests);
    }

    // Generar automáticamente las credenciales únicas para este cliente
    const { user: clientUser, rawPassword } = InvitaStore.registerClientForEvent(
      created.id,
      title || 'Mi Evento',
      selectedPlan
    );

    setGeneratedCredentials({
      username: clientUser.username,
      password: rawPassword,
      plan: selectedPlan,
      user: clientUser,
    });

    setCreatedEventSlug(slug);
    setCreatedEventId(created.id);
    setCurrentStep(5);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Wizard Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#778F8C] hover:text-[#4E8281]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver a Mis Eventos</span>
          </Link>
          <span className="text-xs font-bold text-[#4E8281]">
            Paso {currentStep} de 5 • OSHUN
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { step: 1, label: 'Información' },
            { step: 2, label: 'Detalles' },
            { step: 3, label: 'Plantilla' },
            { step: 4, label: 'Invitados' },
            { step: 5, label: 'Publicar' },
          ].map((s) => (
            <div key={s.step} className="space-y-1.5">
              <div
                className={`h-1.5 w-full rounded-full transition-all ${
                  currentStep >= s.step
                    ? 'bg-[#4E8281]'
                    : 'bg-[#EADBC6]'
                }`}
              />
              <p
                className={`text-[11px] font-semibold text-center hidden sm:block ${
                  currentStep >= s.step ? 'text-[#4E8281]' : 'text-[#778F8C]'
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: INFORMACIÓN PRINCIPAL */}
      {currentStep === 1 && (
        <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
              Paso 1 • Datos Principales
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Información del Evento
            </h2>
            <p className="text-xs text-[#778F8C] mt-1">
              Ingresa los datos esenciales que aparecerán en la portada de tu invitación digital OSHUN.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#162E2D] mb-1.5">
                Nombre o Título del Evento *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Boda de Sofía & Mateo / Mis XV Años Regina"
                className="w-full rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-4 py-3 text-sm text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>

            {/* Plan Contratado Selector */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#162E2D] flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-[#D3B48C]" />
                  <span>Plan Adquirido / Asignado *</span>
                </label>
                <span className="text-[10px] font-bold text-[#4E8281] bg-[#4E8281]/10 px-2.5 py-0.5 rounded-full">
                  Modula las herramientas del cliente
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['ESENCIAL', 'ELEGANCE', 'IMPERIAL'] as PlanTier[]).map((tier) => {
                  const cfg = PLAN_CONFIG[tier];
                  const isSelected = selectedPlan === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedPlan(tier)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-white border-[#4E8281] shadow-md ring-2 ring-[#4E8281]/20'
                          : 'bg-white/60 border-[#D3B48C]/30 hover:bg-white text-[#162E2D]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#162E2D]">
                          {cfg.badgeIcon} {cfg.name}
                        </span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-[#4E8281]" />}
                      </div>
                      <p className="text-[10px] text-[#778F8C] line-clamp-2">
                        {cfg.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#162E2D] mb-2">
                Categoría del Evento *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EVENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                      category === cat.id
                        ? 'bg-[#4E8281] border-[#4E8281] text-white shadow-sm font-bold'
                        : 'bg-[#FAF6F0] border-[#D3B48C]/30 text-[#162E2D] hover:bg-[#EFE3D4]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#162E2D] mb-1.5">
                  Fecha del Evento *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-4 py-2.5 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#162E2D] mb-1.5">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-4 py-2.5 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#162E2D] mb-1.5">
                  Lugar o Hacienda *
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="Ej. Hacienda San José del Cabo"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-4 py-2.5 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#162E2D] mb-1.5">
                  Ciudad / Estado
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Los Cabos, B.C.S. / Monterrey, N.L."
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-4 py-2.5 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#162E2D] mb-1.5">
                Dirección Completa (Para Maps & Waze)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, Número, Colonia para generar enlaces directos de navegación"
                className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-4 py-2.5 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!title.trim()}
              className="btn-oshun-primary text-xs px-6 py-3 inline-flex items-center gap-2 disabled:opacity-50"
            >
              <span>Continuar a Detalles</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DETALLES ADICIONALES */}
      {currentStep === 2 && (
        <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
              Paso 2 • Guía & Regalos
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Dress Code & Mesa de Regalos
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#4E8281]">
                <Shirt className="h-5 w-5" />
                <h3 className="text-sm font-bold text-[#162E2D]">Código de Vestimenta</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={dressCodeType}
                  onChange={(e) => setDressCodeType(e.target.value)}
                  placeholder="Tipo de etiqueta"
                  className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
                />
                <input
                  type="text"
                  value={dressCodeDesc}
                  onChange={(e) => setDressCodeDesc(e.target.value)}
                  placeholder="Instrucciones para invitados"
                  className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#4E8281]">
                <Gift className="h-5 w-5" />
                <h3 className="text-sm font-bold text-[#162E2D]">Mesa de Regalos & Cuenta Bancaria</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={giftStoreName}
                  onChange={(e) => setGiftStoreName(e.target.value)}
                  placeholder="Tienda (Liverpool / Amazon)"
                  className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
                />
                <input
                  type="url"
                  value={giftStoreUrl}
                  onChange={(e) => setGiftStoreUrl(e.target.value)}
                  placeholder="Enlace a la mesa de regalos"
                  className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
                />
                <input
                  type="text"
                  value={bankClabe}
                  onChange={(e) => setBankClabe(e.target.value)}
                  placeholder="Cuenta CLABE (18 dígitos)"
                  className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
                />
                <input
                  type="text"
                  value={bankHolder}
                  onChange={(e) => setBankHolder(e.target.value)}
                  placeholder="Titular de la cuenta"
                  className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-full bg-[#EFE3D4] text-xs font-semibold text-[#162E2D]"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="btn-oshun-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
            >
              <span>Elegir Plantilla</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECCIÓN DE PLANTILLA */}
      {currentStep === 3 && (
        <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
              Paso 3 • Estilo Visual
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Selecciona tu Plantilla OSHUN
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES_DATA.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all flex flex-col ${
                  selectedTemplateId === tmpl.id
                    ? 'border-[#4E8281] bg-[#4E8281]/10 ring-2 ring-[#4E8281] shadow-lg'
                    : 'border-[#D3B48C]/30 bg-[#FAF6F0] hover:border-[#4E8281]'
                }`}
              >
                <div className="relative h-36 w-full overflow-hidden bg-[#EFE3D4]">
                  <img src={tmpl.previewImage} alt={tmpl.name} className="h-full w-full object-cover" />
                  {selectedTemplateId === tmpl.id && (
                    <div className="absolute inset-0 bg-[#4E8281]/25 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="h-8 w-8 rounded-full bg-[#4E8281] text-white flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3.5 space-y-1">
                  <h4 className="text-xs font-bold text-[#162E2D]">{tmpl.name}</h4>
                  <p className="text-[11px] text-[#778F8C] line-clamp-2">{tmpl.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-full bg-[#EFE3D4] text-xs font-semibold text-[#162E2D]"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="btn-oshun-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
            >
              <span>Configurar Invitados</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: INVITADOS INICIALES */}
      {currentStep === 4 && (
        <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
              Paso 4 • Lista de Invitados
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Primeros Invitados & CSV
            </h2>
          </div>

          {/* Quick Add Form */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="Nombre completo"
                className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
              />
              <input
                type="text"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
                placeholder="WhatsApp (+52...)"
                className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
              />
              <input
                type="text"
                value={newGuestGroup}
                onChange={(e) => setNewGuestGroup(e.target.value)}
                placeholder="Grupo (Familia/VIP)"
                className="rounded-xl bg-white border border-[#D3B48C]/40 px-3 py-2 text-xs text-[#162E2D]"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newGuestAllowed}
                  onChange={(e) => setNewGuestAllowed(parseInt(e.target.value, 10) || 1)}
                  className="w-16 rounded-xl bg-white border border-[#D3B48C]/40 px-2 py-2 text-xs text-[#162E2D] text-center font-bold"
                  title="Pases asignados"
                />
                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="flex-1 rounded-xl bg-[#4E8281] text-white font-bold text-xs hover:bg-[#3E6D6C] transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>

            {/* CSV Import Button */}
            <div className="pt-2 border-t border-[#D3B48C]/20 flex items-center justify-between text-xs text-[#778F8C]">
              <span>¿Tienes una lista en Excel?</span>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#162E2D] border border-[#D3B48C]/40 font-semibold shadow-sm">
                <Upload className="h-3.5 w-3.5 text-[#4E8281]" />
                <span>Importar CSV</span>
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Added Guests List */}
          <div className="divide-y divide-[#D3B48C]/20 border border-[#D3B48C]/30 rounded-2xl bg-white max-h-56 overflow-y-auto">
            {initialGuests.map((g, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#162E2D]">{g.name}</span>
                  <span className="ml-2 text-[#778F8C]">{g.phone}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-[#EADBC6]/40 text-[#4E8281] font-semibold text-[10px]">
                    {g.group}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#162E2D]">{g.allowed} pases</span>
                  <button type="button" onClick={() => handleRemoveGuest(idx)} className="text-rose-600 hover:text-rose-800">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-[#D3B48C]/30">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-full bg-[#EFE3D4] text-xs font-semibold text-[#162E2D]"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="btn-oshun-primary text-xs px-7 py-3 inline-flex items-center gap-2 uppercase tracking-wider font-bold shadow-lg"
            >
              <Sparkles className="h-4 w-4 text-[#D3B48C]" />
              <span>Publicar Evento OSHUN</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PUBLICACIÓN EXITOSA & CREDENCIALES AUTOMÁTICAS */}
      {currentStep === 5 && (
        <div className="rounded-3xl bg-white border-2 border-[#D3B48C]/60 p-8 sm:p-10 space-y-6 text-center shadow-2xl animate-in zoom-in-95">
          <OshunLogo variant="isotipo" size="xl" />

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4E8281]">
              ¡Tu Celebración Ha Sido Publicada con Éxito!
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {title || 'Tu Gran Evento'}
            </h2>
            <p className="text-xs text-[#778F8C] max-w-md mx-auto">
              Tu evento está activo. A continuación se muestran las credenciales generadas para que el cliente ingrese a su panel personal.
            </p>
          </div>

          {/* TARJETA DORADA DE CREDENCIALES GENERADAS */}
          {generatedCredentials && (
            <div className="max-w-xl mx-auto rounded-3xl bg-[#FAF6F0] border-2 border-[#D3B48C] p-6 shadow-md text-left space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#4E8281] text-white text-[10px] font-bold rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-[#D3B48C]" />
                <span>{PLAN_CONFIG[generatedCredentials.plan].name}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#0F2424] text-[#D3B48C]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#D3B48C] uppercase tracking-wider block font-cinzel">
                    Credenciales Únicas de Acceso
                  </span>
                  <h3 className="text-sm font-bold text-[#162E2D]" style={{ fontFamily: 'Cinzel, serif' }}>
                    Acceso al Panel de Control del Cliente
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Usuario Box */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#D3B48C]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#778F8C] font-semibold uppercase block">Usuario</span>
                    <span className="text-xs font-mono font-bold text-[#162E2D] block truncate max-w-[150px]">
                      {generatedCredentials.username}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCredentials.username);
                      setCopiedUser(true);
                      setTimeout(() => setCopiedUser(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EFE3D4] text-[#4E8281] transition-colors"
                    title="Copiar usuario"
                  >
                    {copiedUser ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Contraseña Box */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#D3B48C]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#778F8C] font-semibold uppercase block">Contraseña</span>
                    <span className="text-xs font-mono font-bold text-[#4E8281] block truncate">
                      {generatedCredentials.password}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCredentials.password);
                      setCopiedPass(true);
                      setTimeout(() => setCopiedPass(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EFE3D4] text-[#4E8281] transition-colors"
                    title="Copiar contraseña"
                  >
                    {copiedPass ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Copy all and Direct Login Action */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-[#D3B48C]/30">
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `🌟 CREDENCIALES DE ACCESO OSHUN 🌟\nEvento: ${title}\nEnlace: ${typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com'}/login\nUsuario: ${generatedCredentials.username}\nContraseña: ${generatedCredentials.password}\nPlan Activo: ${PLAN_CONFIG[generatedCredentials.plan].name}`;
                    navigator.clipboard.writeText(fullText);
                    setCopiedAll(true);
                    setTimeout(() => setCopiedAll(false), 2500);
                  }}
                  className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#D3B48C]/50 text-xs font-bold text-[#162E2D] flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Credenciales Copiadas!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#4E8281]" />
                      <span>Copiar Ficha de Acceso</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    InvitaStore.setUser(generatedCredentials.user);
                    router.push(`/events/${createdEventId}/guests`);
                  }}
                  className="w-full sm:w-auto btn-oshun-primary py-2.5 px-5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Entrar a Mi Panel Ahora</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#D3B48C]" />
                </button>
              </div>
            </div>
          )}

          {/* URL Box */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 flex items-center justify-between gap-3">
            <div className="text-left truncate">
              <span className="text-[10px] text-[#778F8C] font-semibold uppercase">Enlace Web Público</span>
              <p className="text-xs font-mono text-[#4E8281] font-bold truncate">
                {typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com'}/i/{createdEventSlug}
              </p>
            </div>
            <Link
              href={`/i/${createdEventSlug}`}
              target="_blank"
              className="px-4 py-2 rounded-full bg-[#4E8281] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#3E6D6C] transition-colors"
            >
              Abrir
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <Link
              href={`/events/${createdEventId}/editor`}
              className="p-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#EFE3D4] border border-[#D3B48C]/30 text-xs font-bold text-[#162E2D] flex flex-col items-center gap-1.5 transition-colors"
            >
              <Palette className="h-4 w-4 text-[#4E8281]" />
              <span>Personalizar en Editor</span>
            </Link>
            <Link
              href={`/events/${createdEventId}/guests`}
              className="p-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#EFE3D4] border border-[#D3B48C]/30 text-xs font-bold text-[#162E2D] flex flex-col items-center gap-1.5 transition-colors"
            >
              <Users className="h-4 w-4 text-[#4E8281]" />
              <span>Administrar Invitados</span>
            </Link>
            <Link
              href={`/events/${createdEventId}/whatsapp`}
              className="p-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#EFE3D4] border border-[#D3B48C]/30 text-xs font-bold text-[#162E2D] flex flex-col items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-[#4E8281]" />
              <span>Enviar por WhatsApp</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-[#D3B48C]/30">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#4E8281] hover:underline"
            >
              Ir al Panel Principal →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewEventWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-[#4E8281] text-xs font-bold">
          Cargando asistente OSHUN...
        </div>
      }
    >
      <NewEventWizardContent />
    </Suspense>
  );
}
