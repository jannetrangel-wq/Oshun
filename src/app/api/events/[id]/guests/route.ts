import { NextResponse } from 'next/server';
import { generateInitialGuests } from '@/lib/mock-data';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const guests = generateInitialGuests(params.id);
  return NextResponse.json({
    success: true,
    data: guests,
  });
}
