'use client';

import React from 'react';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Crown,
  Laptop
} from 'lucide-react';

export default function DemoPlaygroundBanner() {
  return (
    <div className="sticky top-0 z-50 bg-[#0F2424] text-white border-b-2 border-[#D3B48C] px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left Side: Brand & Demo Tag */}
        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-[11px] font-bold text-[#D3B48C] hover:text-white flex items-center gap-1 transition-colors shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Volver a Presentación</span>
          </Link>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#4E8281] text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <Laptop className="h-3 w-3" />
              <span>Modo Demostración</span>
            </span>
            <span className="text-xs font-semibold text-[#FAF6F0] hidden md:inline">
              Explora las herramientas de gestión en tiempo real (Sandbox interactivo sin credenciales)
            </span>
          </div>
        </div>

        {/* Right Side: Conversion CTA */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/i/boda-maria-andres-2026"
            target="_blank"
            className="text-xs font-bold text-[#D3B48C] hover:underline px-2.5 py-1"
          >
            <span>Ver Web Demo</span>
          </Link>

          <Link
            href="/events/new"
            className="px-4 py-1.5 rounded-full bg-[#D3B48C] hover:bg-[#c4a275] text-[#0F2424] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>Crear mi propio evento</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
