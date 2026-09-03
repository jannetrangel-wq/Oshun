'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Calendar, MapPin, Users, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export default function EventsListPage() {
  const events = InvitaStore.getEvents();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
            Catálogo de Eventos • OSHUN
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Mis Eventos Activos
          </h2>
          <p className="text-xs text-[#778F8C]">
            Administra tus celebraciones, edita diseños y supervisa confirmaciones.
          </p>
        </div>

        <Link
          href="/events/new"
          className="btn-oshun-primary text-xs px-5 py-2.5 inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Crear Nuevo Evento</span>
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="rounded-3xl bg-white border border-[#D3B48C]/40 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div className="relative h-44 w-full bg-[#EFE3D4] overflow-hidden">
              <img
                src={evt.design.coverImageUrl}
                alt={evt.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-[#FAF6F0] text-[#4E8281] border border-[#D3B48C]/40 shadow-sm">
                {evt.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#D3B48C] tracking-wider">
                  {evt.category.toUpperCase()}
                </span>
                <h3
                  className="text-lg font-bold text-[#162E2D]"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {evt.title}
                </h3>
                <p className="text-xs text-[#778F8C] flex items-center gap-1.5 pt-1">
                  <Calendar className="h-3.5 w-3.5 text-[#4E8281]" />
                  <span>{formatDate(evt.date)} • {evt.time} hrs</span>
                </p>
                <p className="text-xs text-[#778F8C] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#4E8281]" />
                  <span className="truncate">{evt.venueName}, {evt.city}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-[#D3B48C]/30 flex items-center justify-between">
                <Link
                  href={`/i/${evt.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-[#778F8C] hover:text-[#4E8281] inline-flex items-center gap-1"
                >
                  <span>Ver Web</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <Link
                  href={`/events/${evt.id}/editor`}
                  className="px-4 py-1.5 rounded-full bg-[#4E8281] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 hover:bg-[#3E6D6C] shadow"
                >
                  <span>Gestionar</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
