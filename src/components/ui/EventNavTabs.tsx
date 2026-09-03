'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  Palette,
  Users,
  LayoutGrid,
  MessageSquare,
  QrCode,
  BarChart3,
  Lock
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';

interface EventNavTabsProps {
  eventId?: string;
}

export default function EventNavTabs({ eventId }: EventNavTabsProps) {
  const pathname = usePathname();
  const params = useParams();
  const activeEventId = eventId || (params?.id as string) || 'event-01';

  const user = InvitaStore.getUser();
  const planFeatures = InvitaStore.getUserPlanFeatures(user);

  const TABS = [
    {
      href: `/events/${activeEventId}/editor`,
      label: 'Editor',
      icon: Palette,
      locked: !planFeatures.canEditDesign && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${activeEventId}/guests`,
      label: 'Invitados',
      icon: Users,
      locked: !planFeatures.canManageGuests && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${activeEventId}/seating`,
      label: 'Acomodo de Mesas',
      icon: LayoutGrid,
      locked: !planFeatures.canSeatingPlan && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${activeEventId}/whatsapp`,
      label: 'WhatsApp',
      icon: MessageSquare,
      locked: !planFeatures.canWhatsAppHub && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${activeEventId}/checkin`,
      label: 'Recepción & QR',
      icon: QrCode,
      locked: !planFeatures.canCheckInQr && user?.role !== 'SUPER_ADMIN',
    },
    {
      href: `/events/${activeEventId}/analytics`,
      label: 'Métricas',
      icon: BarChart3,
      locked: !planFeatures.canAnalytics && user?.role !== 'SUPER_ADMIN',
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#D3B48C]/40 p-1.5 shadow-sm mb-4 overflow-x-auto">
      <div className="flex items-center gap-1.5 min-w-max">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#4E8281] text-white shadow-md shadow-[#4E8281]/20'
                  : tab.locked
                  ? 'text-[#778F8C]/60 hover:bg-[#FAF6F0]'
                  : 'text-[#778F8C] hover:bg-[#FAF6F0] hover:text-[#162E2D]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : tab.locked ? 'text-[#778F8C]/50' : 'text-[#4E8281]'}`} />
              <span className={tab.locked ? 'line-through decoration-[#D3B48C]' : ''}>
                {tab.label}
              </span>
              {tab.locked && (
                <Lock className="h-3 w-3 text-[#D3B48C]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
