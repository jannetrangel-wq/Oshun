import { NextResponse } from 'next/server';
import { TEMPLATES_DATA } from '@/lib/templates-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: TEMPLATES_DATA,
  });
}
