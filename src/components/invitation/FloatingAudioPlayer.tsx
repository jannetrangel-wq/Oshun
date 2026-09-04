'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

interface FloatingAudioPlayerProps {
  audioUrl?: string;
  autoplay?: boolean;
  enabled?: boolean;
  trackName?: string;
}

export default function FloatingAudioPlayer({
  audioUrl = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
  autoplay = false,
  enabled = true,
  trackName = 'Música Ambiental OSHUN',
}: FloatingAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !enabled) return;

    if (autoplay) {
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy until user gesture
            setIsPlaying(false);
          });
      }
    }

    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    };

    window.addEventListener('popstate', stopAudio);
    window.addEventListener('pagehide', stopAudio);
    window.addEventListener('beforeunload', stopAudio);

    return () => {
      stopAudio();
      window.removeEventListener('popstate', stopAudio);
      window.removeEventListener('pagehide', stopAudio);
      window.removeEventListener('beforeunload', stopAudio);
    };
  }, [autoplay, enabled, audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  if (!enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />

      <div className="flex items-center gap-2">
        
        {/* Floating Player Button */}
        <button
          onClick={togglePlay}
          className={`h-12 px-4 rounded-full border-2 shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 ${
            isPlaying
              ? 'bg-[#0F2424] text-white border-[#D3B48C] shadow-[#D3B48C]/30 ring-2 ring-[#D3B48C]/40'
              : 'bg-white/90 backdrop-blur-md text-[#162E2D] border-[#D3B48C]/50 hover:bg-white'
          }`}
          title={isPlaying ? 'Pausar música ambiental' : 'Reproducir música ambiental'}
        >
          {isPlaying ? (
            <>
              {/* Animated Equalizer Wave */}
              <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                <div className="w-1 bg-[#D3B48C] rounded-full animate-pulse h-full" style={{ animationDuration: '0.6s' }} />
                <div className="w-1 bg-[#4E8281] rounded-full animate-pulse h-2/3" style={{ animationDuration: '0.8s' }} />
                <div className="w-1 bg-[#D3B48C] rounded-full animate-pulse h-4/5" style={{ animationDuration: '0.5s' }} />
              </div>
              <span className="text-[11px] font-bold text-[#D3B48C] hidden sm:inline font-cinzel">
                Música On
              </span>
              <Pause className="h-3.5 w-3.5 text-[#D3B48C]" />
            </>
          ) : (
            <>
              <div className="h-6 w-6 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#4E8281]">
                <Music className="h-3.5 w-3.5 text-[#4E8281]" />
              </div>
              <span className="text-[11px] font-bold text-[#162E2D] hidden sm:inline font-cinzel">
                Música Off
              </span>
              <Play className="h-3.5 w-3.5 text-[#4E8281] fill-[#4E8281]" />
            </>
          )}
        </button>

      </div>
    </div>
  );
}
