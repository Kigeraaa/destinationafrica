import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Guide } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Travel Guides | Destination Africa',
  description: 'In-depth travel guides for African destinations, safaris, culture and more.',
};

const FALLBACK = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=60';

interface Props { searchParams: Promise<Record<string, string>> }

export default async function Guides({ searchParams }: Props) {
  const p = await searchParams;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let guides: Guide[] = [];
  let fetchError = false;
  try {
    const r = await fetch(API + '/guides?limit=50&' + new URLSearchParams(p).toString(), { cache: 'no-store' });
    if (r.ok) guides = await r.json();
  } catch { fetchError = true; }

  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black">Travel Guides</h1>
        <p className="mt-2 text-slate-500">In-depth guides to help you plan your African adventure.</p>

        <form className="card mt-6 flex gap-3 p-4">
          <input name="q" defaultValue={p.q || ''} className="input" placeholder="Search guides…" />
          <button className="btn btn-primary">Search</button>
        </form>

        {fetchError ? (
          <div className="card mt-8 p-12 text-center">
            <p className="text-slate-500">Could not load guides. Please try again later.</p>
          </div>
        ) : guides.length === 0 ? (
          <div className="card mt-8 p-12 text-center">
            <p className="text-slate-500">No guides found{p.q ? ` for "${p.q}"` : ''}.</p>
            {p.q && <a href="/guides" className="btn btn-primary mt-4 inline-block">Clear search</a>}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {guides.map((g) => (
              <Link key={g.id} href={`/guides/${g.slug}`} className="card overflow-hidden transition hover:shadow-md">
                <img
                  src={g.image_url || FALLBACK}
                  alt={g.title}
                  className="h-40 w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
                />
                <div className="p-5">
                  <b>{g.title}</b>
                  <p className="mt-1 text-sm text-slate-500">{g.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}