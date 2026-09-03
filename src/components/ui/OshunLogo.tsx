'use client';

import React from 'react';

interface OshunLogoProps {
  variant?: 'full' | 'horizontal' | 'isotipo' | 'favicon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export default function OshunLogo({
  variant = 'horizontal',
  size = 'md',
  showSlogan = false,
  className = '',
}: OshunLogoProps) {
  // Sizing helper
  const getSizes = () => {
    switch (size) {
      case 'sm':
        return {
          imgHeight: 32,
          imgWidth: 32,
          fullWidth: 150,
          textTitle: 'text-base',
          textSub: 'text-[9px]',
        };
      case 'lg':
        return {
          imgHeight: 60,
          imgWidth: 60,
          fullWidth: 280,
          textTitle: 'text-2xl sm:text-3xl',
          textSub: 'text-xs',
        };
      case 'xl':
        return {
          imgHeight: 90,
          imgWidth: 90,
          fullWidth: 360,
          textTitle: 'text-3xl sm:text-4xl',
          textSub: 'text-sm',
        };
      case 'md':
      default:
        return {
          imgHeight: 42,
          imgWidth: 42,
          fullWidth: 210,
          textTitle: 'text-xl sm:text-2xl',
          textSub: 'text-[10px]',
        };
    }
  };

  const sz = getSizes();

  // 1. ISOTIPO / ICON ONLY: Transparent pure emblem (Seashell + Waves)
  if (variant === 'isotipo') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <img
          src="/assets/images/emblem.png"
          alt="OSHUN Isotipo"
          className="object-contain select-none"
          style={{ width: `${sz.imgWidth}px`, height: `${sz.imgHeight}px` }}
        />
      </div>
    );
  }

  // 2. FAVICON: Compact transparent emblem
  if (variant === 'favicon') {
    return (
      <div className="relative inline-flex items-center justify-center h-10 w-10">
        <img
          src="/assets/images/emblem.png"
          alt="OSHUN Favicon"
          className="h-10 w-10 object-contain select-none"
        />
      </div>
    );
  }

  // 3. FULL LOGO: Complete official emblem + OSHUN typography + Slogans (100% transparent PNG)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src="/assets/images/logo.png"
          alt="OSHUN — Cada celebración comienza con una conexión"
          className="w-full h-auto object-contain mx-auto select-none"
          style={{ maxWidth: `${sz.fullWidth}px` }}
        />
      </div>
    );
  }

  // 4. HORIZONTAL VARIANT (Default Header/Nav logo): Transparent emblem + Cinzel text
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/assets/images/emblem.png"
        alt="OSHUN Emblem"
        className="object-contain shrink-0 select-none"
        style={{ width: `${sz.imgWidth}px`, height: `${sz.imgHeight}px` }}
      />
      <div className="flex flex-col">
        <span
          className={`font-serif tracking-[0.24em] font-bold text-[#4E8281] leading-none ${sz.textTitle}`}
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          OSHUN
        </span>
        {showSlogan ? (
          <span
            className={`text-[#778F8C] font-medium tracking-normal mt-0.5 ${sz.textSub}`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Cada celebración comienza con una conexión.
          </span>
        ) : (
          <span
            className="text-[9px] text-[#D3B48C] font-bold uppercase tracking-widest mt-0.5"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Invitaciones Digitales
          </span>
        )}
      </div>
    </div>
  );
}
