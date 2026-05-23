import { Header } from '@/components/Header';
import { notFound } from 'next/navigation';
import { Guide } from '@/lib/api';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const g: Guide = await fetch(API + '/guides/' + slug, { cache: 'no-store' }).then((r) => r.json());
    return { title: `${g.title} | Destination Africa`, description: g.summary };
  } catch {
    return { title: 'Travel Guide | Destination Africa' };
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let g: Guide | null = null;
  try {
    const r = await fetch(API + '/guides/' + slug, { cache: 'no-store' });
    if (r.ok) g = await r.json();
  } catch {}
  if (!g) return notFound();

  return (
    <>
      <Header />
      <main className="section max-w-4xl">
        {g.image_url && (
          <img src={g.image_url} alt={g.title} className="h-80 w-full rounded-3xl object-cover" />
        )}
        <h1 className="mt-6 text-4xl font-black">{g.title}</h1>
        <p className="mt-4 text-lg text-slate-600">{g.summary}</p>
        <article
          className="card prose prose-slate mt-6 max-w-none p-8 leading-8"
          dangerouslySetInnerHTML={{ __html: g.content }}
        />
      </main>
    </>
  );
}