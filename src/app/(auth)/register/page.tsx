'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OshunLogo from '@/components/ui/OshunLogo';
import { ArrowRight, Lock, Mail, User, Sparkles } from 'lucide-react';
import { InvitaStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    InvitaStore.setUser({
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: 'ORGANIZER',
      tenantId: `tenant-${Date.now()}`,
      plan: 'PRO',
      createdAt: new Date().toISOString(),
    });

    router.push('/events/new');
  };

  return (
    <div className="min-h-screen bg-[#F4EDE2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-[#C0D3CC]/30 blur-[130px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-block">
          <OshunLogo variant="full" size="md" showSlogan={true} />
        </Link>
        <h2
          className="text-xl font-bold text-[#162E2D] pt-2"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Crea tu cuenta de organizador
        </h2>
        <p className="text-xs text-[#778F8C]">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#4E8281] font-bold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="rounded-3xl bg-white border border-[#D3B48C]/40 p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#162E2D] mb-1.5">Tu Nombre o Nombre de Pareja *</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. María & Andrés / Sofía Elizondo"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-9 py-2.5 text-xs text-[#162E2D] placeholder-[#778F8C]/60 focus:border-[#4E8281] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1.5">Correo Electrónico *</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-9 py-2.5 text-xs text-[#162E2D] placeholder-[#778F8C]/60 focus:border-[#4E8281] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#162E2D] mb-1.5">Contraseña *</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/40 px-9 py-2.5 text-xs text-[#162E2D] placeholder-[#778F8C]/60 focus:border-[#4E8281] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-oshun-primary w-full py-3 text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2"
            >
              <span>Registrarse y Diseñar Mi Evento</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center text-[11px] text-[#778F8C]">
            Al registrarte aceptas los Términos de Servicio y la Política de Privacidad de OSHUN.
          </div>
        </div>
      </div>
    </div>
  );
}
