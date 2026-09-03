import { AudioTrackId } from '@/types';

export interface PreinstalledAudioTrack {
  id: AudioTrackId;
  name: string;
  genre: string;
  recommendedFor: string;
  audioUrl: string;
  duration: string;
}

export const PREINSTALLED_AUDIO_TRACKS: PreinstalledAudioTrack[] = [
  {
    id: 'romantico',
    name: 'Pista 1: Instrumental Romántico & Marcha Nupcial',
    genre: 'Piano Clásico & Cuerdas Románticas',
    recommendedFor: 'Bodas de Gala, Aniversarios de Oro',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
    duration: '2:15',
  },
  {
    id: 'vals',
    name: 'Pista 2: Vals Elegante & Clásico',
    genre: 'Vals Clásico & Orquesta de Cámara',
    recommendedFor: 'XV Años, Presentaciones y Galas de Noche',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=waltz-of-the-flowers-10332.mp3',
    duration: '2:40',
  },
  {
    id: 'acustico',
    name: 'Pista 3: Acústico Suave & Ambient',
    genre: 'Guitarra Acústica & Armonía Cálida',
    recommendedFor: 'Bautizos, Baby Showers, Primera Comunión',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=acoustic-guitars-ambient-10852.mp3',
    duration: '2:05',
  },
  {
    id: 'fiesta',
    name: 'Pista 4: Fiesta & Pop Instrumental',
    genre: 'Pop Upbeat & Ritmo Festivo Juvenil',
    recommendedFor: 'Cumpleaños, Graduaciones y Fiestas',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77c30.mp3?filename=happy-day-12445.mp3',
    duration: '1:50',
  },
  {
    id: 'brisa',
    name: 'Pista 5: Brisa & Piano Relax',
    genre: 'Piano Minimal & Olas Relajantes',
    recommendedFor: 'Bodas en Playa, Jardín, Eventos al Atardecer',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c973a21bb0.mp3?filename=relaxing-piano-126245.mp3',
    duration: '2:30',
  },
];
