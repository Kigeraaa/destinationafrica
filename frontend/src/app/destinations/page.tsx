import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Country } from '@/lib/api';

export const metadata: Metadata = {
  title: 'African Destinations | Destination Africa',
  description: 'Explore countries across Africa. Find tours, guides and local operators.',
};

const FALLBACK = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=60';

export default async function Destinations() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let countries: Country[] = [];
  let fetchError = false;
  try {
    const r = await fetch(API + '/countries', { cache: 'no-store' });
    if (r.ok) countries = await r.json();
  } catch { fetchError = true; }

  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black">African Destinations</h1>
        <p className="mt-2 text-slate-500">Explore countries, discover experiences and find local operators.</p>

        {fetchError ? (
          <div className="card mt-8 p-12 text-center">
            <p className="text-slate-500">Could not load destinations. Please try again later.</p>
          </div>
        ) : countries.length === 0 ? (
          <div className="card mt-8 p-12 text-center">
            <p className="text-slate-500">No destinations available yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {countries.map((c) => (
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
        )}
      </main>
    </>
  );
}