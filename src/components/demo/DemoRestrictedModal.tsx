'use client';

import React from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import OshunLogo from '@/components/ui/OshunLogo';

interface DemoRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle?: string;
}

export default function DemoRestrictedModal({
  isOpen,
  onClose,
  actionTitle = 'Envío de Invitación / Descarga Real'
}: DemoRestrictedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-6 p-2">
        
        {/* Luxury Lock Icon */}
        <div className="h-16 w-16 mx-auto rounded-3xl bg-[#FAF6F0] border-2 border-[#D3B48C] flex items-center justify-center text-[#4E8281] shadow-lg">
          <Lock className="h-8 w-8 text-[#D3B48C]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D3B48C] font-cinzel block">
            Candado de Seguridad • Modo Demostración
          </span>
          <h3
            className="text-xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Función Exclusiva del Plan Activo
          </h3>
          <p className="text-xs text-[#778F8C] leading-relaxed max-w-sm mx-auto">
            Esta es una función exclusiva del plan activo. Crea tu evento para enviar invitaciones reales a tus contactos, descargar pases finales en PDF y activar la mensajería automatizada por WhatsApp.
          </p>
        </div>

        {/* What includes real plan */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-left space-y-2 text-xs">
          <span className="text-[10px] font-bold text-[#4E8281] uppercase tracking-wider block">
            Al activar tu evento en OSHUN obtienes:
          </span>
          <div className="space-y-1.5 text-[#162E2D]">
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#4E8281] shrink-0" />
              <span>Envío ilimitado por WhatsApp con pases QR personalizados</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#4E8281] shrink-0" />
              <span>Descarga de boletos de lujo en PDF de alta resolución</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#4E8281] shrink-0" />
              <span>Panel de control con credenciales privadas exclusivas</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href="/events/new"
            className="w-full btn-oshun-primary py-3 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Crear Mi Propio Evento Ahora</span>
            <ArrowRight className="h-4 w-4 text-[#D3B48C]" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-white hover:bg-[#FAF6F0] text-[#778F8C] font-semibold text-xs transition-colors"
          >
            Continuar explorando el modo prueba
          </button>
        </div>

      </div>
    </Modal>
  );
}
