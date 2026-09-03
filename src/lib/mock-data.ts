export const SUPER_ADMIN_USER: User = {
  id: 'user-admin-master',
  username: 'Administradorgeneral',
  password: 'JanetySergio2908',
  name: 'Administrador General OSHUN',
  email: 'administracion@oshun.com',
  role: 'SUPER_ADMIN',
  tenantId: 'tenant-global',
  plan: 'IMPERIAL',
  createdAt: '2025-01-01T00:00:00Z',
};

export const INITIAL_USERS: User[] = [
  SUPER_ADMIN_USER,
  {
    id: 'user-maria-andres',
    username: 'boda-maria-andres',
    password: 'OSHUN-MARIA2026',
    name: 'María & Andrés',
    email: 'contacto@mariaandres.com',
    role: 'CLIENT',
    tenantId: 'tenant-01',
    plan: 'IMPERIAL',
    eventId: 'event-01',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'user-sofia-xv',
    username: 'xv-sofia-garza',
    password: 'OSHUN-SOFIA2026',
    name: 'Familia Garza (XV Sofía)',
    email: 'garza@ejemplo.com',
    role: 'CLIENT',
    tenantId: 'tenant-02',
    plan: 'ELEGANCE',
    eventId: 'event-xv-demo',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user-bautizo-mateo',
    username: 'bautizo-mateo',
    password: 'OSHUN-MATEO2026',
    name: 'Familia Morales (Bautizo Mateo)',
    email: 'morales@ejemplo.com',
    role: 'CLIENT',
    tenantId: 'tenant-03',
    plan: 'ESENCIAL',
    eventId: 'event-bautizo-demo',
    createdAt: '2026-02-15T10:00:00Z',
  },
];

export const CURRENT_USER: User = INITIAL_USERS[1]; // María & Andrés default

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'event-01',
    tenantId: 'tenant-01',
    userId: 'user-01',
    title: 'Boda de María & Andrés',
    slug: 'boda-ana-y-carlos', // Mantenemos compatibilidad con el slug existente
    category: 'boda',
    date: '2026-07-20',
    time: '17:00',
    venueName: 'Hacienda San José del Cabo',
    address: 'Carretera Transpeninsular Km 18.5, Corredor Turístico',
    city: 'Los Cabos, Baja California Sur',
    description: 'Cada celebración comienza con una conexión. Nos llena de gozo compartir nuestra unión frente al mar.',
    status: 'PUBLISHED',
    guestsCount: 250,
    confirmedCount: 184,
    pendingCount: 42,
    declinedCount: 24,
    checkInCount: 167,
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-02-01T15:30:00Z',
    design: {
      templateId: 'oshun-brisa-marina',
      templateName: 'OSHUN — Brisa Marina & Oro',
      primaryColor: '#4E8281', // Turquesa Profundo
      secondaryColor: '#FAF6F0', // Marfil Cálido
      backgroundColor: '#97B8B3', // Turquesa Agua Oficial
      textColor: '#162E2D',
      accentColor: '#D3B48C', // Dorado Champagne
      cardBackground: 'rgba(250, 246, 240, 0.95)',
      fontFamilyTitle: 'Cinzel',
      fontFamilyBody: 'Montserrat',
      coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      musicAutoplay: false,
      musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
      badgeStyle: 'gold',
      sections: {
        hero: {
          enabled: true,
          title: 'MARÍA & ANDRÉS',
          subtitle: 'TE INVITAMOS A CELEBRAR JUNTOS NUESTRA BODA',
          dateText: '20 DE JULIO DE 2026',
          timeText: '17:00 HRS',
          backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
        },
        countdown: {
          enabled: true,
          targetDate: '2026-07-20T17:00:00',
        },
        story: {
          enabled: true,
          title: 'Nuestra Conexión',
          content: 'Cada celebración comienza con una conexión. Nos emociona celebrar nuestro amor rodeados del azul profundo del mar y el cariño de nuestra familia y amigos.',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        },
        schedule: {
          enabled: true,
          title: 'Itinerario de Celebración',
          items: [
            { time: '17:00 hrs', title: 'Ceremonia Religiosa', description: 'Capilla San Pedro del Mar' },
            { time: '18:30 hrs', title: 'Cóctel al Atardecer', description: 'Terraza Los Arcos' },
            { time: '20:00 hrs', title: 'Cena de Gala & Brindis', description: 'Salón Bahía Esmeralda' },
            { time: '22:00 hrs', title: 'Fiesta & Baile', description: 'Pista Principal' },
          ],
        },
        location: {
          enabled: true,
          title: 'Lugar del Evento',
          venueName: 'Hacienda San José del Cabo',
          address: 'Carretera Transpeninsular Km 18.5, Corredor Turístico',
          city: 'Los Cabos, Baja California Sur',
          googleMapsUrl: 'https://maps.google.com/?q=Los+Cabos+Mexico',
          wazeUrl: 'https://waze.com/ul?q=Los+Cabos+Mexico',
        },
        gallery: {
          enabled: true,
          title: 'Galería de Momentos',
          images: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
          ],
        },
        dressCode: {
          enabled: true,
          title: 'Código de Vestimenta',
          type: 'Formal Guayabera / Cóctel Elegante',
          description: 'Hombres: Guayabera de lino formal en tonos arena/neutros o traje ligero. Mujeres: Vestido largo o midi en tonos frescos (se reserva el color blanco).',
          colors: ['#4E8281', '#97B8B3', '#D3B48C', '#EFE3D4'],
        },
        giftRegistry: {
          enabled: true,
          title: 'Mesa de Regalos',
          description: 'El mejor regalo es compartir este día contigo. Si deseas tener una atención para nuestro nuevo hogar, dejamos a tu disposición nuestras opciones:',
          items: [
            { title: 'Liverpool Bodas', type: 'store', url: 'https://mesaderegalos.liverpool.com.mx' },
            { title: 'Amazon Bodas', type: 'store', url: 'https://amazon.com.mx/wedding' },
            { title: 'Transferencia BBVA', type: 'bank', clabe: '012180001234567890', accountHolder: 'María & Andrés' },
          ],
        },
        rsvp: {
          enabled: true,
          title: 'Confirmación de Asistencia (RSVP)',
          deadline: '2026-06-20',
          maxCompanionsPerGuest: 2,
          allowDietaryRestrictions: true,
          customMessage: 'Por favor confirma tu asistencia a la brevedad para asegurar tu lugar en nuestra celebración.',
        },
        qrPass: {
          enabled: true,
          title: 'Pase Digital con Código QR',
          instructions: 'Muestra tu código QR en tu teléfono al llegar a la recepción para ingresar sin demoras.',
        },
      },
    },
  },
];

