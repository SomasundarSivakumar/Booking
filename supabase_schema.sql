-- ============================================================
-- Prakash Travels – Complete Database Schema (Run this in Supabase SQL Editor)
-- WARNING: This drops your old vehicles table. Old data will be lost.
-- ============================================================

-- ── 1. DROP old vehicles table if it exists ──────────────────
DROP TABLE IF EXISTS public.vehicles CASCADE;

-- ── 2. CREATE correct vehicles table ─────────────────────────
CREATE TABLE public.vehicles (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type        text NOT NULL CHECK (type IN ('car', 'bike')),
    name        text NOT NULL,
    brand       text NOT NULL,
    price       numeric NOT NULL DEFAULT 0,
    price_label text,
    year        integer NOT NULL DEFAULT 2020,
    km          text NOT NULL DEFAULT '0 km',
    fuel        text NOT NULL DEFAULT 'Petrol',
    tag         text NOT NULL DEFAULT 'Best Deal',
    location    text NOT NULL,
    seller      text NOT NULL,
    contact     text NOT NULL,
    posted      text,
    images      text[] DEFAULT '{}'::text[],
    created_at  timestamptz DEFAULT now() NOT NULL
);

-- ── 3. Enable Row Level Security ─────────────────────────────
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- ── 4. RLS Policies for vehicles ─────────────────────────────
CREATE POLICY "vehicles_select" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "vehicles_insert" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "vehicles_update" ON public.vehicles FOR UPDATE USING (true);
CREATE POLICY "vehicles_delete" ON public.vehicles FOR DELETE USING (true);


-- ============================================================
-- ── 5. DROP old bookings table if it exists ──────────────────
DROP TABLE IF EXISTS public.bookings CASCADE;

-- ── 6. CREATE correct bookings table ─────────────────────────
CREATE TABLE public.bookings (
    id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_type        text NOT NULL CHECK (trip_type IN ('one-way', 'round-trip')),
    car_model        text NOT NULL,
    pickup_location  text NOT NULL,
    drop_location    text NOT NULL,
    contact          text NOT NULL,
    pickup_date      date NOT NULL,
    return_date      date,
    pickup_time      text,
    distance_km      numeric,
    total_rate       numeric,
    created_at       timestamptz DEFAULT now() NOT NULL
);

-- ── 7. Enable Row Level Security ─────────────────────────────
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ── 8. RLS Policies for bookings ─────────────────────────────
CREATE POLICY "bookings_select" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_delete" ON public.bookings FOR DELETE USING (true);


-- ============================================================
-- ── 9. Reload schema cache so PostgREST sees new columns ─────
NOTIFY pgrst, 'reload schema';
