'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { InvitaStore } from '@/lib/store';
import { Event } from '@/types';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
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
  }, [pathname]);

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
