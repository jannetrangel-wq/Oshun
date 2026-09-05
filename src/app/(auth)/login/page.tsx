'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OshunLogo from '@/components/ui/OshunLogo';
import {
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { InvitaStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = InvitaStore.login(username.trim(), password);
      setIsLoading(false);

      if (result.success && result.user) {
        // Check for callbackUrl query parameter
        let callbackUrl: string | null = null;
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          callbackUrl = params.get('callbackUrl');
        }

        if (callbackUrl && !callbackUrl.startsWith('/login')) {
          router.push(callbackUrl);
          return;
        }

        if (result.user.role === 'SUPER_ADMIN' || result.user.username?.toLowerCase() === 'administradorgeneral') {
          router.push('/admin');
        } else if (result.user.eventId) {
          router.push(`/events/${result.user.eventId}/guests`);
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(result.error || 'Credenciales incorrectas');
      }
    }, 400);
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#162E2D] flex flex-col justify-between selection:bg-[#4E8281] selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D3B48C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#4E8281]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-[#D3B48C]/30 bg-white/70 backdrop-blur-md">
        <Link href="/" className="group flex items-center gap-2">
          <OshunLogo variant="horizontal" size="md" />
        </Link>
        <Link
          href="/"
          className="text-xs font-bold text-[#4E8281] hover:text-[#162E2D] transition-colors"
        >
          ← Volver al Sitio Web
        </Link>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full rounded-3xl bg-white border-2 border-[#D3B48C]/50 p-8 sm:p-10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300 relative z-10">
          
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-[#4E8281] shadow-sm mb-1">
              <KeyRound className="h-6 w-6 text-[#4E8281]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D3B48C] font-cinzel block">
              Control de Acceso • OSHUN
            </span>
            <h1
              className="text-2xl font-bold text-[#162E2D]"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Iniciar Sesión en Mi Panel
            </h1>
            <p className="text-xs text-[#778F8C]">
              Ingresa tus credenciales para acceder a la gestión de tu evento.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} method="POST" className="space-y-4 text-xs">
            <div>
              <label htmlFor="username" className="block font-bold text-[#162E2D] mb-1.5">
                Usuario / Correo Electrónico *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. Administradorgeneral o usuario"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 pl-10 pr-4 py-2.5 text-xs text-gray-900 font-medium placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#4E8281]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-bold text-[#162E2D] mb-1.5">
                Contraseña de Acceso *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#778F8C]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-[#FAF6F0] border border-[#D3B48C]/50 pl-10 pr-10 py-2.5 text-xs text-gray-900 font-medium placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#4E8281]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#778F8C] hover:text-[#162E2D]"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-oshun-primary py-3 rounded-full text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <span>Verificando...</span>
              ) : (
                <>
                  <span>Ingresar a Mi Panel</span>
                  <ArrowRight className="h-4 w-4 text-[#D3B48C]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helper Chips */}
          <div className="pt-3 border-t border-[#D3B48C]/30 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#778F8C] block">
              Accesos Rápidos de Prueba:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('Administradorgeneral', 'JanetySergio2908')}
                className="p-2 rounded-xl bg-[#0F2424] text-[#D3B48C] text-[10px] font-bold border border-[#D3B48C]/40 hover:bg-[#1A3838] transition-colors text-left"
              >
                <span className="block font-semibold">👑 Admin General</span>
                <span className="text-[9px] text-[#D3B48C]/70 block font-mono">Administradorgeneral</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('boda-maria-andres', 'OSHUN-MARIA2026')}
                className="p-2 rounded-xl bg-[#FAF6F0] text-[#162E2D] text-[10px] font-bold border border-[#D3B48C]/50 hover:bg-white transition-colors text-left"
              >
                <span className="block font-semibold">👰 Cliente Demo</span>
                <span className="text-[9px] text-[#778F8C] block font-mono">boda-maria-andres</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-[#778F8C] border-t border-[#D3B48C]/30 bg-white/50">
        OSHUN Plataforma SaaS de Eventos • Todos los derechos reservados
      </footer>
    </div>
  );
}
