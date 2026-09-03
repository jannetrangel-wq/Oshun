import React from 'react';
import Link from 'next/link';
import OshunLogo from './OshunLogo';
import { Heart, Sparkles, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#EFE3D4] border-t border-[#D3B48C]/40 text-[#162E2D] pt-16 pb-12 relative overflow-hidden">
      {/* Delicate background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-[#C0D3CC]/30 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#D3B48C]/30">
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <OshunLogo variant="full" size="md" showSlogan={false} />
            <p className="text-xs text-[#778F8C] leading-relaxed text-center">
              Cada celebración comienza con una conexión. Creamos experiencias digitales memorables para bodas, galas y momentos únicos.
            </p>
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#D3B48C] font-semibold tracking-widest uppercase">
              <span>✦</span>
              <span>Elegancia • Calidez • Sofisticación</span>
              <span>✦</span>
            </div>
          </div>

          {/* Col 2: Soluciones */}
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-[#4E8281]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Soluciones
            </h3>
            <ul className="space-y-2 text-xs text-[#778F8C]">
              <li>
                <Link href="/templates" className="hover:text-[#4E8281] transition-colors">
                  Invitaciones para Bodas
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#4E8281] transition-colors">
                  XV Años & Aniversarios
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#4E8281] transition-colors">
                  Control de Invitados CRM
                </Link>
              </li>
              <li>
                <Link href="/events/event-01/checkin" className="hover:text-[#4E8281] transition-colors">
                  Pases de Acceso QR
                </Link>
              </li>
              <li>
                <Link href="/events/event-01/whatsapp" className="hover:text-[#4E8281] transition-colors">
                  Confirmación por WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Plataforma */}
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-[#4E8281]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Plataforma
            </h3>
            <ul className="space-y-2 text-xs text-[#778F8C]">
              <li>
                <Link href="#plantillas" className="hover:text-[#4E8281] transition-colors">
                  Catálogo de Diseños
                </Link>
              </li>
              <li>
                <Link href="#precios" className="hover:text-[#4E8281] transition-colors">
                  Planes & Precios
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#4E8281] transition-colors">
                  Panel de Organizador
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#4E8281] transition-colors">
                  Acceso Super Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-[#4E8281]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Atención Exclusiva
            </h3>
            <p className="text-xs text-[#778F8C] leading-relaxed">
              ¿Requieres un diseño a medida o asesoría para tu evento? Nuestro equipo concierge está a tu servicio.
            </p>
            <div className="space-y-1.5 text-xs text-[#4E8281] font-semibold">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#D3B48C]" />
                <span>contacto@oshun.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#D3B48C]" />
                <span>Ciudad de México • Monterrey • Guadalajara</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#778F8C] gap-4">
          <p>© {new Date().getFullYear()} OSHUN. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Cada celebración comienza con una conexión</span>
            <span className="text-[#D3B48C]">✦</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
