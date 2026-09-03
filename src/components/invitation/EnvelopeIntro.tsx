'use client';

import React, { useState } from 'react';
import OshunLogo from '@/components/ui/OshunLogo';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeIntroProps {
  title: string;
  subtitle?: string;
  dateText?: string;
  onOpen: () => void;
}

export default function EnvelopeIntro({
  title,
  subtitle = 'Te invitamos a celebrar juntos',
  dateText = 'Gran Noche de Gala',
  onOpen,
}: EnvelopeIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpening(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#D3B48C', '#B89758', '#FAF6F0', '#EADBC6'],
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setIsOpen(true);
      onOpen();
    }, 900);
  };

  if (isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2424]/90 backdrop-blur-md transition-opacity duration-700 ${isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Decorative Golden Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#D3B48C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#4E8281]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Envelope Outer Container */}
      <div className="max-w-md w-full relative z-10 animate-in zoom-in-95 duration-500 text-center space-y-6">
        
        {/* Top Hint */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D3B48C] font-cinzel block">
            Correspondencia Exclusiva • OSHUN
          </span>
          <p className="text-xs text-[#FAF6F0]/80">
            Has recibido una invitación formal para un gran acontecimiento
          </p>
        </div>

        {/* Physical Envelope Simulation */}
        <div
          onClick={handleOpenEnvelope}
          className="relative mx-auto w-full max-w-sm h-64 rounded-3xl bg-[#FAF6F0] border-4 border-[#D3B48C] shadow-2xl p-6 flex flex-col justify-between items-center cursor-pointer group hover:scale-[1.02] transition-transform overflow-hidden"
        >
          {/* Subtle envelope texture diagonal folds */}
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <div className="absolute top-0 left-0 w-full h-1/2 border-b-2 border-dashed border-[#B89758]" />
            <div className="absolute top-0 left-0 w-1/2 h-full border-r-2 border-dashed border-[#B89758]" />
          </div>

          {/* Envelope Header */}
          <div className="text-center space-y-0.5 pt-2">
            <span className="text-[9px] uppercase tracking-widest text-[#778F8C] font-bold block">
              {subtitle}
            </span>
            <h3
              className="text-lg font-bold text-[#162E2D] tracking-wider"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {title}
            </h3>
            <span className="text-[10px] text-[#D3B48C] font-bold block">
              {dateText}
            </span>
          </div>

          {/* Wax Seal (Sello de Lacre) Centerpiece */}
          <div className="relative my-auto">
            {/* Pulsing Aura */}
            <div className="absolute -inset-2 rounded-full bg-[#D3B48C]/40 blur-sm animate-ping" style={{ animationDuration: '3s' }} />

            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#8B1E1E] to-[#5C0A0A] border-4 border-[#D3B48C] shadow-2xl flex flex-col items-center justify-center text-white transition-transform group-hover:rotate-6">
              {/* Golden Rings Emblem */}
              <div className="flex items-center -space-x-1.5 mb-0.5">
                <div className="h-5 w-5 rounded-full border-2 border-[#D3B48C] shadow-xs" />
                <div className="h-5 w-5 rounded-full border-2 border-[#FAF6F0] shadow-xs" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#D3B48C] font-cinzel">
                ABRIR
              </span>
            </div>
          </div>

          {/* Envelope Bottom Instructions */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4E8281] uppercase tracking-wider group-hover:text-[#162E2D] transition-colors pb-1">
            <Sparkles className="h-3 w-3 text-[#D3B48C]" />
            <span>Toca el sello para abrir invitación</span>
          </div>

        </div>

      </div>

    </div>
  );
}
