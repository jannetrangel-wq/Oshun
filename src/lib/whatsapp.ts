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
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = `52${cleaned}`;
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

export const getWhatsAppLink = buildWhatsAppUrl;
