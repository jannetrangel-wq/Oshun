import { NextResponse } from 'next/server';
import { INITIAL_EVENTS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_EVENTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      data: {
        ...body,
        id: `event-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
