import { Event, Guest, MessageTemplate } from '@/types';
import { formatDate, formatTime } from './utils';

export interface WhatsAppMessagePayload {
  guest: Guest;
  event: Event;
  templateContent: string;
  baseUrl?: string;
}

export function compileWhatsAppMessage({
  guest,
  event,
  templateContent,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://oshun.com',
}: WhatsAppMessagePayload): string {
  const guestUrl = `${baseUrl}/i/${event.slug}/${guest.code}`;
  const passes = guest.allowedCompanions > 1 ? `${guest.allowedCompanions} personas` : '1 persona';

  let message = templateContent;
  message = message.replace(/{{nombre}}/g, guest.name);
  message = message.replace(/{{evento}}/g, event.title);
  message = message.replace(/{{fecha}}/g, formatDate(event.date));
  message = message.replace(/{{hora}}/g, formatTime(event.time));
  message = message.replace(/{{lugar}}/g, `${event.venueName}, ${event.city}`);
  message = message.replace(/{{url}}/g, guestUrl);
  message = message.replace(/{{pases}}/g, passes);
  message = message.replace(/{{mesa}}/g, guest.tableNumber || 'Asignada en recepción');

  return message;
}

export function compileTemplate(
  templateContent: string,
  variables: { [key: string]: string }
): string {
  let message = templateContent;
  for (const [key, val] of Object.entries(variables)) {
    const reg = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(reg, val);
  }
  return message;
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  let cleaned = (phone || '528183920192').replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = `52${cleaned}`;
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

export const getWhatsAppLink = buildWhatsAppUrl;

export interface RsvpNotificationPayload {
  event: Event;
  guestName: string;
  guestPhone: string;
  attending: 'YES' | 'NO';
  companionsCount: number;
  guestCode?: string;
  dietary?: string;
  notes?: string;
  hostPhone?: string;
}

export function buildRsvpNotificationUrl({
  event,
  guestName,
  guestPhone,
  attending,
  companionsCount,
  guestCode,
  dietary,
  notes,
  hostPhone = '528183920192',
}: RsvpNotificationPayload): string {
  const statusEmoji = attending === 'YES' ? '✅ *¡SÍ ASISTIRÉ!*' : '❌ *NO PODRÉ ASISTIR*';
  const passesText = companionsCount === 1 ? '1 persona' : `${companionsCount} personas`;

  let text = `✨ *CONFIRMACIÓN DE ASISTENCIA — OSHUN*\n\n`;
  text += `📅 *Evento:* ${event.title}\n`;
  text += `📍 *Fecha y Lugar:* ${formatDate(event.date)} • ${event.venueName}\n\n`;
  text += `👤 *Invitado:* ${guestName}\n`;
  text += `📱 *Teléfono:* ${guestPhone}\n`;
  text += `🔔 *Respuesta:* ${statusEmoji}\n`;

  if (attending === 'YES') {
    text += `🎟️ *Pases Confirmados:* ${passesText}\n`;
    if (guestCode) {
      text += `🎫 *Código de Boleto:* #${guestCode}\n`;
    }
    if (dietary && dietary !== 'Ninguna' && dietary.trim()) {
      text += `🍽️ *Restricciones/Dieta:* ${dietary}\n`;
    }
  }

  if (notes && notes.trim()) {
    text += `💬 *Mensaje:* "${notes.trim()}"\n`;
  }

  text += `\n_Enviado automáticamente desde la invitación digital OSHUN_`;

  return buildWhatsAppUrl(hostPhone, text);
}
