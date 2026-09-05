'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { InvitaStore } from '@/lib/store';
import { Event, User } from '@/types';
import OshunLogo from '@/components/ui/OshunLogo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | undefined>(undefined);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const user = InvitaStore.getUser();
    
    // Si la ruta es /admin, permitimos que admin/page.tsx maneje su propia vista de login maestro
    if (pathname === '/admin' || pathname.startsWith('/admin')) {
      setIsAuthorized(true);
      return;
    }

    if (!user) {
      setIsAuthorized(false);
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsAuthorized(true);

    const events = InvitaStore.getEvents();
    const match = pathname.match(/\/events\/([^\/]+)/);
    if (match && match[1] && match[1] !== 'new') {
      const found = events.find((e) => e.id === match[1] || e.slug === match[1]);
      if (found) {
        setActiveEvent(found);
        return;
      }
    }
    setActiveEvent(events[0]);
  }, [pathname, router]);

  if (isAuthorized === null || isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 animate-pulse">
          <OshunLogo variant="horizontal" size="lg" />
          <p className="text-xs font-bold text-[#4E8281] uppercase tracking-widest font-cinzel">
            Verificando Sesión de Acceso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#162E2D]">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} activeEvent={activeEvent} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
