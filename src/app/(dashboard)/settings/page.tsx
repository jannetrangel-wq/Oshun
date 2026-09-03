'use client';

import React, { useState } from 'react';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Sparkles,
  Check,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';

export default function SettingsPage() {
  const user = InvitaStore.getUser();
  const [name, setName] = useState(user?.name || 'María & Andrés');
  const [email, setEmail] = useState(user?.email || 'contacto@mariaandres.com');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      InvitaStore.setUser({
        ...user,
        name,
        email,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
          Configuración • OSHUN
        </span>
        <h2
          className="text-xl sm:text-2xl font-bold text-[#162E2D]"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Ajustes de Cuenta & Suscripción
        </h2>
        <p className="text-xs text-[#778F8C]">
          Administra tu perfil, planes activos y preferencias de notificación.
        </p>
      </div>

      {/* Plan Card */}
      <div className="rounded-3xl bg-[#0F2424] text-white border-2 border-[#D3B48C] p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D3B48C]">
              Plan Actual Activo
            </span>
            <h3
              className="text-xl font-bold text-white mt-1"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Plan Evento PRO (Ilimitado)
            </h3>
            <p className="text-xs text-slate-300">
              Disfrutas de todas las características OSHUN, pases con QR ilimitados y WhatsApp 1-clic.
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-[#D3B48C] text-[#0F2424] font-bold text-xs uppercase tracking-wider shadow">
            Activo • $499 MXN
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 shadow-sm space-y-4">
        <h3
          className="text-base font-bold text-[#162E2D]"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Información del Organizador
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Nombre Completo o Pareja</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-3.5 py-2.5 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-3.5 py-2.5 text-xs text-[#162E2D] focus:border-[#4E8281] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#D3B48C]/20">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                ¡Cambios guardados con éxito!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="btn-oshun-primary text-xs px-6 py-2.5"
            >
              Guardar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
