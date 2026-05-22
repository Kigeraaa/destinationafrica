import Link from 'next/link';
import {Header} from '@/components/Header';
import {TourCard} from '@/components/TourCard';
import {notFound} from 'next/navigation';

export default async function Country({params}:any){
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let d:any = null;
  try {
    const r = await fetch(API+'/countries/'+params.country, {cache:'no-store'});
    if (r.ok) d = await r.json();
  } catch {}
  if (!d) return notFound();
  return (
    <><Header/>
    <main className="section">
      <h1 className="text-5xl font-black">{d.country.name}</h1>
      <p className="mt-2 text-slate-600">Popular destinations, guides and verified operators.</p>
      {d.destinations?.length > 0 && <>
        <h2 className="mt-8 text-2xl font-black">Popular destinations</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {d.destinations.map((x:any)=>(
            <div key={x.id} className="card overflow-hidden">
              <img src={x.image_url} className="h-32 w-full object-cover"/>
              <p className="p-4 font-bold">{x.name}</p>
            </div>
          ))}
        </div>
      </>}
      {d.tours?.length > 0 && <>
        <h2 className="mt-8 text-2xl font-black">Tours in {d.country.name}</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {d.tours.map((t:any)=><TourCard key={t.id} tour={t}/>)}
        </div>
      </>}
      {d.guides?.length > 0 && <>
        <h2 className="mt-8 text-2xl font-black">Travel guides</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {d.guides.map((g:any)=>(
            <Link key={g.id} href={`/guides/${g.slug}`} className="card p-5">
              <b>{g.title}</b>
              <p className="text-sm text-slate-500">{g.summary}</p>
            </Link>
          ))}
        </div>
      </>}
    </main></>
  );
}