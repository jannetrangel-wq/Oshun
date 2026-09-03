'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OshunLogo from './OshunLogo';
import { Sparkles, Menu, X, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F4EDE2]/85 border-b border-[#D3B48C]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* OSHUN Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.01]">
            <OshunLogo variant="horizontal" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-[#778F8C]">
            <Link
              href="#caracteristicas"
              className="hover:text-[#4E8281] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#4E8281] hover:after:w-full after:transition-all"
            >
              Funcionalidades
            </Link>
            <Link
              href="#plantillas"
              className="hover:text-[#4E8281] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#4E8281] hover:after:w-full after:transition-all"
            >
              Plantillas
            </Link>
            <Link
              href="#precios"
              className="hover:text-[#4E8281] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#4E8281] hover:after:w-full after:transition-all"
            >
              Planes
            </Link>
            <Link
              href="/demo"
              className="px-3.5 py-1.5 rounded-full bg-[#EADBC6]/50 text-[#4E8281] hover:bg-[#4E8281] hover:text-white font-bold transition-all border border-[#D3B48C]/50 flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="h-3 w-3 text-[#D3B48C]" />
              <span>DEMO</span>
            </Link>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#4E8281] hover:text-[#0F2424] px-4 py-2 rounded-full border border-[#4E8281]/30 hover:bg-[#FAF6F0] transition-colors"
            >
              Mi Panel
            </Link>
            <Link
              href="/events/new"
              className="btn-oshun-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
            >
              <span>Crear Invitación</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#4E8281] hover:bg-[#EADBC6]/40 transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F0] border-b border-[#D3B48C]/40 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            href="#caracteristicas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-[#778F8C] hover:text-[#4E8281] rounded-lg"
          >
            Funcionalidades
          </Link>
          <Link
            href="#plantillas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-[#778F8C] hover:text-[#4E8281] rounded-lg"
          >
            Plantillas
          </Link>
          <Link
            href="#precios"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-[#778F8C] hover:text-[#4E8281] rounded-lg"
          >
            Planes y Precios
          </Link>
          <Link
            href="/demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-[#4E8281] bg-[#EADBC6]/40 rounded-lg"
          >
            ✦ DEMO OSHUN
          </Link>
          <div className="pt-3 border-t border-[#D3B48C]/30 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 text-xs font-bold text-[#4E8281] border border-[#4E8281] rounded-full"
            >
              Mi Panel
            </Link>
            <Link
              href="/events/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 text-xs font-bold text-white bg-[#4E8281] rounded-full shadow-md"
            >
              Crear Invitación Ahora
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
