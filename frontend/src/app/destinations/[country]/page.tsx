import Link from 'next/link';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { TourCard } from '@/components/TourCard';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ country: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const d = await fetch(API + '/countries/' + country, { cache: 'no-store' }).then((r) => r.json());
    return { title: `${d.country.name} Tours & Travel | Destination Africa`, description: `Discover tours, destinations and travel guides for ${d.country.name}.` };
  } catch {
    return { title: 'Destination | Destination Africa' };
  }
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let d: any = null;
  try {
    const r = await fetch(API + '/countries/' + country, { cache: 'no-store' });
    if (r.ok) d = await r.json();
  } catch {}
  if (!d) return notFound();

  const FALLBACK = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=60';

  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-5xl font-black">{d.country.name}</h1>
        <p className="mt-2 text-slate-600">Popular destinations, guides and verified operators.</p>

        {d.destinations?.length > 0 && (
          <>
            <h2 className="mt-8 text-2xl font-black">Popular destinations</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {d.destinations.map((x: any) => (
                <div key={x.id} className="card overflow-hidden">
                  <img
                    src={x.image_url || FALLBACK}
                    alt={x.name}
                    className="h-32 w-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                  />
                  <p className="p-4 font-bold">{x.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {d.tours?.length > 0 && (
          <>
            <h2 className="mt-8 text-2xl font-black">Tours in {d.country.name}</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              {d.tours.map((t: any) => <TourCard key={t.id} tour={t} />)}
            </div>
          </>
        )}

        {d.tours?.length === 0 && d.destinations?.length === 0 && (
          <div className="card mt-8 p-12 text-center">
            <p className="text-slate-500">No tours available for this destination yet.</p>
            <a href="/tours" className="btn btn-primary mt-4 inline-block">Browse all tours</a>
          </div>
        )}

        {d.guides?.length > 0 && (
          <>
            <h2 className="mt-8 text-2xl font-black">Travel guides</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {d.guides.map((g: any) => (
                <Link key={g.id} href={`/guides/${g.slug}`} className="card p-5 transition hover:shadow-md">
                  <b>{g.title}</b>
                  <p className="mt-1 text-sm text-slate-500">{g.summary}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}