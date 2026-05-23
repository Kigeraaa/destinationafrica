import Link from 'next/link';
import {Header} from '@/components/Header';
import {TourCard} from '@/components/TourCard';

async function getData() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const [t, c, g] = await Promise.all([
      fetch(API + '/tours?limit=12', { cache: 'no-store' }).then(r => r.ok ? r.json() : { items: [] }),
      fetch(API + '/countries', { cache: 'no-store' }).then(r => r.ok ? r.json() : []),
      fetch(API + '/guides?limit=6', { cache: 'no-store' }).then(r => r.ok ? r.json() : []),
    ]);
    return {
      tours: t.items || [],
      countries: Array.isArray(c) ? c.slice(0, 12) : (c?.items ? c.items.slice(0, 12) : []),
      guides: Array.isArray(g) ? g : (g?.items || []),
    };
  } catch {
    return { tours: [], countries: [], guides: [] };
  }
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=60';

export default async function Home() {
  const d = await getData();
  return (
    <>
      <Header/>
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="section grid gap-10 py-20 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">Verified African tour operators</span>
            <h1 className="mt-6 text-5xl font-black md:text-7xl">Book Africa&apos;s best travel experiences.</h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">Safaris, beaches, culture, food, cities, gorilla trekking and luxury escapes from verified African operators.</p>
            <form action="/tours" className="mt-8 grid gap-3 rounded-3xl bg-white p-3 md:grid-cols-4">
              <input name="q" className="input md:col-span-2" placeholder="Search safari, beach, city..."/>
              <select name="country" className="input">
                <option value="">Country</option>
                {d.countries.map((c: any) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
              <button className="btn-primary">Search</button>
            </form>
          </div>
          <img className="h-[480px] w-full rounded-[2rem] object-cover shadow-2xl" src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80" alt="Safari"/>
        </div>
      </section>

      {d.countries.length > 0 && (
        <section className="section">
          <h2 className="text-3xl font-black">Featured countries</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.countries.map((c: any) => (
              <Link key={c.id} href={`/destinations/${c.slug}`} className="card overflow-hidden">
                <img src={c.image_url || FALLBACK_IMG} alt={c.name} className="h-36 w-full object-cover"/>
                <div className="p-4 font-black">{c.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {d.tours.length > 0 && (
        <section className="section">
          <h2 className="text-3xl font-black">Featured experiences</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {d.tours.map((t: any) => <TourCard key={t.id} tour={t}/>)}
          </div>
        </section>
      )}

      <section className="section">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6"><h3 className="font-black">1. Discover</h3><p>Search countries, destinations and categories.</p></div>
          <div className="card p-6"><h3 className="font-black">2. Chat &amp; Book</h3><p>Message verified operators and reserve securely.</p></div>
          <div className="card p-6"><h3 className="font-black">3. Travel</h3><p>Enjoy Africa with trusted local experts.</p></div>
        </div>
      </section>

      {d.guides.length > 0 && (
        <section className="section">
          <h2 className="text-3xl font-black">Travel guides</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {d.guides.map((g: any) => (
              <Link key={g.id} href={`/guides/${g.slug}`} className="card overflow-hidden">
                <img src={g.image_url || FALLBACK_IMG} alt={g.title} className="h-40 w-full object-cover"/>
                <div className="p-5">
                  <h3 className="font-black">{g.title}</h3>
                  <p className="text-sm text-slate-500">{g.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="bg-forest p-10 text-white">
        <div className="mx-auto max-w-7xl">
          <b>Destination Africa</b>
          <p className="text-white/70">Connecting the world to African experiences.</p>
        </div>
      </footer>
    </>
  );
}