'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { auth, Tour, Booking } from '@/lib/api';

interface OperatorData {
  operator: { company_name: string; subscription_plan: string };
  tours: Tour[];
  bookings: Booking[];
  reviews: Array<{ id: number }>;
  earnings: number;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

export default function Operator() {
  const [d, setD] = useState<OperatorData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const a = auth();
    if (!a) { window.location.href = '/auth/login'; return; }
    if (a.user.role !== 'operator') { window.location.href = '/dashboard/traveler'; return; }

    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/dashboard/operator', {
      headers: { Authorization: `Bearer ${a.token}` },
    })
      .then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(setD)
      .catch(() => setError('Could not load dashboard. Please try again.'));
  }, []);

  if (error) return (
    <DashboardShell role="Operator">
      <div className="card p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Retry</button>
      </div>
    </DashboardShell>
  );

  if (!d) return (
    <DashboardShell role="Operator">
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-100" />)}
        </div>
      </div>
    </DashboardShell>
  );

  return (
    <DashboardShell role="Operator">
      <h1 className="text-4xl font-black">Operator Dashboard</h1>
      <p className="mt-1 text-slate-500">{d.operator.company_name} · {d.operator.subscription_plan} plan</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Tours" value={d.tours.length} />
        <Stat label="Bookings" value={d.bookings.length} />
        <Stat label="Reviews" value={d.reviews.length} />
        <Stat label="Earnings" value={`$${Math.round(d.earnings).toLocaleString()}`} />
      </div>

      <h2 className="mt-8 text-2xl font-black">Your Tours</h2>
      {d.tours.length === 0 ? (
        <p className="mt-2 text-slate-500">No tours yet. Add your first tour to get started.</p>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {d.tours.slice(0, 10).map((t) => (
            <div key={t.id} className="card p-4">
              <b>{t.title}</b>
              <p className="mt-1 text-sm text-slate-500">${t.price} · {t.rating} ★</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 text-2xl font-black">Bookings</h2>
      {d.bookings.length === 0 ? (
        <p className="mt-2 text-slate-500">No bookings yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {d.bookings.map((b) => (
            <div key={b.id} className="card flex items-center justify-between p-4">
              <span>Booking #{b.id}</span>
              <span className="badge">{b.status}</span>
              <span className="font-black">${b.total_amount}</span>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}