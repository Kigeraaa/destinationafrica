import Link from 'next/link';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { TourCard } from '@/components/TourCard';
import { Tour, Country, Guide } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Destination Africa — Book Africa\'s Best Travel Experiences',
};

const FALLBACK = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=60';

async function getData() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const [t, c, g] = await Promise.all([
      fetch(API + '/tours?limit=12', { cache: 'no-store' }).then((r) => r.ok ? r.json() : { items: [] }),
      fetch(API + '/countries', { cache: 'no-store' }).then((r) => r.ok ? r.json() : []),
      fetch(API + '/guides?limit=6', { cache: 'no-store' }).then((r) => r.ok ? r.json() : []),
    ]);
    return {
      tours: (t.items || []) as Tour[],
      countries: (Array.isArray(c) ? c.slice(0, 12) : []) as Country[],
      guides: (Array.isArray(g) ? g : []) as Guide[],
      error: false,
    };
  } catch {
    return { tours: [], countries: [], guides: [], error: true };
  }
}

export default async function Home() {
  const d = await getData();

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="section grid gap-10 py-20 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">Verified African tour operators</span>
            <h1 className="mt-6 text-5xl font-black md:text-7xl">Book Africa's best travel experiences.</h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Safaris, beaches, culture, food, cities, gorilla trekking and luxury escapes from verified African operators.
            </p>
            <form action="/tours" className="mt-8 grid gap-3 rounded-3xl bg-white p-3 md:grid-cols-4">
              <input name="q" className="input md:col-span-2" placeholder="Search safari, beach, city…" />
              <select name="country" className="input">
                <option value="">Country</option>
                {d.countries.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
              <button className="btn btn-primary">Search</button>
            </form>
          </div>
          <img
            className="h-[480px] w-full rounded-[2rem] object-cover shadow-2xl"
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
            alt="Africa travel"
          />
        </div>
      </section>

      {/* Server error banner */}
      {d.error && (
        <div className="section">
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
            Some content could not be loaded. The backend may be starting up — please refresh in a moment.
          </div>
        </div>
      )}

      {/* Countries */}
      {d.countries.length > 0 && (
        <section className="section">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">Featured countries</h2>
            <Link href="/destinations" className="text-sm font-bold text-forest hover:underline">View all →</Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.countries.map((c) => (
              <Link key={c.id} href={`/destinations/${c.slug}`} className="card overflow-hidden transition hover:shadow-md">
                <img
                  src={c.image_url || FALLBACK}
                  alt={c.name}
                  className="h-36 w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                />
                <div className="p-4 font-black">{c.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tours */}
      {d.tours.length > 0 && (
        <section className="section">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">Featured experiences</h2>
            <Link href="/tours" className="text-sm font-bold text-forest hover:underline">View all →</Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {d.tours.map((t) => <TourCard key={t.id} tour={t} />)}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="section">
        <h2 className="text-3xl font-black">How it works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <span className="text-2xl font-black text-savanna">1.</span>
            <h3 className="mt-2 font-black">Discover</h3>
            <p className="mt-1 text-slate-500">Search countries, destinations and categories to find your perfect experience.</p>
          </div>
          <div className="card p-6">
            <span className="text-2xl font-black text-savanna">2.</span>
            <h3 className="mt-2 font-black">Chat & Book</h3>
            <p className="mt-1 text-slate-500">Message verified operators and reserve securely through our platform.</p>
          </div>
          <div className="card p-6">
            <span className="text-2xl font-black text-savanna">3.</span>
            <h3 className="mt-2 font-black">Travel</h3>
            <p className="mt-1 text-slate-500">Enjoy Africa with trusted local experts who know the land.</p>
          </div>
        </div>
      </section>

      {/* Guides */}
      {d.guides.length > 0 && (
        <section className="section">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">Travel guides</h2>
            <Link href="/guides" className="text-sm font-bold text-forest hover:underline">View all →</Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {d.guides.map((g) => (
              <Link key={g.id} href={`/guides/${g.slug}`} className="card overflow-hidden transition hover:shadow-md">
                <img
                  src={g.image_url || FALLBACK}
                  alt={g.title}
                  className="h-40 w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                />
                <div className="p-5">
                  <h3 className="font-black">{g.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{g.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="bg-forest p-10 text-white">
        <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">
          <div>
            <b className="text-lg">Destination Africa</b>
            <p className="mt-2 text-white/70">Connecting the world to African experiences.</p>
          </div>
          <div>
            <b className="text-sm uppercase tracking-wide text-white/50">Explore</b>
            <div className="mt-2 space-y-1">
              <Link href="/tours" className="block text-sm text-white/80 hover:text-white">Tours</Link>
              <Link href="/destinations" className="block text-sm text-white/80 hover:text-white">Destinations</Link>
              <Link href="/guides" className="block text-sm text-white/80 hover:text-white">Travel Guides</Link>
            </div>
          </div>
          <div>
            <b className="text-sm uppercase tracking-wide text-white/50">Account</b>
            <div className="mt-2 space-y-1">
              <Link href="/auth/login" className="block text-sm text-white/80 hover:text-white">Login</Link>
              <Link href="/auth/register" className="block text-sm text-white/80 hover:text-white">Register</Link>
              <Link href="/auth/register?role=operator" className="block text-sm text-white/80 hover:text-white">List your tours</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}