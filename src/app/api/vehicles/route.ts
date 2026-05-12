import { NextRequest, NextResponse } from 'next/server';
import { supabase, formatPriceLabel } from '@/lib/supabase';

// GET /api/vehicles?type=car|bike
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let query = supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (type === 'car' || type === 'bike') {
    query = query.ilike('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('GET /api/vehicles error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/vehicles — create a new listing
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Auto-generate price_label
  if (body.price && !body.price_label) {
    body.price_label = formatPriceLabel(Number(body.price));
  }

  // Strip any client-side only fields
  delete body.id;
  delete body.created_at;

  // Ensure required fields exist
  const payload = {
    type: body.type || 'car',
    name: body.name || '',
    brand: body.brand || '',
    price: Number(body.price) || 0,
    price_label: body.price_label || '',
    year: Number(body.year) || new Date().getFullYear(),
    km: body.km || '0 km',
    fuel: body.fuel || 'Petrol',
    tag: body.tag || 'Best Deal',
    location: body.location || '',
    seller: body.seller || '',
    contact: body.contact || '',
    images: Array.isArray(body.images) ? body.images : [],
    rate_per_km: Number(body.rate_per_km) || 0,
  };

  const { data, error } = await supabase
    .from('vehicles')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('POST /api/vehicles error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
