'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { api, auth, Tour } from '@/lib/api';
import { ShieldCheck, Star, Calendar, Users } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80';

interface TourDetailData {
  tour: Tour;
  operator: { company_name: string; description: string };
}

export default function TourDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [data, setData] = useState<TourDetailData | null>(null);
  const [error, setError] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.get<TourDetailData>('/tours/' + slug)
      .then((d) => { setData(d); setSelectedDate(d.tour.availability?.[0] || ''); })
      .catch(() => setError('Tour not found or unavailable.'));
  }, [slug]);

  async function book() {
    const a = auth();
    if (!a) { window.location.href = '/auth/login'; return; }
    if (!data) return;
    setBooking(true);
    try {
      const res = await api.post<{ payment: { reference: string } }>(
        '/bookings',
        { tour_id: data.tour.id, travel_date: selectedDate, guests: parseInt(guests), provider: 'Stripe' },
        a.token
      );
      setBookingMsg('Booking confirmed! Reference: ' + res.payment.reference);
    } catch {
      setBookingMsg('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  }

  if (error) return (
    <>
      <Header />
      <div className="section">
        <div className="card p-12 text-center">
          <p className="text-slate-500">{error}</p>
          <a href="/tours" className="btn btn-primary mt-4 inline-block">Browse Tours</a>
        </div>
      </div>
    </>
  );

  if (!data) return (
    <>
      <Header />
      <div className="section grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[420px] animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    </>
  );

  const t = data.tour;
  return (
    <>
      <Header />
      <main className="section grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <img
            src={t.image_url || FALLBACK}
            alt={t.title}
            className="h-[420px] w-full rounded-3xl object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {t.country?.name && <span className="badge">{t.country.name}</span>}
            {t.category?.name && <span className="badge">{t.category.name}</span>}
          </div>
          <h1 className="mt-4 text-4xl font-black">{t.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Calendar size={15} />{t.duration_days} days</span>
            <span className="flex items-center gap-1"><Users size={15} />Up to {t.group_size} guests</span>
            <span className="flex items-center gap-1"><Star size={15} className="fill-savanna text-savanna" />{t.rating} ({t.review_count} reviews)</span>
            <span className="flex items-center gap-1"><ShieldCheck size={15} className="text-forest" />{data.operator.company_name}</span>
          </div>
          <p className="mt-5 leading-8 text-slate-700">{t.description}</p>

          {t.itinerary?.length > 0 && (
            <>
              <h2 className="mt-8 text-2xl font-black">Itinerary</h2>
              <ul className="mt-3 space-y-2">
                {t.itinerary.map((x, i) => (
                  <li key={i} className="card flex gap-4 p-4">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-forest text-xs font-black text-white">{i + 1}</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="mt-8 text-2xl font-black">About the operator</h2>
          <div className="card mt-3 p-5">
            <b className="text-lg">{data.operator.company_name}</b>
            <p className="mt-2 text-slate-600">{data.operator.description}</p>
            <button
              onClick={() => alert('Message sent. Check your dashboard messages.')}
              className="btn btn-primary mt-4"
            >
              Message Operator
            </button>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <p className="text-sm text-slate-500">From</p>
          <p className="text-4xl font-black">${t.price}</p>
          <p className="text-sm text-slate-500">per person</p>

          {t.availability?.length > 0 && (
            <>
              <label className="mt-5 block text-sm font-semibold">Travel date</label>
              <select
                className="input mt-1"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {t.availability.map((d) => <option key={d}>{d}</option>)}
              </select>
            </>
          )}

          <label className="mt-3 block text-sm font-semibold">Guests</label>
          <input
            className="input mt-1"
            type="number"
            min="1"
            max={t.group_size}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>${t.price} × {guests} guests</span>
              <span className="font-bold">${t.price * parseInt(guests || '1')}</span>
            </div>
          </div>

          <button onClick={book} disabled={booking} className="btn btn-primary mt-4 w-full">
            {booking ? 'Processing…' : 'Book Now'}
          </button>

          {bookingMsg && (
            <p className={`mt-3 rounded-2xl p-3 text-sm ${bookingMsg.includes('confirmed') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {bookingMsg}
            </p>
          )}
          <p className="mt-3 text-center text-xs text-slate-400">No payment charged until confirmed</p>
        </aside>
      </main>
    </>
  );
}