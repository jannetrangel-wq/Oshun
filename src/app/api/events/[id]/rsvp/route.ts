import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'RSVP registrado exitosamente',
      data: {
        eventId: params.id,
        ...body,
        respondedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error procesando RSVP' }, { status: 400 });
  }
}
