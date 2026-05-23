'use client';
import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { auth } from '@/lib/api';

interface AdminStats {
  totals: {
    users: number;
    operators: number;
    tours: number;
    bookings: number;
    gmv: number;
    admin_commission: number;
    pending_operators: number;
    approved_operators: number;
  };
  recent_bookings: Array<{ id: number; total_amount: number; status: string }>;
  payments: Array<{ reference: string; provider: string; amount: number; admin_commission: number }>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

export default function Admin() {
  const [d, setD] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const a = auth();
    if (!a) { window.location.href = '/auth/login'; return; }
    if (a.user.role !== 'admin') { window.location.href = '/dashboard/traveler'; return; }

    fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/dashboard/admin', {
      headers: { Authorization: `Bearer ${a.token}` },
    })
      .then((r) => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then(setD)
      .catch(() => setError('Could not load dashboard. Please try again.'));
  }, []);

  if (error) return (
    <DashboardShell role="Admin">
      <div className="card p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Retry</button>
      </div>
    </DashboardShell>
  );

  if (!d) return (
    <DashboardShell role="Admin">
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-100" />)}
        </div>
      </div>
    </DashboardShell>
  );

  const t = d.totals;
  return (
    <DashboardShell role="Admin">
      <h1 className="text-4xl font-black">Admin Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Users" value={t.users} />
        <Stat label="Operators" value={t.operators} />
        <Stat label="Tours" value={t.tours} />
        <Stat label="Bookings" value={t.bookings} />
        <Stat label="GMV" value={`$${Math.round(t.gmv).toLocaleString()}`} />
        <Stat label="Commission" value={`$${Math.round(t.admin_commission).toLocaleString()}`} />
        <Stat label="Pending Operators" value={t.pending_operators} />
        <Stat label="Approved Operators" value={t.approved_operators} />
      </div>

      <h2 className="mt-8 text-2xl font-black">Recent Bookings</h2>
      {d.recent_bookings.length === 0 ? (
        <p className="mt-2 text-slate-500">No bookings yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {d.recent_bookings.map((b) => (
            <div key={b.id} className="card flex items-center justify-between p-4">
              <span className="font-semibold">Booking #{b.id}</span>
              <span className="badge">{b.status}</span>
              <span className="font-black">${b.total_amount}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 text-2xl font-black">Payment Logs</h2>
      {d.payments.length === 0 ? (
        <p className="mt-2 text-slate-500">No payments yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {d.payments.map((p, i) => (
            <div key={i} className="card flex flex-wrap items-center justify-between gap-2 p-4">
              <span className="font-mono text-sm">{p.reference}</span>
              <span className="badge">{p.provider}</span>
              <span>Amount: <b>${p.amount}</b></span>
              <span className="text-sm text-slate-500">Commission: ${p.admin_commission}</span>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}