export const generateInitialGuests = (eventId: string): Guest[] => {
  const GUEST_NAMES = [
    { name: 'Lic. Roberto Garza Sada', group: 'VIP', code: 'VIP01', allowed: 2, status: 'CONFIRMED' as const, companions: 2, table: 'Mesa 1 (Honor)' },
    { name: 'Dra. Carmen Villaseñor', group: 'Familia Novia', code: 'NOV01', allowed: 4, status: 'CONFIRMED' as const, companions: 4, table: 'Mesa 2 (Familia)' },
    { name: 'Ing. Fernando Treviño', group: 'Familia Novio', code: 'NOV02', allowed: 2, status: 'CONFIRMED' as const, companions: 2, table: 'Mesa 3 (Familia)' },
    { name: 'Valeria & Sebastián Domínguez', group: 'Amigos', code: 'AMI01', allowed: 2, status: 'CONFIRMED' as const, companions: 2, table: 'Mesa 4' },
    { name: 'Familia Mendoza Cantú', group: 'Familia Novia', code: 'NOV03', allowed: 5, status: 'CONFIRMED' as const, companions: 4, table: 'Mesa 5' },
    { name: 'Mateo & Sofía Alarcón', group: 'Amigos Universidad', code: 'AMI02', allowed: 2, status: 'CONFIRMED' as const, companions: 2, table: 'Mesa 6' },
    { name: 'Lic. Alejandro Garza', group: 'Trabajo / Colegas', code: 'TRB01', allowed: 2, status: 'PENDING' as const, companions: 0, table: 'Mesa 7' },
    { name: 'Dra. Beatriz Elizondo', group: 'Familia Novio', code: 'NOV04', allowed: 3, status: 'CONFIRMED' as const, companions: 3, table: 'Mesa 8' },
    { name: 'Carlos Slim Domit', group: 'VIP', code: 'VIP02', allowed: 2, status: 'CONFIRMED' as const, companions: 2, table: 'Mesa 1 (Honor)' },
    { name: 'Familia Peralta Zambrano', group: 'VIP', code: 'VIP03', allowed: 4, status: 'CONFIRMED' as const, companions: 4, table: 'Mesa 1 (Honor)' },
    { name: 'Gabriel & Lucía Navarro', group: 'Amigos', code: 'AMI03', allowed: 2, status: 'DECLINED' as const, companions: 0, table: 'Sin asignar' },
    { name: 'Dr. Javier Morales', group: 'Trabajo / Colegas', code: 'TRB02', allowed: 2, status: 'PENDING' as const, companions: 0, table: 'Mesa 9' },
  ];

  const guests: Guest[] = [];

  // Seed detailed 12 VIP guests
  GUEST_NAMES.forEach((item, index) => {
    guests.push({
      id: `guest-${index + 1}`,
      eventId,
      code: item.code,
      name: item.name,
      phone: `+5255${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${item.name.toLowerCase().replace(/[^a-z]/g, '')}@ejemplo.com`,
      group: item.group,
      status: item.status,
      allowedCompanions: item.allowed,
      confirmedCompanions: item.companions,
      companionNames: item.companions > 1 ? ['Acompañante 1', 'Acompañante 2'].slice(0, item.companions - 1) : [],
      dietaryRestrictions: index % 4 === 0 ? 'Vegetariano' : index % 6 === 0 ? 'Sin gluten' : 'Ninguna',
      tableNumber: item.table,
      notes: index === 0 ? 'Invitado de honor - Mesa principal' : '',
      checkedIn: item.status === 'CONFIRMED' && index < 8,
      checkedInAt: item.status === 'CONFIRMED' && index < 8 ? '2026-07-20T17:15:00Z' : undefined,
      checkedInBy: index < 8 ? 'Staff Carlos' : undefined,
      rsvpRespondedAt: '2026-06-15T14:00:00Z',
    });
  });

  // Generate remaining to complete 250 realistic guests
  const GROUPS = ['Familia Novia', 'Familia Novio', 'Amigos', 'Amigos Universidad', 'Trabajo / Colegas', 'VIP', 'Otros'];
  const FIRST_NAMES = ['Santiago', 'Emiliano', 'Daniel', 'Diego', 'Alejandro', 'Leonardo', 'Camila', 'Mariana', 'Renata', 'Ximena', 'Victoria', 'Sara'];
  const LAST_NAMES = ['García', 'Martínez', 'López', 'González', 'Rodríguez', 'Pérez', 'Sánchez', 'Ramírez', 'Flores', 'Gómez', 'Díaz', 'Morales'];

  for (let i = 13; i <= 250; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const group = GROUPS[i % GROUPS.length];
    const allowed = (i % 3) + 1;
    const isConfirmed = i <= 184;
    const isDeclined = !isConfirmed && i > 226;
    const isPending = !isConfirmed && !isDeclined;

    const status: 'CONFIRMED' | 'PENDING' | 'DECLINED' = isConfirmed ? 'CONFIRMED' : isDeclined ? 'DECLINED' : 'PENDING';
    const companions = isConfirmed ? allowed : 0;
    const isCheckedIn = isConfirmed && i <= 167;

    guests.push({
      id: `guest-${i}`,
      eventId,
      code: `OSH${String(i).padStart(3, '0')}`,
      name: `${fn} ${ln}`,
      phone: `+5255${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@ejemplo.com`,
      group,
      status,
      allowedCompanions: allowed,
      confirmedCompanions: companions,
      companionNames: companions > 1 ? Array.from({ length: companions - 1 }).map((_, idx) => `Acompañante ${idx + 1}`) : [],
      dietaryRestrictions: i % 7 === 0 ? 'Sin mariscos' : i % 11 === 0 ? 'Vegetariano' : 'Ninguna',
      tableNumber: isConfirmed ? `Mesa ${Math.floor((i - 1) / 10) + 1}` : 'Sin asignar',
      checkedIn: isCheckedIn,
      checkedInAt: isCheckedIn ? '2026-07-20T17:30:00Z' : undefined,
      checkedInBy: isCheckedIn ? 'Staff Laura' : undefined,
      rsvpRespondedAt: isConfirmed ? '2026-06-18T10:00:00Z' : undefined,
    });
  }

  return guests;
};

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-1',
    type: 'INVITATION',
    title: 'Invitación Oficial OSHUN',
    content: '¡Hola, {{nombre}}! 🌊 Nos llena de emoción invitarte a celebrar nuestra boda: *{{evento}}*.\n\n📅 Fecha: {{fecha}}\n⏰ Hora: {{hora}}\n📍 Lugar: {{lugar}}\n🎟️ Tienes reservados: *{{pases}} pases*\n\nPuedes ver todos los detalles y confirmar tu asistencia en el siguiente enlace:\n👉 {{url}}\n\n¡Esperamos contar con tu compañía!',
  },
  {
    id: 'tpl-2',
    type: 'REMINDER',
    title: 'Recordatorio Amable RSVP',
    content: '¡Hola, {{nombre}}! ✨ Esperamos te encuentres muy bien. Te recordamos que la fecha límite para confirmar tu asistencia a *{{evento}}* es pronto.\n\nPor favor confírmanos aquí: {{url}}\n¡Nos encantará verte ahí!',
  },
  {
    id: 'tpl-3',
    type: 'CONFIRMATION',
    title: 'Confirmación Recibida & Pase QR',
    content: '¡Gracias por confirmar tu asistencia, {{nombre}}! 🎉\n\nHemos registrado tus *{{pases}} pases* para *{{evento}}*.\n\nGuarda tu pase digital de acceso rápido con QR aquí:\n👉 {{url}}\n\n¡Nos vemos muy pronto!',
  },
  {
    id: 'tpl-4',
    type: 'LAST_NOTICE',
    title: 'Último Aviso de Acceso',
    content: '¡Hola, {{nombre}}! ⏳ Estamos afinando los últimos detalles para *{{evento}}*. Tu lugar y reservación de pases está esperándote.\n\nConfirma ahora para incluirte en el banquete: {{url}}',
  },
  {
    id: 'tpl-5',
    type: 'THANK_YOU',
    title: 'Agradecimiento Post-Evento',
    content: '¡Muchas gracias por habernos acompañado en *{{evento}}*, {{nombre}}! 💖 Tu presencia hizo de esta celebración un recuerdo inolvidable.\n\nCon todo nuestro cariño,\nMaría & Andrés',
  },
];

