'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import OshunLogo from './OshunLogo';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Palette,
  MessageSquare,
  QrCode,
  BarChart3,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  LayoutGrid,
  X,
  Lock,
  LogOut,
  Crown
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { PLAN_CONFIG } from '@/types';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentEvent = InvitaStore.getEvents()[0];
  const user = InvitaStore.getUser();
  const planFeatures = InvitaStore.getUserPlanFeatures(user);

  const isCurrentEventRoute = pathname.includes('/events/') && pathname !== '/events/new';
  const pathnameEventId = isCurrentEventRoute ? pathname.split('/')[2] : null;
  const eventId = pathnameEventId || user?.eventId || currentEvent?.id || 'event-01';

  const MAIN_LINKS = [
    { href: '/dashboard', label: 'Dashboard General', icon: LayoutDashboard },
    { href: '/events', label: 'Mis Eventos', icon: Calendar },
    { href: '/templates', label: 'Catálogo de Diseños', icon: Sparkles },
    { href: '/settings', label: 'Ajustes & Planes', icon: Settings },
  ];

  const EVENT_LINKS = [
    {
      href: `/events/${eventId}/editor`,
      label: 'Editor de Invitación',
      icon: Palette,
      locked: !planFeatures.canEditDesign && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${eventId}/guests`,
      label: 'Lista de Invitados',
      icon: Users,
      badge: `${planFeatures.maxGuests > 500 ? '∞' : planFeatures.maxGuests}`,
      locked: !planFeatures.canManageGuests && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${eventId}/seating`,
      label: 'Acomodo de Mesas',
      icon: LayoutGrid,
      locked: !planFeatures.canSeatingPlan && user?.role !== 'SUPER_ADMIN',
      lockLabel: 'Plan Elegance / Imperial',
    },
    {
      href: `/events/${eventId}/whatsapp`,
      label: 'Mensajes WhatsApp',
      icon: MessageSquare,
      locked: !planFeatures.canWhatsAppHub && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${eventId}/checkin`,
      label: 'Recepción & QR',
      icon: QrCode,
      locked: !planFeatures.canCheckInQr && user?.role !== 'SUPER_ADMIN',
      lockLabel: 'Plan Elegance / Imperial',
    },
    {
      href: `/events/${eventId}/analytics`,
      label: 'Métricas & Banquete',
      icon: BarChart3,
      locked: !planFeatures.canAnalytics && user?.role !== 'SUPER_ADMIN',
      lockLabel: 'Plan Elegance / Imperial',
    },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const handleLogout = () => {
    InvitaStore.logout();
    if (onClose) onClose();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-64 border-r border-[#D3B48C]/30 bg-[#FAF6F0] flex flex-col justify-between h-screen select-none shadow-xl lg:shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-[#D3B48C]/30 flex items-center justify-between">
            <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2 group">
              <OshunLogo variant="horizontal" size="sm" />
            </Link>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-xl text-[#778F8C] hover:text-[#162E2D] hover:bg-[#EFE3D4]"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Active Plan / Role Banner */}
          <div className="p-3 mx-3 my-2 rounded-2xl bg-white/90 border border-[#D3B48C]/50 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C] font-cinzel">
                Plan Activo
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4E8281] text-white">
                {user?.role === 'SUPER_ADMIN' ? '🛡️ Super Admin' : `${planFeatures.badgeIcon} ${planFeatures.name}`}
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#162E2D] truncate">
              {user?.name || 'Cliente OSHUN'}
            </p>
          </div>

          {/* Navigation Sections */}
          <div className="px-3 py-2 space-y-5">
            {/* Main Links */}
            <div className="space-y-1">
              <span
                className="px-3 text-[10px] font-bold tracking-wider uppercase text-[#778F8C]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Navegación
              </span>
              {MAIN_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#4E8281] text-white shadow-md shadow-[#4E8281]/25'
                        : 'text-[#778F8C] hover:bg-[#EADBC6]/40 hover:text-[#162E2D]'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#4E8281]'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Event Tools Links */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3">
                <span
                  className="text-[10px] font-bold tracking-wider uppercase text-[#778F8C]"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Gestión del Evento
                </span>
              </div>
              {EVENT_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#4E8281] text-white shadow-md shadow-[#4E8281]/25'
                        : link.locked
                        ? 'text-[#778F8C]/60 hover:bg-[#EADBC6]/20'
                        : 'text-[#778F8C] hover:bg-[#EADBC6]/40 hover:text-[#162E2D]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : link.locked ? 'text-[#778F8C]/50' : 'text-[#4E8281]'}`} />
                      <span className={link.locked ? 'line-through decoration-[#D3B48C]' : ''}>
                        {link.label}
                      </span>
                    </div>

                    {link.locked ? (
                      <span className="p-1 rounded-md bg-[#D3B48C]/20 text-[#162E2D]" title="Bloqueado en tu plan actual">
                        <Lock className="h-3.5 w-3.5 text-[#D3B48C]" />
                      </span>
                    ) : link.badge ? (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#C0D3CC]/40 text-[#4E8281]'
                        }`}
                      >
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>

            {/* Super Admin Section */}
            {(user?.role === 'SUPER_ADMIN' || !user) && (
              <div className="pt-2 border-t border-[#D3B48C]/30 space-y-1">
                <Link
                  href="/admin"
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    pathname === '/admin'
                      ? 'bg-[#0F2424] text-white'
                      : 'text-[#778F8C] hover:bg-[#EADBC6]/40 hover:text-[#162E2D]'
                  }`}
                >
                  <ShieldAlert className="h-4 w-4 text-[#D3B48C]" />
                  <span>Panel Super Admin</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* User Footer Profile & Logout Button */}
        <div className="p-3 border-t border-[#D3B48C]/30 bg-[#F4EDE2] space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/70 border border-[#D3B48C]/30">
            <div className="h-8 w-8 rounded-full bg-[#4E8281] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0) : 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#162E2D] truncate">{user?.name || 'Invitado OSHUN'}</p>
              <p className="text-[10px] text-[#778F8C] truncate font-medium">
                {user?.role === 'SUPER_ADMIN' ? 'Súper Usuario Global' : user?.username || 'Sin sesión'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

