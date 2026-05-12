import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/car-rates
export async function GET() {
  const { data, error } = await supabase
    .from('car_rates')
    .select('*')
    .order('rate', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/car-rates (Add or Update)
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const { data, error } = await supabase
    .from('car_rates')
    .upsert(body, { onConflict: 'value' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
