import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { TourCard } from '@/components/TourCard';
import { Tour, Country } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Tours & Experiences | Destination Africa',
  description: 'Browse verified safari, beach, culture and adventure tours across Africa.',
};

interface Category { id: number; slug: string; name: string }
interface ToursData { items: Tour[]; total: number }

interface Props { searchParams: Promise<Record<string, string>> }

export default async function Tours({ searchParams }: Props) {
  const p = await searchParams;
  const qs = new URLSearchParams(p).toString();
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  let data: ToursData = { items: [], total: 0 };
  let countries: Country[] = [];
  let cats: Category[] = [];
  let fetchError = false;

  try {
    [data, countries, cats] = await Promise.all([
      fetch(API + '/tours?limit=100&' + qs, { cache: 'no-store' }).then((r) => r.ok ? r.json() : { items: [], total: 0 }),
      fetch(API + '/countries', { cache: 'no-store' }).then((r) => r.ok ? r.json() : []),
      fetch(API + '/categories', { cache: 'no-store' }).then((r) => r.ok ? r.json() : []),
    ]);
  } catch {
    fetchError = true;
  }

  return (
    <>
      <Header />
      <main className="section">
        <h1 className="text-4xl font-black">Tours & Experiences</h1>
        <form className="card mt-6 grid gap-3 p-4 md:grid-cols-5">
          <input name="q" defaultValue={p.q || ''} className="input" placeholder="Keyword" />
          <select name="country" className="input" defaultValue={p.country || ''}>
            <option value="">All countries</option>
            {countries.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select name="category" className="input" defaultValue={p.category || ''}>
            <option value="">All categories</option>
            {cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <input name="max_price" className="input" defaultValue={p.max_price || ''} placeholder="Max price ($)" />
          <button className="btn btn-primary">Filter</button>
        </form>

        {fetchError ? (
          <div className="card mt-8 p-12 text-center">
            <p className="text-slate-500">Could not connect to the server. Please try again later.</p>
          </div>
        ) : data.items.length === 0 ? (
          <div className="card mt-8 p-12 text-center">
            <p className="text-lg font-bold">No tours found</p>
            <p className="mt-2 text-slate-500">Try adjusting your filters or search term.</p>
            <a href="/tours" className="btn btn-primary mt-4 inline-block">Clear filters</a>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-slate-500">Showing {data.total} experiences</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((t) => <TourCard key={t.id} tour={t} />)}
            </div>
          </>
        )}
      </main>
    </>
  );
}