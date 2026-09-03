'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InvitaStore } from '@/lib/store';

export default function WhatsAppRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const events = InvitaStore.getEvents();
    const activeEvent = events[0];
    if (activeEvent) {
      router.replace(`/events/${activeEvent.id}/whatsapp`);
    } else {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-[#778F8C]">
      Cargando Hub de WhatsApp OSHUN...
    </div>
  );
}
