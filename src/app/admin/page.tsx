'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Car, Bike, Plus, Pencil, Trash2, X, Check, Search,
  ChevronDown, ImageIcon, MapPin, Fuel, Tag, Wallet,
  CalendarDays, Gauge, User, AlertTriangle, RefreshCw,
  LayoutDashboard, LogOut, Eye, Bookmark, Clock3, Navigation, Phone,
  Upload, XCircle, CheckCircle2, Circle, Filter,
} from 'lucide-react';
import type { Vehicle, Booking } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode = 'vehicles' | 'bookings';
type Tab = 'all' | 'car' | 'bike';
type BookingFilter = 'all' | 'finished' | 'unfinished';

const FUELS = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
const TAGS = ['Best Deal', 'Low Mileage', 'Like New', 'Popular', 'Verified', 'Premium', 'Top Pick', 'Family Pick', 'Sports', 'Racing'];
const LOCATIONS = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy', 'Erode', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kochi'];

interface FormState {
  type: 'car' | 'bike';
  name: string;
  brand: string;
  price: string;
  year: string;
  km: string;
  fuel: string;
  tag: string;
  location: string;
  seller: string;
  contact: string;
  images: string[]; // array of uploaded R2 URLs
}

const EMPTY_FORM: FormState = {
  type: 'car', name: '', brand: '', price: '', year: new Date().getFullYear().toString(),
  km: '', fuel: 'Petrol', tag: 'Best Deal', location: '', seller: '', contact: '', images: [],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function typeColor(type: string) {
  return type === 'car'
    ? { bg: 'bg-dynamic-orange/10', text: 'text-dynamic-orange', border: 'border-dynamic-orange/20' }
    : { bg: 'bg-steel-blue/10', text: 'text-steel-blue', border: 'border-steel-blue/20' };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-[#1e2f42] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-dynamic-orange/50 placeholder:text-slate-600 transition-colors";
const selectCls = `${inputCls} cursor-pointer`;

// ─── R2 Image Uploader ───────────────────────────────────────────────────────
function R2ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Upload failed');
    }
    const data = await res.json();
    return data.url as string;
  };

  const handleFiles = async (files: FileList | File[]) => {
    setUploadError('');
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        if (url) newUrls.push(url);
      }
      onChange([...images, ...newUrls]);
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Vehicle Images</span>

      {/* Drop Zone */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
          ${dragOver ? 'border-dynamic-orange/60 bg-dynamic-orange/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'}
          ${uploading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <RefreshCw size={24} className="text-dynamic-orange animate-spin" />
            <p className="text-slate-400 text-sm font-semibold">Uploading to AWS S3…</p>
          </>
        ) : (
          <>
            <Upload size={24} className="text-slate-500" />
            <p className="text-slate-300 text-sm font-semibold">Drag & drop images here</p>
            <p className="text-slate-600 text-xs">or click to browse · JPG, PNG, WEBP · max 5MB each</p>
          </>
        )}
      </div>

      {uploadError && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertTriangle size={12} /> {uploadError}
        </p>
      )}

      {/* Uploaded Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden bg-white/5 aspect-video group">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
              >
                <XCircle size={16} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[0.6rem] font-bold px-1.5 py-0.5 bg-dynamic-orange/80 text-white rounded">COVER</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Vehicle Form Modal ────────────────────────────────────────────────────────
function VehicleFormModal({
  vehicle,
  onClose,
  onSaved,
}: {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!vehicle;
  const [form, setForm] = useState<FormState>(() => {
    if (!vehicle) return EMPTY_FORM;
    return {
      type: vehicle.type || 'car',
      name: vehicle.name || (vehicle as any).title || '',
      brand: vehicle.brand || '',
      price: String(vehicle.price || ''),
      year: String(vehicle.year || new Date().getFullYear()),
      km: vehicle.km || '',
      fuel: vehicle.fuel || 'Petrol',
      tag: vehicle.tag || 'Best Deal',
      location: vehicle.location || '',
      seller: vehicle.seller || '',
      contact: vehicle.contact || '',
      images: vehicle.images?.length
        ? vehicle.images
        : ((vehicle as any).image_url ? [(vehicle as any).image_url] : []),
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const set = (key: keyof FormState, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const images = Array.isArray(form.images) ? form.images : [];
    const payload = {
      type: form.type,
      name: form.name.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      year: Number(form.year),
      km: form.km.trim(),
      fuel: form.fuel,
      tag: form.tag,
      location: form.location.trim(),
      seller: form.seller.trim(),
      contact: form.contact.trim(),
      images,
    };
    try {
      const url = isEdit ? `/api/vehicles/${vehicle!.id}` : '/api/vehicles';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save');
      }
      onSaved();
      close();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[600] flex items-center justify-center transition-all duration-300
        ${visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
      onClick={close}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#162030] border border-white/[0.08] rounded-2xl shadow-2xl
          transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-dynamic-orange/10 flex items-center justify-center">
              {isEdit ? <Pencil size={16} className="text-dynamic-orange" /> : <Plus size={17} className="text-dynamic-orange" />}
            </div>
            <h2 className="text-white font-bold text-lg">{isEdit ? 'Edit Listing' : 'Add New Listing'}</h2>
          </div>
          <button onClick={close} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border-none">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* Type toggle */}
          <div className="flex gap-2">
            {(['car', 'bike'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer
                  ${form.type === t
                    ? t === 'car' ? 'bg-dynamic-orange/10 border-dynamic-orange/40 text-dynamic-orange' : 'bg-steel-blue/10 border-steel-blue/40 text-steel-blue'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20'}`}
              >
                {t === 'car' ? <Car size={15} /> : <Bike size={15} />}
                {t === 'car' ? 'Car' : 'Bike'}
              </button>
            ))}
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vehicle Name">
              <input required className={inputCls} placeholder="e.g. Honda City 2020" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Brand">
              <input required className={inputCls} placeholder="e.g. Honda" value={form.brand} onChange={e => set('brand', e.target.value)} />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (₹)">
              <input required type="number" min="0" className={inputCls} placeholder="750000" value={form.price} onChange={e => set('price', e.target.value)} />
            </Field>
            <Field label="Year">
              <input required type="number" min="1990" max="2030" className={inputCls} placeholder="2021" value={form.year} onChange={e => set('year', e.target.value)} />
            </Field>
            <Field label="KM Driven">
              <input required className={inputCls} placeholder="12,000 km" value={form.km} onChange={e => set('km', e.target.value)} />
            </Field>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fuel Type">
              <select className={selectCls} value={form.fuel} onChange={e => set('fuel', e.target.value)}>
                {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Badge / Tag">
              <select className={selectCls} value={form.tag} onChange={e => set('tag', e.target.value)}>
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 gap-4">
            <Field label="Location">
              <input required className={inputCls} list="loc-list" placeholder="Chennai" value={form.location} onChange={e => set('location', e.target.value)} />
              <datalist id="loc-list">{LOCATIONS.map(l => <option key={l} value={l} />)}</datalist>
            </Field>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Seller Name">
              <input required className={inputCls} placeholder="Ravi Kumar" value={form.seller} onChange={e => set('seller', e.target.value)} />
            </Field>
            <Field label="Contact Number">
              <input required type="tel" className={inputCls} placeholder="9876543210" value={form.contact} onChange={e => set('contact', e.target.value)} />
            </Field>
          </div>

          {/* Images — Drag & Drop Uploader */}
          <R2ImageUploader
            images={form.images}
            onChange={(urls) => setForm(f => ({ ...f, images: urls }))}
          />

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertTriangle size={15} /> {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3 shrink-0">
          <button type="button" onClick={close} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors font-semibold text-sm cursor-pointer bg-transparent">
            Cancel
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-dynamic-orange to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer border-none disabled:opacity-50"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation ───────────────────────────────────────────────────────
function DeleteModal({ title, message, onConfirm, onCancel, loading }: { title: string; message: React.ReactNode; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} className="bg-[#162030] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-semibold text-sm cursor-pointer bg-transparent transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm cursor-pointer border-none transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [view, setView] = useState<ViewMode>('bookings');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>('all');

  // Vehicles State
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  // Delete State
  const [deleteVehicleTarget, setDeleteVehicleTarget] = useState<Vehicle | null>(null);
  const [deleteBookingTarget, setDeleteBookingTarget] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]); // for counts

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authPassword })
      });
      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setAuthError('Incorrect Password');
      }
    } catch {
      setAuthError('Connection Error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setAuthPassword('');
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (view === 'vehicles') {
        const res = await fetch('/api/vehicles');
        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : []);
      } else {
        // Build query params for API-based filtering
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (bookingFilter === 'finished') params.set('finished', 'true');
        else if (bookingFilter === 'unfinished') params.set('finished', 'false');

        const res = await fetch(`/api/bookings?${params.toString()}`);
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch {
      if (view === 'vehicles') setVehicles([]);
      else setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [view, search, bookingFilter]);

  // Fetch all bookings (unfiltered) for accurate counts
  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setAllBookings(Array.isArray(data) ? data : []);
    } catch {
      setAllBookings([]);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  // Debounce search to avoid firing API on every keystroke
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const displayedVehicles = vehicles.filter(v => {
    const vType = (v.type || '').toLowerCase();
    const matchTab = tab === 'all' || vType === tab;
    const matchSearch = !search ||
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // Bookings are already filtered by the API — use directly
  const displayedBookings = bookings;

  const bookingCounts = {
    all: allBookings.length,
    finished: allBookings.filter(b => b.finished).length,
    unfinished: allBookings.filter(b => !b.finished).length,
  };

  const toggleFinished = async (booking: Booking) => {
    const newVal = !booking.finished;
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, finished: newVal } : b));
    setAllBookings(prev => prev.map(b => b.id === booking.id ? { ...b, finished: newVal } : b));
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finished: newVal }),
      });
      if (!res.ok) {
        // Revert on failure
        setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, finished: !newVal } : b));
        setAllBookings(prev => prev.map(b => b.id === booking.id ? { ...b, finished: !newVal } : b));
      }
    } catch {
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, finished: !newVal } : b));
      setAllBookings(prev => prev.map(b => b.id === booking.id ? { ...b, finished: !newVal } : b));
    }
  };

  const counts = {
    all: vehicles.length,
    car: vehicles.filter(v => (v.type || '').toLowerCase() === 'car').length,
    bike: vehicles.filter(v => (v.type || '').toLowerCase() === 'bike').length,
  };

  const handleVehicleDelete = async () => {
    if (!deleteVehicleTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/vehicles/${deleteVehicleTarget.id}`, { method: 'DELETE' });
      await fetchData();
      setDeleteVehicleTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleBookingDelete = async () => {
    if (!deleteBookingTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/bookings/${deleteBookingTarget.id}`, { method: 'DELETE' });
      await fetchData();
      setDeleteBookingTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1320] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#162030] border border-white/[0.08] rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-dynamic-orange/10 flex items-center justify-center border border-dynamic-orange/20">
              <svg className="w-7 h-7 text-dynamic-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h1 className="text-white font-bold text-2xl tracking-wide">Admin Access</h1>
            <p className="text-slate-500 text-sm">Please enter the security password.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Password..."
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full bg-[#0B1320] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-dynamic-orange transition-colors font-medium tracking-widest text-center"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-400 text-xs font-bold text-center animate-pulse">{authError}</p>}
            <button
              type="submit"
              disabled={isAuthenticating || !authPassword}
              className="w-full bg-dynamic-orange hover:bg-[#ff8559] disabled:bg-dynamic-orange/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg border-none cursor-pointer tracking-wider text-sm flex items-center justify-center gap-2"
            >
              {isAuthenticating ? <RefreshCw size={18} className="animate-spin" /> : 'UNLOCK DASHBOARD'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1923] text-slate-200 font-heading pb-20">
      {/* Top Bar */}
      <header className="bg-[#162030] border-b border-white/[0.07] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dynamic-orange flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-black text-lg">Prakash Travels Admin</span>
          </div>
          {/* Vehicle/Booking toggle - commented out to show only bookings
          <div className="hidden sm:flex gap-2 bg-[#0f1923] p-1 rounded-xl border border-white/5 ml-4">
            <button
              onClick={() => { setView('vehicles'); setSearch(''); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all border-none cursor-pointer flex items-center gap-2 ${view === 'vehicles' ? 'bg-white/10 text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}
            >
              <Car size={14} /> Vehicles
            </button>
            <button
              onClick={() => { setView('bookings'); setSearch(''); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all border-none cursor-pointer flex items-center gap-2 ${view === 'bookings' ? 'bg-white/10 text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}
            >
              <Bookmark size={14} /> Bookings
            </button>
          </div>
          */}
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white text-sm font-medium transition-colors">
            <Eye size={14} /> View Site
          </a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        {/* Vehicle stats - commented out to show only bookings
        {view === 'vehicles' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={<LayoutDashboard size={20} className="text-slate-400" />} label="Total Listings" value={counts.all} color="bg-white/5" />
            <StatCard icon={<Car size={20} className="text-dynamic-orange" />} label="Cars" value={counts.car} color="bg-dynamic-orange/10" />
            <StatCard icon={<Bike size={20} className="text-steel-blue" />} label="Bikes" value={counts.bike} color="bg-steel-blue/10" />
          </div>
        )}
        */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard icon={<Bookmark size={20} className="text-dynamic-orange" />} label="Total Bookings" value={bookingCounts.all} color="bg-dynamic-orange/10" />
            <StatCard icon={<CheckCircle2 size={20} className="text-green-400" />} label="Finished" value={bookingCounts.finished} color="bg-green-500/10" />
            <StatCard icon={<Circle size={20} className="text-red-400" />} label="Unfinished" value={bookingCounts.unfinished} color="bg-red-500/10" />
            <StatCard icon={<Navigation size={20} className="text-steel-blue" />} label="One Way" value={bookings.filter(b => b.trip_type === 'one-way').length} color="bg-steel-blue/10" />
            <StatCard icon={<RefreshCw size={20} className="text-purple-400" />} label="Round Trip" value={bookings.filter(b => b.trip_type === 'round-trip').length} color="bg-purple-500/10" />
          </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs for Vehicles Only - commented out to show only bookings
          {view === 'vehicles' && (
            <div className="flex bg-[#1e2f42] border border-white/[0.07] rounded-xl p-1 gap-1">
              {(['all', 'car', 'bike'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer border-none
                    ${tab === t ? 'bg-dynamic-orange text-white shadow-sm' : 'bg-transparent text-slate-400 hover:text-white'}`}
                >
                  {t === 'car' && <Car size={13} />}
                  {t === 'bike' && <Bike size={13} />}
                  {t === 'all' ? 'All' : t === 'car' ? 'Cars' : 'Bikes'}
                  <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full font-black ${tab === t ? 'bg-white/20' : 'bg-white/5'}`}>
                    {counts[t]}
                  </span>
                </button>
              ))}
            </div>
          )}
          */}

          {/* Booking Status Filter */}
          <div className="flex bg-[#1e2f42] border border-white/[0.07] rounded-xl p-1 gap-1">
            {(['all', 'finished', 'unfinished'] as BookingFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setBookingFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer border-none
                  ${bookingFilter === f
                    ? f === 'finished' ? 'bg-green-500 text-white shadow-sm'
                    : f === 'unfinished' ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-dynamic-orange text-white shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-white'}`}
              >
                {f === 'finished' && <CheckCircle2 size={13} />}
                {f === 'unfinished' && <Circle size={13} />}
                {f === 'all' && <Filter size={13} />}
                {f === 'all' ? 'All' : f === 'finished' ? 'Finished' : 'Unfinished'}
                <span className={`text-[0.65rem] px-1.5 py-0.5 rounded-full font-black ${bookingFilter === f ? 'bg-white/20' : 'bg-white/5'}`}>
                  {bookingCounts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-[#1e2f42] border border-white/[0.07] rounded-xl px-3 py-2 min-w-[200px] focus-within:border-dynamic-orange/40 transition-colors">
            <Search size={15} className="text-slate-500 shrink-0" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={`Search ${view}…`}
              className="flex-1 bg-transparent border-none text-sm text-slate-200 outline-none placeholder:text-slate-600"
            />
            {searchInput && <button onClick={() => { setSearchInput(''); setSearch(''); }} className="bg-transparent border-none text-slate-500 hover:text-white cursor-pointer flex"><X size={13} /></button>}
          </div>

          <button onClick={() => fetchData()} className="p-2.5 rounded-xl bg-white/5 border border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Add Button - Vehicles Only - commented out to show only bookings
          {view === 'vehicles' && (
            <button
              onClick={() => { setEditVehicle(null); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-dynamic-orange to-amber-500 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none shadow-[0_4px_15px_rgba(255,107,53,0.3)]"
            >
              <Plus size={17} strokeWidth={2.5} />
              Add Listing
            </button>
          )}
          */}
        </div>

        {/* Table Area */}
        <div className="bg-[#162030] border border-white/[0.07] rounded-2xl overflow-hidden">

          {/* VEHICLES TABLE - disabled to show only bookings */}
          {false && view === 'vehicles' && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                      <th className="text-left px-4 py-3 w-[180px]">Vehicle</th>
                      <th className="text-left px-4 py-3">Brand</th>
                      <th className="text-left px-4 py-3">Type</th>
                      <th className="text-left px-4 py-3">Price</th>
                      <th className="text-left px-4 py-3">Year</th>
                      <th className="text-left px-4 py-3">KM</th>
                      <th className="text-left px-4 py-3">Fuel</th>
                      <th className="text-left px-4 py-3">Tag</th>
                      <th className="text-left px-4 py-3">Location</th>
                      <th className="text-left px-4 py-3">Seller</th>
                      <th className="text-left px-4 py-3">Contact</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={12} className="text-center py-20">
                          <div className="flex items-center justify-center gap-3 text-slate-500">
                            <RefreshCw size={20} className="animate-spin" />
                            <span className="text-sm">Loading listings…</span>
                          </div>
                        </td>
                      </tr>
                    ) : displayedVehicles.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="text-center py-20">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                              <Car size={28} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 text-sm">
                              {search ? `No results for "${search}"` : 'No listings yet. Add your first one!'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      displayedVehicles.map((v, idx) => {
                        const vType = (v.type || '').toLowerCase();
                        const isCar = vType === 'car';
                        const c = typeColor(isCar ? 'car' : 'bike');
                        const thumb = v.images?.[0] ?? (v as any).image_url ?? null;
                        const vName = v.name || (v as any).title || 'Untitled';
                        return (
                          <tr
                            key={v.id}
                            className={`hover:bg-white/[0.02] transition-colors ${idx !== displayedVehicles.length - 1 ? 'border-b border-white/[0.05]' : ''
                              }`}
                          >
                            {/* Vehicle image + name */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-12 h-9 rounded-lg overflow-hidden bg-white/5 shrink-0 flex items-center justify-center">
                                  {thumb
                                    ? <img src={thumb} alt={vName} className="w-full h-full object-cover" />
                                    : <ImageIcon size={14} className="text-slate-600" />
                                  }
                                </div>
                                <p className="text-white font-bold text-xs truncate max-w-[100px]" title={vName}>{vName}</p>
                              </div>
                            </td>
                            {/* Brand */}
                            <td className="px-4 py-3 text-slate-300 text-sm">{v.brand || <span className="text-slate-600 italic">—</span>}</td>
                            {/* Type */}
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                                {isCar ? <Car size={10} /> : <Bike size={10} />}
                                {isCar ? 'Car' : 'Bike'}
                              </span>
                            </td>
                            {/* Price */}
                            <td className="px-4 py-3">
                              <span className="text-dynamic-orange font-bold text-sm whitespace-nowrap">{v.price_label || formatPrice(v.price)}</span>
                            </td>
                            {/* Year */}
                            <td className="px-4 py-3 text-slate-300 text-sm">{v.year || <span className="text-slate-600 italic">—</span>}</td>
                            {/* KM */}
                            <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">{v.km || <span className="text-slate-600 italic">—</span>}</td>
                            {/* Fuel */}
                            <td className="px-4 py-3 text-slate-300 text-sm">{v.fuel || <span className="text-slate-600 italic">—</span>}</td>
                            {/* Tag */}
                            <td className="px-4 py-3">
                              {v.tag
                                ? <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 whitespace-nowrap">{v.tag}</span>
                                : <span className="text-slate-600 italic text-sm">—</span>
                              }
                            </td>
                            {/* Location */}
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-1 text-slate-300 text-sm whitespace-nowrap">
                                <MapPin size={11} strokeWidth={1.75} className="text-slate-500" />
                                {v.location || <span className="text-slate-600 italic">—</span>}
                              </span>
                            </td>
                            {/* Seller */}
                            <td className="px-4 py-3 text-slate-300 text-sm">{v.seller || <span className="text-slate-600 italic">—</span>}</td>
                            {/* Contact */}
                            <td className="px-4 py-3">
                              <a href={`tel:${v.contact}`} className="text-dynamic-orange font-semibold text-sm hover:underline whitespace-nowrap no-underline">
                                {v.contact || <span className="text-slate-600 italic not-italic">—</span>}
                              </a>
                            </td>
                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => { setEditVehicle(v); setShowForm(true); }}
                                  className="w-8 h-8 rounded-lg bg-steel-blue/10 border border-steel-blue/20 flex items-center justify-center text-steel-blue hover:bg-steel-blue/20 transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Pencil size={13} strokeWidth={2} />
                                </button>
                                <button
                                  onClick={() => setDeleteVehicleTarget(v)}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={13} strokeWidth={2} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* BOOKINGS TABLE */}

          {view === 'bookings' && (
            <>
              <div className="grid grid-cols-[auto_1.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/[0.07] text-[0.68rem] font-bold uppercase tracking-widest text-slate-500">
                <span>Status</span>
                <span>Trip Details</span>
                <span>Locations</span>
                <span>Date & Time</span>
                <span>Fare Info</span>
                <span>Contact</span>
                <span>Actions</span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
                  <RefreshCw size={20} className="animate-spin" />
                  <span className="text-sm">Loading bookings…</span>
                </div>
              ) : displayedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Bookmark size={28} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm">
                    {search ? `No results for "${search}"` : 'No bookings yet.'}
                  </p>
                </div>
              ) : (
                displayedBookings.map((b, idx) => {
                  return (
                    <div
                      key={b.id}
                      className={`grid grid-cols-[auto_1.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors
                        ${idx !== displayedBookings.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
                    >
                      {/* Status Toggle */}
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => toggleFinished(b)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border
                            ${b.finished
                              ? 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25'
                              : 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25'}`}
                          title={b.finished ? 'Mark as Unfinished' : 'Mark as Finished'}
                        >
                          {b.finished ? <CheckCircle2 size={15} strokeWidth={2.5} /> : <Circle size={15} strokeWidth={2} />}
                        </button>
                      </div>

                      {/* Trip Details */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{b.car_model || 'Unknown Car'}</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded-full border
                            ${b.trip_type === 'round-trip' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-steel-blue/10 text-steel-blue border-steel-blue/20'}`}>
                            {b.trip_type === 'round-trip' ? <RefreshCw size={10} /> : <Navigation size={10} />}
                            {b.trip_type === 'round-trip' ? 'Round Trip' : 'One Way'}
                          </span>
                          <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full border
                            ${b.finished ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {b.finished ? 'Finished' : 'Unfinished'}
                          </span>
                        </div>
                      </div>

                      {/* Locations */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="flex items-start gap-1.5 text-slate-300 text-[0.8rem] leading-tight">
                          <span className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0" />
                          <span className="truncate" title={b.pickup_location}>{b.pickup_location}</span>
                        </span>
                        <span className="flex items-start gap-1.5 text-slate-300 text-[0.8rem] leading-tight">
                          <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
                          <span className="truncate" title={b.drop_location}>{b.drop_location}</span>
                        </span>
                      </div>

                      {/* Date & Time */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-300 text-xs flex items-center gap-1"><CalendarDays size={12} /> {new Date(b.pickup_date).toLocaleDateString()}</span>
                        {b.return_date && b.trip_type === 'round-trip' && (
                          <span className="text-slate-500 text-xs flex items-center gap-1"><RefreshCw size={12} /> {new Date(b.return_date).toLocaleDateString()}</span>
                        )}
                        {b.pickup_time && b.trip_type === 'one-way' && (
                          <span className="text-slate-500 text-xs flex items-center gap-1"><Clock3 size={12} /> {b.pickup_time}</span>
                        )}
                      </div>

                      {/* Fare Info */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-dynamic-orange font-bold text-sm">{b.total_rate ? formatPrice(b.total_rate) : 'TBD'}</span>
                        <span className="text-slate-500 text-xs">{b.distance_km ? `${b.distance_km} km` : 'N/A'}</span>
                      </div>

                      {/* Contact & Created */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="text-white font-semibold text-sm flex items-start gap-1.5 leading-tight">
                          <User size={13} className="mt-[2px] shrink-0 text-slate-400" />
                          <span className="truncate" title={b.customer_name || 'N/A'}>{b.customer_name || 'N/A'}</span>
                        </div>
                        <div className="text-slate-400 text-xs flex items-center gap-1.5">
                          <Phone size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate">{b.contact || 'N/A'}</span>
                        </div>
                        <div className="text-slate-500 text-[0.65rem] flex items-center gap-1.5">
                          <Clock3 size={10} className="shrink-0" />
                          <span className="truncate">{new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} {new Date(b.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setViewBooking(b)}
                          className="w-8 h-8 rounded-lg bg-dynamic-orange/10 border border-dynamic-orange/20 flex items-center justify-center text-dynamic-orange hover:bg-dynamic-orange/20 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={13} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => setDeleteBookingTarget(b)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete Booking"
                        >
                          <Trash2 size={13} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

        </div>

        <p className="text-slate-600 text-xs text-right">
          Showing {displayedBookings.length} of {bookings.length} records
        </p>
      </div>

      {/* Modals */}
      {/* Vehicle modals - disabled to show only bookings */}
      {false && showForm && (
        <VehicleFormModal
          vehicle={editVehicle}
          onClose={() => setShowForm(false)}
          onSaved={fetchData}
        />
      )}
      {false && deleteVehicleTarget && (
        <DeleteModal
          title="Delete Listing?"
          message={<><span className="text-white font-semibold">{deleteVehicleTarget?.name}</span> will be permanently removed.</>}
          onConfirm={handleVehicleDelete}
          onCancel={() => setDeleteVehicleTarget(null)}
          loading={deleting}
        />
      )}
      {deleteBookingTarget && (
        <DeleteModal
          title="Delete Booking?"
          message={<>Booking for <span className="text-white font-semibold">{deleteBookingTarget.car_model}</span> will be permanently removed.</>}
          onConfirm={handleBookingDelete}
          onCancel={() => setDeleteBookingTarget(null)}
          loading={deleting}
        />
      )}

      {/* Booking Detail Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setViewBooking(null)}>
          <div onClick={e => e.stopPropagation()} className="relative w-full max-w-lg bg-[#162030] border border-white/[0.08] rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dynamic-orange/10 flex items-center justify-center">
                  <Bookmark size={18} className="text-dynamic-orange" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">Booking Details</h2>
                  <p className="text-slate-500 text-xs mt-0.5">ID: {String(viewBooking.id || '').split('-')[0]?.toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setViewBooking(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border-none">
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Trip Type Badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border
                  ${viewBooking.trip_type === 'round-trip' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-steel-blue/10 text-steel-blue border-steel-blue/20'}`}>
                  {viewBooking.trip_type === 'round-trip' ? <RefreshCw size={12} /> : <Navigation size={12} />}
                  {viewBooking.trip_type === 'round-trip' ? 'Round Trip' : 'One Way'}
                </span>
                <span className="text-slate-600 text-[0.65rem] uppercase tracking-wider">{new Date(viewBooking.created_at).toLocaleString()}</span>
              </div>

              {/* Route */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-500/30" />
                    <div className="w-[2px] h-8 bg-gradient-to-b from-green-500/50 to-red-500/50 rounded-full" />
                    <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-500/30" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div>
                      <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Pickup</p>
                      <p className="text-white text-sm font-semibold leading-snug">{viewBooking.pickup_location}</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Drop</p>
                      <p className="text-white text-sm font-semibold leading-snug">{viewBooking.drop_location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Car size={13} className="text-dynamic-orange" />
                    <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Car Model</span>
                  </div>
                  <p className="text-white font-bold text-sm">{viewBooking.car_model}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <User size={13} className="text-dynamic-orange" />
                    <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Customer Details</span>
                  </div>
                  <p className="text-white font-bold text-sm mb-1">{viewBooking.customer_name || 'N/A'}</p>
                  <a href={`tel:${viewBooking.contact}`} className="text-dynamic-orange font-bold text-sm no-underline hover:underline flex items-center gap-1"><Phone size={12} /> {viewBooking.contact || 'N/A'}</a>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CalendarDays size={13} className="text-dynamic-orange" />
                    <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Pickup Date</span>
                  </div>
                  <p className="text-white font-bold text-sm">{new Date(viewBooking.pickup_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                {viewBooking.return_date && viewBooking.trip_type === 'round-trip' ? (
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CalendarDays size={13} className="text-purple-400" />
                      <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Return Date</span>
                    </div>
                    <p className="text-white font-bold text-sm">{new Date(viewBooking.return_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                ) : (
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Clock3 size={13} className="text-dynamic-orange" />
                      <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Pickup Time</span>
                    </div>
                    <p className="text-white font-bold text-sm">{viewBooking.pickup_time || 'Not specified'}</p>
                  </div>
                )}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Navigation size={13} className="text-dynamic-orange" />
                    <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Distance</span>
                  </div>
                  <p className="text-white font-bold text-sm">{viewBooking.distance_km ? `${viewBooking.distance_km} km` : 'N/A'}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Wallet size={13} className="text-dynamic-orange" />
                    <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">Total Rate</span>
                  </div>
                  <p className="text-dynamic-orange font-black text-lg">{viewBooking.total_rate ? formatPrice(viewBooking.total_rate) : 'TBD'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3">
              <a
                href={`tel:${viewBooking.contact}`}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-dynamic-orange to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer border-none no-underline"
              >
                <Phone size={15} /> Call Customer
              </a>
              <button
                onClick={() => setViewBooking(null)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors font-semibold text-sm cursor-pointer bg-transparent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
