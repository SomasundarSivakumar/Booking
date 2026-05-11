import { NextRequest, NextResponse } from 'next/server';
import { supabase, formatPriceLabel } from '@/lib/supabase';

// PUT /api/vehicles/[id] — update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Auto-regenerate price_label if price changed
  if (body.price) {
    body.price_label = formatPriceLabel(Number(body.price));
  }

  // Remove fields that don't exist in the schema
  delete body.id;
  delete body.created_at;

  const { data, error } = await supabase
    .from('vehicles')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('PUT /api/vehicles/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/vehicles/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('DELETE /api/vehicles/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