export const DEFAULT_MESSAGE_TEMPLATES = MESSAGE_TEMPLATES;

export const INITIAL_TABLES = [
  {
    id: 'tbl-01',
    eventId: 'event-01',
    name: 'Mesa Presidencial — Novios & Padres',
    tableNumber: 1,
    shape: 'HONOR' as const,
    capacity: 10,
    zone: 'Frente a Pista Principal',
    posX: 50,
    posY: 22,
    assignedGuestIds: ['g-1', 'g-9', 'g-10'],
    notes: 'Mesa de Honor decorada con centros florales altos',
  },
  {
    id: 'tbl-02',
    eventId: 'event-01',
    name: 'Mesa 2 — Familia Novia',
    tableNumber: 2,
    shape: 'ROUND' as const,
    capacity: 10,
    zone: 'Ala Izquierda Pista',
    posX: 22,
    posY: 38,
    assignedGuestIds: ['g-2', 'g-5'],
    notes: 'Familia cercana de la novia',
  },
  {
    id: 'tbl-03',
    eventId: 'event-01',
    name: 'Mesa 3 — Familia Novio',
    tableNumber: 3,
    shape: 'ROUND' as const,
    capacity: 10,
    zone: 'Ala Derecha Pista',
    posX: 78,
    posY: 38,
    assignedGuestIds: ['g-3', 'g-8'],
    notes: 'Familia cercana del novio',
  },
  {
    id: 'tbl-04',
    eventId: 'event-01',
    name: 'Mesa 4 — Amigos Universidad',
    tableNumber: 4,
    shape: 'ROUND' as const,
    capacity: 10,
    zone: 'Salón Central',
    posX: 22,
    posY: 64,
    assignedGuestIds: ['g-4', 'g-6'],
    notes: 'Amigos de la carrera',
  },
  {
    id: 'tbl-05',
    eventId: 'event-01',
    name: 'Mesa 5 — Colegas & Trabajo',
    tableNumber: 5,
    shape: 'ROUND' as const,
    capacity: 10,
    zone: 'Terraza Jardín',
    posX: 78,
    posY: 64,
    assignedGuestIds: ['g-7', 'g-11'],
    notes: 'Colegas de oficina',
  },
  {
    id: 'tbl-06',
    eventId: 'event-01',
    name: 'Mesa 6 — Amigos de Infancia',
    tableNumber: 6,
    shape: 'ROUND' as const,
    capacity: 8,
    zone: 'Salón Central',
    posX: 38,
    posY: 80,
    assignedGuestIds: [],
    notes: 'Mesa disponible',
  },
  {
    id: 'tbl-07',
    eventId: 'event-01',
    name: 'Mesa 7 — Familia Foránea',
    tableNumber: 7,
    shape: 'RECTANGULAR' as const,
    capacity: 12,
    zone: 'Zona Arcos',
    posX: 62,
    posY: 80,
    assignedGuestIds: [],
    notes: 'Familia que viaja de Monterrey y Guadalajara',
  },
  {
    id: 'tbl-08',
    eventId: 'event-01',
    name: 'Mesa 8 — Jóvenes & Primos',
    tableNumber: 8,
    shape: 'ROUND' as const,
    capacity: 10,
    zone: 'Junto al Bar & DJ',
    posX: 50,
    posY: 92,
    assignedGuestIds: [],
    notes: 'Cerca del DJ y pista de baile',
  },
];

