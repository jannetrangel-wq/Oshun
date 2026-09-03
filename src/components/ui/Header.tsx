'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Plus,
  ExternalLink,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Menu,
  LogOut,
  Crown
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { Event } from '@/types';

interface HeaderProps {
  onToggleSidebar?: () => void;
  activeEvent?: Event;
}

export default function Header({ onToggleSidebar, activeEvent }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentEvent = activeEvent || InvitaStore.getEvents()[0];
  const user = InvitaStore.getUser();
  const planFeatures = InvitaStore.getUserPlanFeatures(user);

  const getBreadcrumb = () => {
    if (pathname === '/dashboard') return 'Dashboard General';
    if (pathname === '/events') return 'Mis Eventos';
    if (pathname === '/events/new') return 'Crear Nuevo Evento';
    if (pathname.includes('/editor')) return 'Editor de Invitación';
    if (pathname.includes('/guests')) return 'Lista de Invitados & CRM';
    if (pathname.includes('/seating')) return 'Acomodo de Mesas & Plano';
    if (pathname.includes('/whatsapp')) return 'Mensajes de WhatsApp';
    if (pathname.includes('/checkin')) return 'Recepción & Escáner QR';
    if (pathname.includes('/analytics')) return 'Analítica & Banquete';
    if (pathname === '/templates') return 'Catálogo de Diseños';
    if (pathname === '/settings') return 'Ajustes & Cuenta';
    if (pathname === '/admin') return 'Super Admin Global';
    return 'Panel de Control';
  };

  const handleLogout = () => {
    InvitaStore.logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#D3B48C]/30 px-4 sm:px-6 flex items-center justify-between">
      {/* Breadcrumbs & Active Title */}
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-xl text-[#4E8281] hover:bg-[#EFE3D4] mr-1"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <span
          className="text-xs text-[#778F8C] uppercase tracking-wider font-semibold"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          OSHUN
        </span>

        <ChevronRight className="h-3 w-3 text-[#D3B48C]" />
        <h1
          className="text-xs sm:text-sm font-bold text-[#162E2D]"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          {getBreadcrumb()}
        </h1>
      </div>

      {/* Header Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Plan Badge */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D3B48C]/40 text-[10px] font-bold text-[#162E2D] shadow-xs">
          <Crown className="h-3 w-3 text-[#D3B48C]" />
          <span>{user?.role === 'SUPER_ADMIN' ? '🛡️ Super Admin' : `${planFeatures.badgeIcon} ${planFeatures.name}`}</span>
        </span>

        {currentEvent && (
          <Link
            href={`/i/${currentEvent.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#4E8281] bg-white border border-[#4E8281]/30 hover:bg-[#EADBC6]/30 transition-all shadow-sm"
          >
            <span>Ver Web</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}

        <Link
          href="/events/new"
          className="btn-oshun-primary text-xs px-3.5 sm:px-4 py-1.5 sm:py-2 inline-flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nuevo Evento</span>
        </Link>

        {/* Logout Quick Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
