import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OSHUN — Cada celebración comienza con una conexión | Invitaciones Digitales & Gestión de Eventos',
  description:
    'Plataforma integral para crear y administrar invitaciones digitales elegantes, RSVP interactivo, pases con código QR y control de acceso para bodas, aniversarios y celebraciones exclusivas.',
  keywords: [
    'OSHUN',
    'invitaciones digitales',
    'bodas',
    'RSVP en línea',
    'gestión de eventos',
    'código QR boletos',
    'confirmación WhatsApp',
    'eventos exclusivos',
  ],
  authors: [{ name: 'OSHUN' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4E8281',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#F4EDE2] text-[#162E2D] font-sans selection:bg-[#4E8281] selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
