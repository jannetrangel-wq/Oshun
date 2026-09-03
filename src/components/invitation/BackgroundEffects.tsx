'use client';

import React from 'react';
import { AnimationType, AnimationIntensity } from '@/types';

interface BackgroundEffectsProps {
  enabled?: boolean;
  animationType?: AnimationType;
  intensity?: AnimationIntensity;
}

export default function BackgroundEffects({
  enabled = true,
  animationType = 'petals',
  intensity = 'medium',
}: BackgroundEffectsProps) {
  if (!enabled || animationType === 'none') {
    return null;
  }

  // Count of particles based on intensity
  const count = intensity === 'low' ? 6 : intensity === 'high' ? 18 : 12;
  const items = Array.from({ length: count });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      
      {/* 1. BOTANICAL GARDEN: Petals & Leaves */}
      {animationType === 'petals' && (
        <div className="absolute inset-0">
          {items.map((_, i) => {
            const left = `${(i * 100) / count + (i % 3) * 2}%`;
            const delay = `${(i * 1.5) % 8}s`;
            const duration = `${10 + (i % 5) * 3}s`;
            const size = 16 + (i % 4) * 6;
            const isLeaf = i % 2 === 0;

            return (
              <div
                key={i}
                className="absolute -top-10 opacity-70 animate-petal-fall"
                style={{
                  left,
                  animationDelay: delay,
                  animationDuration: duration,
                }}
              >
                {isLeaf ? (
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="#4E8281" opacity="0.6">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25V8.75C12,7.75 16,7 17,8Z" />
                  </svg>
                ) : (
                  <svg width={size} height={size} viewBox="0 0 24 24" fill="#D3B48C" opacity="0.75">
                    <path d="M12,2C12,2 8,6 8,10C8,12.21 9.79,14 12,14C14.21,14 16,12.21 16,10C16,6 12,2 12,2M12,16C9.79,16 8,17.79 8,20C8,20.55 8.45,21 9,21C9.55,21 10,20.55 10,20C10,18.9 10.9,18 12,18C13.1,18 14,18.9 14,20C14,20.55 14.45,21 15,21C15.55,21 16,20.55 16,20C16,17.79 14.21,16 12,16Z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TECH-LUXURY: Golden Bokeh & Sparkles */}
      {animationType === 'bokeh' && (
        <div className="absolute inset-0">
          {items.map((_, i) => {
            const left = `${(i * 100) / count + (i % 4) * 3}%`;
            const top = `${(i * 25) % 100}%`;
            const delay = `${(i * 0.8) % 6}s`;
            const size = 12 + (i % 5) * 14;

            return (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-tr from-[#D3B48C] to-[#FAF6F0] animate-pulse blur-xs"
                style={{
                  left,
                  top,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.25 + (i % 3) * 0.15,
                  animationDelay: delay,
                  animationDuration: `${3 + (i % 3) * 2}s`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 3. GLOW PARTY: Shifting Party Lights & Aura */}
      {animationType === 'glow-lights' && (
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#E0218A]/20 blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#00F0FF]/20 blur-[110px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-[#9900FF]/15 blur-[90px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '4s' }} />
        </div>
      )}

      {/* 4. CINEMATIC NIGHT: Graduation Caps & 3D Sparkles */}
      {animationType === 'confetti-caps' && (
        <div className="absolute inset-0">
          {items.map((_, i) => {
            const left = `${(i * 100) / count}%`;
            const delay = `${(i * 1.2) % 7}s`;
            const duration = `${12 + (i % 4) * 3}s`;
            const isCap = i % 3 === 0;

            return (
              <div
                key={i}
                className="absolute -top-10 animate-petal-fall"
                style={{
                  left,
                  animationDelay: delay,
                  animationDuration: duration,
                }}
              >
                {isCap ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#94A3B8" opacity="0.7">
                    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.5 8.13 21.36 12 21.36C15.87 21.36 19 19.5 19 17.18V13.18L12 17L5 13.18Z" />
                  </svg>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-[#3B82F6] opacity-60 shadow-xs shadow-blue-400" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. SWEET CELEBRATION: Drifting Clouds & Twinkling Stars */}
      {animationType === 'clouds-stars' && (
        <div className="absolute inset-0">
          {/* Cloud 1 */}
          <div className="absolute top-12 -left-32 w-64 h-24 bg-white/40 rounded-full blur-md animate-cloud-drift" style={{ animationDuration: '45s' }} />
          {/* Cloud 2 */}
          <div className="absolute top-64 -left-48 w-80 h-28 bg-white/30 rounded-full blur-lg animate-cloud-drift" style={{ animationDuration: '60s', animationDelay: '10s' }} />
          
          {/* Stars */}
          {items.map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                top: `${(i * 17) % 90}%`,
                left: `${(i * 23) % 95}%`,
                animationDuration: `${3 + (i % 4)}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5C6CB" opacity="0.6">
                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 6. ROMANCE CLÁSICO: Flying Doves & Corner Flourish */}
      {animationType === 'doves-floral' && (
        <div className="absolute inset-0">
          {/* Doves flying */}
          <div className="absolute top-16 -left-20 animate-dove-fly" style={{ animationDuration: '28s' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#C49A45" opacity="0.6">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 15.5 3.8 18.6 6.5 20.4L7.5 19.3C5.3 17.8 3.8 15.1 3.8 12C3.8 7.5 7.5 3.8 12 3.8C16.5 3.8 20.2 7.5 20.2 12C20.2 14.5 19.1 16.7 17.3 18.2L18.4 19.3C20.6 17.5 22 14.9 22 12C22 6.5 17.5 2 12 2M11 6L9 10H13L11 6M12 11C10.9 11 10 11.9 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11.9 13.1 11 12 11Z" />
            </svg>
          </div>

          {/* Corner Flourish */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
            <div className="w-full h-full border-t-4 border-r-4 border-[#722F37] rounded-tr-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none">
            <div className="w-full h-full border-b-4 border-l-4 border-[#722F37] rounded-bl-3xl" />
          </div>
        </div>
      )}

      {/* 7. ELEGANCIA EJECUTIVA: Abstract Geometric Lines */}
      {animationType === 'geometry' && (
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="exec-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#475569" strokeWidth="0.75" />
                <circle cx="0" cy="0" r="2" fill="#B45309" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#exec-grid)" />
          </svg>
        </div>
      )}

      {/* 8. TROPICAL SUNSET: Palm Breeze & Solar Glow */}
      {animationType === 'tropical-breeze' && (
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#E6953B]/30 to-[#C85A32]/20 blur-[120px]" />
          
          {/* Palm Frond SVG Silhouettes at top */}
          <div className="absolute -top-10 -left-10 opacity-25 animate-pulse" style={{ animationDuration: '8s' }}>
            <svg width="220" height="220" viewBox="0 0 100 100" fill="#C85A32">
              <path d="M0,0 Q50,20 80,80 Q30,60 0,0 Z M0,0 Q70,10 95,50 Q40,40 0,0 Z M0,0 Q30,40 40,95 Q15,60 0,0 Z" />
            </svg>
          </div>
        </div>
      )}

      {/* 9. MINIMAL NUDE: Pure Gentle Breathe */}
      {animationType === 'fade' && (
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#FAF6F0]/40 blur-[130px] animate-pulse" style={{ animationDuration: '9s' }} />
        </div>
      )}

    </div>
  );
}
