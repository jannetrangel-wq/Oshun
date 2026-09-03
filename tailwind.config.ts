import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Oficial OSHUN - Sistema Visual
        oshun: {
          marfil: '#F4EDE2',
          arena: '#EFE3D4',
          champagne: '#EADBC6',
          niebla: '#C0D3CC',
          agua: '#97B8B3',
          teal: '#4E8281',
          profundo: '#4E8281',
          dorado: '#D3B48C',
          verde: '#778F8C',
          oceano: '#0F2424',
          oscuro: '#162E2D',
          hover: '#3E6D6C',
          card: 'rgba(255, 255, 255, 0.7)',
          cardDark: 'rgba(22, 46, 45, 0.85)',
        },
        brand: {
          50: '#F4EDE2',
          100: '#EFE3D4',
          200: '#EADBC6',
          300: '#C0D3CC',
          400: '#97B8B3',
          500: '#4E8281',
          600: '#3E6D6C',
          700: '#2F5453',
          800: '#1F3C3B',
          900: '#0F2424',
          gold: '#D3B48C',
          sand: '#EFE3D4',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'Montserrat', 'Lato', 'Inter', 'sans-serif'],
        cinzel: ['var(--font-cinzel)', 'Cinzel', 'serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        lato: ['var(--font-lato)', 'Lato', 'sans-serif'],
      },
      boxShadow: {
        'oshun-sm': '0 2px 8px -2px rgba(78, 130, 129, 0.12), 0 1px 4px -1px rgba(211, 180, 140, 0.08)',
        'oshun': '0 8px 24px -4px rgba(78, 130, 129, 0.15), 0 4px 12px -2px rgba(211, 180, 140, 0.1)',
        'oshun-lg': '0 16px 36px -6px rgba(78, 130, 129, 0.2), 0 8px 16px -3px rgba(211, 180, 140, 0.15)',
        'oshun-glow': '0 0 25px -3px rgba(78, 130, 129, 0.35)',
        'gold-glow': '0 0 20px -2px rgba(211, 180, 140, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'oshun-hero': 'radial-gradient(circle at 50% 0%, rgba(192, 211, 204, 0.35) 0%, rgba(244, 237, 226, 0.95) 70%)',
        'oshun-sea': 'linear-gradient(135deg, #F4EDE2 0%, #EFE3D4 50%, #C0D3CC 100%)',
        'oshun-dark': 'linear-gradient(180deg, #0F2424 0%, #162E2D 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
