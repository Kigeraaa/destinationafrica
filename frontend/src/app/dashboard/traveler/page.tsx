'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { auth, Booking, Message } from '@/lib/api';

interface TravelerData {
  bookings: Booking[];
  wishlist: Array<{ id: number }>;
  payments: Array<{ id: number }>;
  messages: Message[];
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

export default function Traveler() {
  const [d, setD] = useState<TravelerData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const a = auth();
    if (!a) { window.location.href = '/auth/login'; return; }

    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/dashboard/traveler', {
      headers: { Authorization: `Bearer ${a.token}` },
    })
      .then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(setD)
      .catch(() => setError('Could not load dashboard. Please try again.'));
  }, []);

  if (error) return (
    <DashboardShell role="Traveler">
      <div className="card p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Retry</button>
      </div>
    </DashboardShell>
  );

  if (!d) return (
    <DashboardShell role="Traveler">
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-100" />)}
        </div>
      </div>
    </DashboardShell>
  );

  return (
    <DashboardShell role="Traveler">
      <h1 className="text-4xl font-black">My Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Bookings" value={d.bookings.length} />
        <Stat label="Wishlist" value={d.wishlist.length} />
        <Stat label="Payments" value={d.payments.length} />
        <Stat label="Messages" value={d.messages.length} />
      </div>

      <h2 className="mt-8 text-2xl font-black">My Bookings</h2>
      {d.bookings.length === 0 ? (
        <div className="card mt-3 p-8 text-center">
          <p className="text-slate-500">You haven't booked any tours yet.</p>
          <a href="/tours" className="btn btn-primary mt-4 inline-block">Browse Tours</a>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {d.bookings.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex items-center justify-between">
                <b>{b.tour?.title || `Booking #${b.id}`}</b>
                <span className="badge">{b.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">${b.total_amount} · {b.travel_date}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 text-2xl font-black">Messages</h2>
      {d.messages.length === 0 ? (
        <p className="mt-2 text-slate-500">No messages yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {d.messages.map((m) => (
            <div key={m.id} className="card p-4 text-sm">{m.body}</div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}