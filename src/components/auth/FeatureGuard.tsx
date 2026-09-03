'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowLeft, ShieldCheck, Crown, MessageSquare } from 'lucide-react';
import { InvitaStore } from '@/lib/store';
import { PlanFeatures, PLAN_CONFIG, PlanTier } from '@/types';
import OshunLogo from '@/components/ui/OshunLogo';

interface FeatureGuardProps {
  feature: keyof Pick<
    PlanFeatures,
    'canSeatingPlan' | 'canCheckInQr' | 'canAnalytics' | 'canLiveGallery' | 'canWhatsAppHub'
  >;
  featureName: string;
  requiredPlan: PlanTier;
  children: React.ReactNode;
}

export default function FeatureGuard({
  feature,
  featureName,
  requiredPlan,
  children,
}: FeatureGuardProps) {
  const user = InvitaStore.getUser();
  const planFeatures = InvitaStore.getUserPlanFeatures(user);

  // Super Admin has access to all tools
  if (user?.role === 'SUPER_ADMIN') {
    return <>{children}</>;
  }

  const isAllowed = planFeatures[feature];

  if (isAllowed) {
    return <>{children}</>;
  }

  const requiredPlanConfig = PLAN_CONFIG[requiredPlan];

  return (
    <div className="min-h-[520px] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="max-w-xl w-full rounded-3xl bg-white border-2 border-[#D3B48C]/50 p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D3B48C]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#4E8281]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Lock & Brand Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] border-2 border-[#D3B48C] flex items-center justify-center shadow-lg relative">
          <Lock className="h-7 w-7 text-[#D3B48C]" />
          <div className="absolute -bottom-1 -right-1 p-1 bg-[#4E8281] rounded-full text-white">
            <Crown className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D3B48C] font-cinzel block">
            Herramienta Exclusiva OSHUN
          </span>
          <h3
            className="text-xl sm:text-2xl font-bold text-[#162E2D]"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {featureName}
          </h3>
          <p className="text-xs text-[#778F8C] max-w-md mx-auto leading-relaxed">
            Tu cuenta actual cuenta con el <strong>{planFeatures.name}</strong>. Esta funcionalidad avanzada está disponible a partir del{' '}
            <strong className="text-[#4E8281]">{requiredPlanConfig.name}</strong>.
          </p>
        </div>

        {/* Features comparison card */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#D3B48C]/40 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#D3B48C]/30 pb-2">
            <span className="font-bold text-[#162E2D] font-serif">Plan Requerido:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#4E8281] text-white font-bold text-[10px]">
              {requiredPlanConfig.badgeIcon} {requiredPlanConfig.name}
            </span>
          </div>

          <p className="text-[11px] text-[#778F8C]">
            {requiredPlanConfig.desc}
          </p>

          <div className="flex items-center gap-2 text-[10px] text-[#4E8281] font-bold">
            <Sparkles className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Activación inmediata sin perder tus datos ni configuraciones.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#EFE3D4] hover:bg-[#EADBC6] text-[#162E2D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver a Mi Panel</span>
          </Link>

          <a
            href="https://wa.me/525500000000?text=Hola%2C%20quisiera%20solicitar%20un%20upgrade%20para%20mi%20evento%20en%20OSHUN"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto btn-oshun-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Crown className="h-3.5 w-3.5 text-[#D3B48C]" />
            <span>Solicitar Upgrade</span>
          </a>
        </div>
      </div>
    </div>
  );
}
