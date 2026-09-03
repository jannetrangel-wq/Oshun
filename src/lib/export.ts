import { Guest } from '@/types';

export function exportGuestsToCsv(guests: Guest[], eventTitle: string): void {
  const headers = [
    'Código',
    'Nombre Completo',
    'Teléfono',
    'Email',
    'Grupo',
    'Estado RSVP',
    'Pases Asignados',
    'Pases Confirmados',
    'Acompañantes',
    'Mesa',
    'Restricciones Dietéticas',
    'Check-in',
    'Hora Check-in',
    'Notas',
  ];

  const rows = guests.map((g) => [
    `"${g.code}"`,
    `"${g.name.replace(/"/g, '""')}"`,
    `"${g.phone}"`,
    `"${g.email}"`,
    `"${g.group}"`,
    `"${g.status}"`,
    g.allowedCompanions,
    g.confirmedCompanions,
    `"${(g.companionNames || []).join(', ').replace(/"/g, '""')}"`,
    `"${g.tableNumber || ''}"`,
    `"${(g.dietaryRestrictions || '').replace(/"/g, '""')}"`,
    g.checkedIn ? 'SÍ' : 'NO',
    g.checkedInAt ? `"${new Date(g.checkedInAt).toLocaleString()}"` : '""',
    `"${(g.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `invitados_${eventTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseGuestsCsv(csvText: string): Partial<Guest>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const parsed: Partial<Guest>[] = [];

  // Omite encabezado si la primera fila contiene 'nombre' o 'name'
  const startIndex = lines[0].toLowerCase().includes('nombre') || lines[0].toLowerCase().includes('name') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const rawLine = lines[i];
    // Regex para manejar comillas y comas
    const cols = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(',');
    const cleanCols = cols.map((c) => c.replace(/^"|"$/g, '').trim());

    if (cleanCols.length > 0 && cleanCols[0]) {
      const name = cleanCols[0];
      const phone = cleanCols[1] || '';
      const email = cleanCols[2] || '';
      const group = cleanCols[3] || 'General';
      const allowed = parseInt(cleanCols[4] || '1', 10) || 1;
      const tableNumber = cleanCols[5] || '';

      parsed.push({
        name,
        phone,
        email,
        group,
        allowedCompanions: allowed,
        confirmedCompanions: 0,
        companionNames: [],
        status: 'PENDING',
        tableNumber,
        dietaryRestrictions: 'Ninguna',
        checkedIn: false,
      });
    }
  }

  return parsed;
}
