import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ────────────────────────────────────────────────────────────────────
export type VehicleType = 'car' | 'bike';

export interface Vehicle {
  id: string | number;
  type: VehicleType;
  name: string;
  brand: string;
  price: number;
  price_label: string;
  year: number;
  km: string;
  fuel: string;
  tag: string;
  location: string;
  seller: string;
  contact: string;
  posted: string;
  images: string[];
  created_at: string;
}

export interface Booking {
  id: string | number;
  trip_type: string;
  car_model: string;
  pickup_location: string;
  drop_location: string;
  contact: string;
  pickup_date: string;
  return_date: string | null;
  pickup_time: string | null;
  distance_km: number | null;
  total_rate: number | null;
  created_at: string;
}

export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at' | 'posted'>;

/** Format price as Indian locale string e.g ₹7,50,000 */
export function formatPriceLabel(price: number): string {
  return '₹' + price.toLocaleString('en-IN');
}

/** Relative time string from ISO date */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}
